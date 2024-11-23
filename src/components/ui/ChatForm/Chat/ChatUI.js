import React, { useEffect, useRef, useState } from "react";
import { set, ref, push, onValue, serverTimestamp } from "firebase/database";
import { database } from "../../../../config/firebaseConfig";
import EmojiPicker from "emoji-picker-react";
import useCurrentUser from "./UseCurrentUser";
import Peer from "simple-peer";

// Import your assets here
import Avatar from "../../../../assets/imgs/avatar.png";
import Video from "../../../../assets/imgs/video.png";
import Info from "../../../../assets/imgs/info.png";
import Emoji from "../../../../assets/imgs/emoji.png";
import Img from "../../../../assets/imgs/img.png";
import { camera, phone, mic } from "../../../../assets/imgs";
import { initializeUser } from "./initializeUser";

const getChatId = (user1, user2) => {
  if (!user1 || !user2) {
    throw new Error("User1 or User2 is missing for chatId generation");
  }
  return [user1.idUser, user2.idUser].sort().join("_"); // Tạo chatId theo thứ tự
};

const ChatUI = ({ user1, user2 }) => {
  const currentUser = useCurrentUser();
  const [openEmoji, setOpenEmoji] = useState(false);
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const endRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const audioRef = useRef(null);
  const [isVideoCallActive, setIsVideoCallActive] = useState(false);
  const handleEmoji = (e) => {
    setText((prev) => prev + e.emoji);
    setOpenEmoji(false);
  };
  const sendMessage = () => {
    // Kiểm tra text (nội dung tin nhắn), user1 và user2 trước khi gửi
    if (!text.trim()) {
      console.log("Text message is empty");
      return; // Không gửi nếu tin nhắn trống hoặc chỉ chứa khoảng trắng
    }

    if (!user1 || !user2) {
      console.log("User1 or User2 is missing");
      return; // Nếu user1 hoặc user2 không tồn tại, không gửi tin nhắn
    }

    if (!currentUser) {
      console.log("Current user is missing");
      return; // Nếu currentUser không tồn tại, không gửi tin nhắn
    }

    // Tạo chatId dựa trên user1 và user2
    const chatId = getChatId(user1, user2);

    const messageData = {
      content: text, // Nội dung tin nhắn
      type: "text",
      timestamp: serverTimestamp(),
      senderId: user1.idUser, // Gửi từ user1
      senderName: user1.fullName,
      receiverId: user2.idUser, // Gửi tới user2
    };
    if (!messageData.senderId || !messageData.receiverId) {
      console.error("Message data is missing senderId or receiverId:", messageData);
      return;
    } 
    console.log(messageData);
    
    
    // Đẩy tin nhắn vào Realtime Database
    push(ref(database, `chats/${chatId}/messages`), messageData)
      .then(() => {
        console.log("Message sent successfully!");
        setText(""); // Sau khi gửi, xóa nội dung tin nhắn
      })
      .catch((error) => {
        console.error("Error sending message:", error);
      });
  };

  useEffect(() => {
    // Kiểm tra và khởi tạo user1 và user2 trong Firebase
    console.log("User1:", user1);
    console.log("User2:", user2);
    if (user1 && user2) {
      initializeUser(user1); // Khởi tạo user1
      initializeUser(user2); // Khởi tạo user2
    }
  }, [user1, user2]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        sendMessage(reader.result, "image");
      };
      reader.readAsDataURL(file);
    }
  };

  const startRecording = () => {
    setIsRecording(true);
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const mediaRecorder = new MediaRecorder(stream);
      audioRef.current = mediaRecorder;
      mediaRecorder.start();

      const audioChunks = [];
      mediaRecorder.addEventListener("dataavailable", (event) => {
        audioChunks.push(event.data);
      });

      mediaRecorder.addEventListener("stop", () => {
        const audioBlob = new Blob(audioChunks);
        const reader = new FileReader();
        reader.onloadend = () => {
          sendMessage(reader.result, "audio");
        };
        reader.readAsDataURL(audioBlob);
      });
    });
  };

  const stopRecording = () => {
    setIsRecording(false);
    audioRef.current.stop();
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      // Chỉ gửi tin nhắn nếu người dùng nhấn phím Enter (không phải Shift+Enter)
      sendMessage();
      e.preventDefault(); // Ngừng hành vi mặc định của Enter (tạo một dòng mới)
    }
  };

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const startVideoCall = async () => {
    if (!isVideoCallActive) {
      // Only start the call if it's not already active
      setIsVideoCallActive(true); // Set video call state to active

      const chatId = getChatId(user1, user2);

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        const peer = new Peer({
          initiator: true,
          trickle: false,
          stream: stream,
        });

        peer.on("signal", (signal) => {
          const callerRef = ref(database, `calls/${chatId}/caller`);
          set(callerRef, {
            signal: signal,
            user: currentUser,
          });
        });

        const receiverRef = ref(database, `calls/${chatId}/receiver/signal`);
        onValue(receiverRef, (snapshot) => {
          const receiverSignal = snapshot.val();
          if (receiverSignal) {
            peer.signal(receiverSignal);
          }
        });

        peer.on("stream", (remoteStream) => {
          const videoElement = document.getElementById("remoteVideo");
          if (videoElement) {
            videoElement.srcObject = remoteStream;
          }
        });

        const localVideoElement = document.getElementById("localVideo");
        if (localVideoElement) {
          localVideoElement.srcObject = stream;
        }
      } catch (error) {
        console.error("Error starting video call:", error);
      }
    } else {
      setIsVideoCallActive(false); // Stop the video call if it's active
      const localVideoElement = document.getElementById("localVideo");
      const remoteVideoElement = document.getElementById("remoteVideo");

      // Safely stop the tracks only if the video elements are available
      if (localVideoElement && localVideoElement.srcObject) {
        localVideoElement.srcObject
          .getTracks()
          .forEach((track) => track.stop()); // Stop local video
      }

      if (remoteVideoElement && remoteVideoElement.srcObject) {
        remoteVideoElement.srcObject
          .getTracks()
          .forEach((track) => track.stop()); // Stop remote video
      }
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-5 flex items-center justify-between border-b">
        <div className="flex items-center gap-5">
          <img
            className="w-[60px] h-[60px] rounded-full object-cover"
            src={Avatar}
            alt=""
          />
          <div className="flex flex-col gap-1">
            <span className="text-xl font-bold">{user1}</span>
            <span className="text-xl font-bold">{user2}</span>
            <p className="text-[14px] font-light text-gray-600">Online</p>
          </div>
        </div>
        <div className="flex gap-5">
          <img className="h-8 w-8" src={phone} alt="" />
          <img
            className="h-8 w-8"
            src={Video}
            alt=""
            onClick={startVideoCall}
          />
          <img className="h-8 w-8" src={Info} alt="" />
        </div>
      </div>
      {isVideoCallActive && (
        <div className="flex ml-[50px]">
          <video
            id="localVideo"
            className="w-[300px] h-[200px] rounded-lg border"
            autoPlay
            playsInline
            muted
          ></video>
          <video
            id="remoteVideo"
            className="w-[300px] h-[200px] rounded-lg border"
            autoPlay
            playsInline
          ></video>
        </div>
      )}
      <div className="p-5 flex-1 h-[600px] overflow-y-scroll scrollbar-hide flex flex-col gap-5">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-start max-w-[70%] gap-2 ${
              msg.senderId === currentUser.idUser
                ? "self-end flex-row-reverse"
                : ""
            }`}
          >
            {msg.senderId !== currentUser.idUser && (
              <img
                className="w-11 h-11 rounded-full object-cover"
                src={Avatar}
                alt=""
              />
            )}
            <div
              className={`Texts ${
                msg.senderId === currentUser.idUser
                  ? "bg-blue-100"
                  : "bg-gray-200"
              } p-3 rounded-lg flex-1`}
            >
              {msg.type === "text" && <p className="text-sm">{msg.content}</p>}
              {msg.type === "image" && (
                <img
                  src={msg.content}
                  alt="Sent content"
                  className="max-w-full h-auto"
                />
              )}
              {msg.type === "audio" && <audio src={msg.content} controls />}
              <span className="text-xs text-gray-500">
                {new Date(msg.timestamp).toLocaleString()}
              </span>
            </div>
          </div>
        ))}

        <div ref={endRef}></div>
      </div>

      <div className="p-5 flex items-center justify-between border-t gap-5">
        <div className="flex gap-5">
          <label className="cursor-pointer">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
            <img className="w-5 h-5" src={Img} alt="Upload file" />
          </label>
          <img className="w-5 h-5 cursor-pointer" src={camera} alt="" />
          {isRecording ? (
            <img
              className="w-5 h-5 cursor-pointer"
              src={mic}
              alt="Stop recording"
              onClick={stopRecording}
            />
          ) : (
            <img
              className="w-5 h-5 cursor-pointer"
              src={mic}
              alt="Start recording"
              onClick={startRecording}
            />
          )}
        </div>
        <input
          type="text"
          placeholder="Soạn tin nhắn..."
          className="flex-1 bg-zinc-500 border-none outline-none text-white p-1 rounded-xl text-[16px]"
          onChange={(e) => setText(e.target.value)}
          value={text}
          onKeyDown={handleKeyDown}
        />
        <div className="relative">
          <img
            className="w-5 h-5 cursor-pointer"
            src={Emoji}
            alt=""
            onClick={() => setOpenEmoji((prev) => !prev)}
          />
          {openEmoji && (
            <div className="absolute bottom-12 left-0">
              <EmojiPicker onEmojiClick={handleEmoji} />
            </div>
          )}
        </div>
        <button
          className="bg-blue-500 text-white px-4 py-2 border-none rounded cursor-pointer"
          onClick={() => sendMessage()}
        >
          Gửi
        </button>
      </div>
    </div>
  );
};

export default ChatUI;
