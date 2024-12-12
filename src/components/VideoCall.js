import React, { useEffect, useRef, useState } from 'react';
import { FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash, FaPhone } from 'react-icons/fa';
// Import trực tiếp file âm thanh
import ringPhone from '../assets/sound/ring-phone.mp3';
import telephoneRing from '../assets/sound/telephone-ring.mp3';

const VideoCall = ({ localStream, remoteStream, onEndCall, isIncomingCall }) => {
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isRinging, setIsRinging] = useState(false);
  
  // Khởi tạo Audio với đường dẫn đã import
  const callStartAudioRef = useRef(new Audio(ringPhone));
  const incomingCallAudioRef = useRef(new Audio(telephoneRing));

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  useEffect(() => {
    // Thêm xử lý lỗi khi phát âm thanh
    const playCallStartSound = async () => {
      try {
        await callStartAudioRef.current.play();
      } catch (error) {
        console.error('Error playing call start sound:', error);
      }
    };
    playCallStartSound();
  }, []);

  useEffect(() => {
    if (isIncomingCall) {
      const playIncomingCallSound = async () => {
        try {
          // Thiết lập để âm thanh lặp lại
          incomingCallAudioRef.current.loop = true;
          await incomingCallAudioRef.current.play();
          setIsRinging(true);
        } catch (error) {
          console.error('Error playing incoming call sound:', error);
        }
      };
      playIncomingCallSound();
    }
    
    // Cleanup khi isIncomingCall thay đổi
    return () => {
      if (incomingCallAudioRef.current) {
        incomingCallAudioRef.current.loop = false;
        incomingCallAudioRef.current.pause();
        incomingCallAudioRef.current.currentTime = 0;
        setIsRinging(false);
      }
    };
  }, [isIncomingCall]);

  // Cleanup khi component unmount
  useEffect(() => {
    return () => {
      if (callStartAudioRef.current) {
        callStartAudioRef.current.pause();
        callStartAudioRef.current.currentTime = 0;
      }
      if (incomingCallAudioRef.current) {
        incomingCallAudioRef.current.loop = false;
        incomingCallAudioRef.current.pause();
        incomingCallAudioRef.current.currentTime = 0;
        setIsRinging(false);
      }
    };
  }, []);

  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
      setIsAudioEnabled(audioTrack.enabled);
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      videoTrack.enabled = !videoTrack.enabled;
      setIsVideoEnabled(videoTrack.enabled);
    }
  };

  // Hàm xử lý kết thúc cuộc gọi
  const handleEndCall = () => {
    // Dừng âm thanh
    if (callStartAudioRef.current) {
      callStartAudioRef.current.pause();
      callStartAudioRef.current.currentTime = 0;
    }
    
    // Dừng âm thanh cuộc gọi đến nếu đang phát
    if (incomingCallAudioRef.current) {
      incomingCallAudioRef.current.loop = false;
      incomingCallAudioRef.current.pause();
      incomingCallAudioRef.current.currentTime = 0;
      setIsRinging(false);
    }
    
    // Gọi callback onEndCall
    onEndCall();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-4 w-full max-w-4xl">
        <div className="grid grid-cols-2 gap-4">
          {/* Local Video */}
          <div className="relative">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full rounded-lg bg-gray-900"
            />
            <div className="absolute bottom-4 left-4">
              <p className="text-white bg-black bg-opacity-50 px-2 py-1 rounded">
                Bạn
              </p>
            </div>
          </div>

          {/* Remote Video */}
          <div className="relative">
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full rounded-lg bg-gray-900"
            />
            <div className="absolute bottom-4 left-4">
              <p className="text-white bg-black bg-opacity-50 px-2 py-1 rounded">
                Đối phương
              </p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center space-x-4 mt-4">
          <button
            onClick={toggleAudio}
            className={`p-4 rounded-full ${
              isAudioEnabled ? 'bg-gray-200' : 'bg-red-500 text-white'
            }`}
          >
            {isAudioEnabled ? <FaMicrophone /> : <FaMicrophoneSlash />}
          </button>
          <button
            onClick={toggleVideo}
            className={`p-4 rounded-full ${
              isVideoEnabled ? 'bg-gray-200' : 'bg-red-500 text-white'
            }`}
          >
            {isVideoEnabled ? <FaVideo /> : <FaVideoSlash />}
          </button>
          <button
            onClick={handleEndCall}
            className="p-4 rounded-full bg-red-500 text-white"
          >
            <FaPhone className="transform rotate-135" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoCall;