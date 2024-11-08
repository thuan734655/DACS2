import React, { useEffect, useRef, useState } from "react";
import Avatar from "../../../.././assets/imgs/avatar.png";
import Phone from "../../../.././assets/imgs/phone.png";
import Video from "../../../.././assets/imgs/video.png";
import Info from "../../../.././assets/imgs/info.png";
import Emoji from "../../../.././assets/imgs/emoji.png";
import Img from "../../../.././assets/imgs/img.png";
import Camera from "../../../.././assets/imgs/camera.png";
import Mic from "../../../.././assets/imgs/mic.png";
import EmojiPicker from "emoji-picker-react";

const ChatUI = () => {
  const [openEmoji, setOpenEmoji] = useState(false);
  const [text, setText] = useState("");

  const handleEmoji = (e) => {
    setText((prev) => prev + e.emoji);
    setOpenEmoji(false);
  };
  const endRef = useRef(null);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);
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
            <span className="text-xl font-bold">Hoang Phi</span>
            <p className="text-[14px] font-light text-gray-600">Online</p>
          </div>
        </div>
        <div className="flex gap-5">
          <img className="h-8 w-8" src={Phone} alt="" />
          <img className="h-8 w-8" src={Video} alt="" />
          <img className="h-8 w-8" src={Info} alt="" />
        </div>
      </div>

      <div className="p-5 flex-1 h-[600px] overflow-y-scroll scrollbar-hide flex flex-col gap-5">
        {/* Received message */}
        <div className="flex items-start max-w-[70%] gap-2">
          <img
            className="w-11 h-11 rounded-full object-cover"
            src={Avatar}
            alt=""
          />
          <div className="Texts bg-gray-200 p-3 rounded-lg flex-1">
            <p className="text-sm text-gray-700">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              Cupiditate velit quam, ipsa consectetur est quibusdam laudantium
              reprehenderit provident doloremque, deleniti fugit repellendus,
              deserunt vel magnam ipsum nostrum officia et perferendis.
            </p>
            <span className="text-xs text-gray-500">1 min ago</span>
          </div>
          <div ref={endRef}></div>
        </div>

        {/* Sent message with self-end */}
        <div className="flex flex-col items-end self-end max-w-[70%] gap-2">
          <img
            className="w-full h-full rounded-lg object-cover"
            src="https://scontent.fdad2-1.fna.fbcdn.net/v/t39.30808-6/431660495_939206387782393_657506016628201315_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=HdJENbKGj6sQ7kNvgGqiHy7&_nc_zt=23&_nc_ht=scontent.fdad2-1.fna&_nc_gid=AKSdeGd2uF14eYggHKloXtn&oh=00_AYBwVXW5_e02LXKvkaFwU6KBHaKZ11iyLEhPZkXAxngk2w&oe=67301125"
            alt=""
          />
          <div className="Texts bg-blue-100 p-3 rounded-lg flex-1">
            <p className="text-sm">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              Cupiditate velit quam, ipsa consectetur est quibusdam laudantium
              reprehenderit provident doloremque, deleniti fugit repellendus,
              deserunt vel magnam ipsum nostrum officia et perferendis.
            </p>
            <span className="text-xs text-gray-500">1 min ago</span>
          </div>
        </div>
      </div>

      <div className="p-5 flex items-center justify-between border-t gap-5">
        <div className="flex gap-5">
          <img className="w-5 h-5 cursor-pointer" src={Img} alt="" />
          <img className="w-5 h-5 cursor-pointer" src={Camera} alt="" />
          <img className="w-5 h-5 cursor-pointer" src={Mic} alt="" />
        </div>
        <input
          type="text"
          placeholder="Soạn tin nhắn..."
          className="flex-1 bg-zinc-500 border-none outline-none text-white p-1 rounded-xl text-[16px]"
          onChange={(e) => setText(e.target.value)}
          value={text}
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
        <button className="bg-blue-500 text-white px-4 py-2 border-none rounded cursor-pointer">
          Gửi
        </button>
      </div>
    </div>
  );
};

export default ChatUI;
