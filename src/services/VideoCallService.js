import { getDatabase, ref, set, onValue, remove, get } from 'firebase/database';
import app from '../config/firebaseConfig';

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
      this.localStream.getTracks().forEach(track => {
        track.stop();
      });
      this.localStream = null;
    }
  }

  async initializeCall(localUserId, remoteUserId) {
    try {
      // Dừng các tracks hiện tại nếu có
      await this.stopMediaTracks();

      // Lấy stream mới từ camera và microphone
      this.localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });

      // Tạo RTCPeerConnection mới
      if (this.peerConnection) {
        this.peerConnection.close();
      }

      this.peerConnection = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' }
        ]
      });

      // Thêm local stream vào peer connection
      this.localStream.getTracks().forEach(track => {
        this.peerConnection.addTrack(track, this.localStream);
      });

      // Xử lý remote stream
      this.peerConnection.ontrack = (event) => {
        this.remoteStream = event.streams[0];
        if (this.onRemoteStream) {
          this.onRemoteStream(this.remoteStream);
        }
      };

      // Xử lý ICE candidates
      this.peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          set(ref(db, `calls/${localUserId}_${remoteUserId}/candidates/${Date.now()}`), {
            candidate: event.candidate.toJSON(),
            type: 'sender'
          });
        }
      };

      // Xử lý connection state changes
      this.peerConnection.onconnectionstatechange = () => {
        if (this.peerConnection.connectionState === 'failed') {
          this.endCall(localUserId, remoteUserId);
        }
      };

      return this.localStream;
    } catch (error) {
      console.error('Error initializing call:', error);
      throw error;
    }
  }

  async makeCall(localUserId, remoteUserId) {
    try {
      if (!this.peerConnection) {
        throw new Error('PeerConnection not initialized');
      }

      // Tạo offer
      const offer = await this.peerConnection.createOffer();
      await this.peerConnection.setLocalDescription(offer);

      // Lưu offer vào database
      await set(ref(db, `calls/${localUserId}_${remoteUserId}/offer`), {
        type: offer.type,
        sdp: offer.sdp
      });

      // Lắng nghe answer
      onValue(ref(db, `calls/${localUserId}_${remoteUserId}/answer`), async (snapshot) => {
        const answer = snapshot.val();
        if (answer && this.peerConnection && !this.peerConnection.currentRemoteDescription) {
          await this.peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
          
          // Xử lý pending candidates sau khi set remote description
          while (this.pendingCandidates.length > 0) {
            const candidate = this.pendingCandidates.shift();
            await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
          }
        }
      });

      // Lắng nghe ICE candidates
      onValue(ref(db, `calls/${localUserId}_${remoteUserId}/candidates`), async (snapshot) => {
        if (!snapshot.exists()) return;
        
        snapshot.forEach((childSnapshot) => {
          const data = childSnapshot.val();
          if (data.type === 'receiver') {
            const candidate = data.candidate;
            if (this.peerConnection && this.peerConnection.remoteDescription) {
              this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate))
                .catch(error => console.error('Error adding ICE candidate:', error));
            } else {
              this.pendingCandidates.push(candidate);
            }
          }
        });
      });
    } catch (error) {
      console.error('Error making call:', error);
      throw error;
    }
  }

  async answerCall(localUserId, remoteUserId) {
    try {
      if (!this.peerConnection) {
        throw new Error('PeerConnection not initialized');
      }

      // Lấy offer từ database
      const snapshot = await get(ref(db, `calls/${remoteUserId}_${localUserId}/offer`));
      const offer = snapshot.val();
      
      if (offer) {
        await this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
        
        // Xử lý pending candidates sau khi set remote description
        while (this.pendingCandidates.length > 0) {
          const candidate = this.pendingCandidates.shift();
          await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
        }

        const answer = await this.peerConnection.createAnswer();
        await this.peerConnection.setLocalDescription(answer);

        // Lưu answer vào database
        await set(ref(db, `calls/${remoteUserId}_${localUserId}/answer`), {
          type: answer.type,
          sdp: answer.sdp
        });

        // Lắng nghe ICE candidates
        onValue(ref(db, `calls/${remoteUserId}_${localUserId}/candidates`), async (snapshot) => {
          if (!snapshot.exists()) return;

          snapshot.forEach((childSnapshot) => {
            const data = childSnapshot.val();
            if (data.type === 'sender') {
              const candidate = data.candidate;
              if (this.peerConnection && this.peerConnection.remoteDescription) {
                this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate))
                  .catch(error => console.error('Error adding ICE candidate:', error));
              } else {
                this.pendingCandidates.push(candidate);
              }
            }
          });
        });
      }
    } catch (error) {
      console.error('Error answering call:', error);
      throw error;
    }
  }

  async endCall(localUserId, remoteUserId) {
    try {
      // Dừng media tracks
      await this.stopMediaTracks();

      // Đóng peer connection
      if (this.peerConnection) {
        this.peerConnection.close();
        this.peerConnection = null;
      }

      // Reset các biến
      this.remoteStream = null;
      this.pendingCandidates = [];

      // Xóa dữ liệu call từ database
      await remove(ref(db, `calls/${localUserId}_${remoteUserId}`));
      await remove(ref(db, `calls/${remoteUserId}_${localUserId}`));
    } catch (error) {
      console.error('Error ending call:', error);
      throw error;
    }
  }
}

export default new VideoCallService();