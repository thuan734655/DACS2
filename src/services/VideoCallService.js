import { getDatabase, ref, set, onValue, remove, get } from "firebase/database";
import app from "../config/firebaseConfig";

const db = getDatabase(app);

class VideoCallService {
  constructor() {
    this.peerConnection = null;
    this.localStream = null;
    this.remoteStream = null;
    this.onRemoteStream = null;
    this.pendingCandidates = [];
  }

  async stopMediaTracks() {
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => {
        track.stop();
      });
      this.localStream = null;
    }
  }

  async initializeCall(localUserId, remoteUserId) {
    try {
      await this.stopMediaTracks();
      this.localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      if (this.peerConnection) {
        this.peerConnection.close();
      }

      this.peerConnection = new RTCPeerConnection({
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          { urls: "stun:stun1.l.google.com:19302" },
        ],
      });

      this.localStream.getTracks().forEach((track) => {
        this.peerConnection.addTrack(track, this.localStream);
      });

      this.peerConnection.ontrack = (event) => {
        this.remoteStream = event.streams[0];
        if (this.onRemoteStream) {
          this.onRemoteStream(this.remoteStream);
        }
      };

      this.peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          set(
            ref(
              db,
              `calls/${localUserId}_${remoteUserId}/candidates/${Date.now()}`
            ),
            {
              candidate: event.candidate.toJSON(),
              type: "sender",
            }
          );
        }
      };

      this.peerConnection.onconnectionstatechange = () => {
        if (this.peerConnection.connectionState === "failed") {
          this.endCall(localUserId, remoteUserId);
        }
      };

      return this.localStream;
    } catch (error) {
      console.error("Error initializing call:", error);
      throw error;
    }
  }

  async makeCall(localUserId, remoteUserId) {
    try {
      if (!this.peerConnection) {
        throw new Error("PeerConnection not initialized");
      }

      const offer = await this.peerConnection.createOffer();
      await this.peerConnection.setLocalDescription(offer);

      await set(ref(db, `calls/${localUserId}_${remoteUserId}/offer`), {
        type: offer.type,
        sdp: offer.sdp,
      });

      onValue(
        ref(db, `calls/${localUserId}_${remoteUserId}/answer`),
        async (snapshot) => {
          const answer = snapshot.val();
          if (
            answer &&
            this.peerConnection &&
            this.peerConnection.signalingState === "have-local-offer"
          ) {
            await this.peerConnection.setRemoteDescription(
              new RTCSessionDescription(answer)
            );
            this._processPendingCandidates();
          }
        }
      );

      onValue(
        ref(db, `calls/${localUserId}_${remoteUserId}/candidates`),
        (snapshot) => {
          if (!snapshot.exists()) return;

          snapshot.forEach((childSnapshot) => {
            const data = childSnapshot.val();
            if (data.type === "receiver") {
              const candidate = new RTCIceCandidate(data.candidate);
              if (
                this.peerConnection &&
                this.peerConnection.remoteDescription
              ) {
                this.peerConnection
                  .addIceCandidate(candidate)
                  .catch(console.error);
              } else {
                this.pendingCandidates.push(candidate);
              }
            }
          });
        }
      );
    } catch (error) {
      console.error("Error making call:", error);
      throw error;
    }
  }

  async answerCall(localUserId, remoteUserId) {
    try {
      if (!this.peerConnection) {
        throw new Error("PeerConnection not initialized");
      }

      const snapshot = await get(
        ref(db, `calls/${remoteUserId}_${localUserId}/offer`)
      );
      const offer = snapshot.val();

      if (offer) {
        if (this.peerConnection.signalingState === "stable") {
          await this.peerConnection.setRemoteDescription(
            new RTCSessionDescription(offer)
          );
        }

        this._processPendingCandidates();

        const answer = await this.peerConnection.createAnswer();
        await this.peerConnection.setLocalDescription(answer);

        await set(ref(db, `calls/${remoteUserId}_${localUserId}/answer`), {
          type: answer.type,
          sdp: answer.sdp,
        });

        onValue(
          ref(db, `calls/${remoteUserId}_${localUserId}/candidates`),
          (snapshot) => {
            if (!snapshot.exists()) return;

            snapshot.forEach((childSnapshot) => {
              const data = childSnapshot.val();
              if (data.type === "sender") {
                const candidate = new RTCIceCandidate(data.candidate);
                if (
                  this.peerConnection &&
                  this.peerConnection.remoteDescription
                ) {
                  this.peerConnection
                    .addIceCandidate(candidate)
                    .catch(console.error);
                } else {
                  this.pendingCandidates.push(candidate);
                }
              }
            });
          }
        );
      }
    } catch (error) {
      console.error("Error answering call:", error);
      throw error;
    }
  }

  async endCall(localUserId, remoteUserId) {
    try {
      await this.stopMediaTracks();

      if (this.peerConnection) {
        this.peerConnection.close();
        this.peerConnection = null;
      }

      this.remoteStream = null;
      this.pendingCandidates = [];

      await remove(ref(db, `calls/${localUserId}_${remoteUserId}`));
      await remove(ref(db, `calls/${remoteUserId}_${localUserId}`));
    } catch (error) {
      console.error("Error ending call:", error);
      throw error;
    }
  }

  _processPendingCandidates() {
    while (this.pendingCandidates.length > 0) {
      const candidate = this.pendingCandidates.shift();
      if (this.peerConnection) {
        this.peerConnection.addIceCandidate(candidate).catch(console.error);
      }
    }
  }
}

export default new VideoCallService();
