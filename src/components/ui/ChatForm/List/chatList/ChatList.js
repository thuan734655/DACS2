import React, { useState } from "react";
import Search from "../../../../../assets/imgs/search.png";
import Plus from "../../../../../assets/imgs/plus.png";
import Minus from "../../../../../assets/imgs/minus.png";
import Avatar from "../../../../../assets/imgs/avatar.png";
import AddUser from "./addUser/AddUser";

const ChatList = () => {
  const [addMode, setAddMode] = useState(false);

  return (
    <div className="flex-1 h-[730px] overflow-y-auto"> {/* Đặt chiều cao cố định và bật cuộn dọc */}
      <div className="flex items-center gap-5 p-5">
        <div className="flex flex-1 bg-zinc-600 rounded-xl items-center gap-5 p-[9px]">
          <img className="w-7 h-7 cursor-pointer" src={Search} alt="" />
          <input
            className="bg-transparent border-none outline-none text-white flex-1"
            type="text"
            placeholder="Tìm kiếm"
          />
        </div>
        <img
          className="w-10 h-10 cursor-pointer bg-zinc-600 rounded-xl p-[10px]"
          src={addMode ? Minus : Plus}
          alt=""
          onClick={() => setAddMode((prev) => !prev)}
        />
      </div>

      {/* Các phần tử tin nhắn trong danh sách */}
      <div className="flex items-center gap-5 p-5 cursor-pointer border-b-gray-500 border-b boder-b-2">
        <img
          className="w-[50px] h-[50px] rounded-full object-cover"
          src={Avatar}
          alt=""
        />
        <div className="flex flex-col gap-[10]">
          <span className="font-medium">Van Thuan</span>
          <p className="text-xs font-normalt-">Hello</p>
        </div>
      </div>
      <div className="flex items-center gap-5 p-5 cursor-pointer border-b-gray-500 border-b boder-b-2">
        <img
          className="w-[50px] h-[50px] rounded-full object-cover"
          src={Avatar}
          alt=""
        />
        <div className="flex flex-col gap-[10]">
          <span className="font-medium">Van Thuan</span>
          <p className="text-xs font-normalt-">Hello</p>
        </div>
      </div>
      <div className="flex items-center gap-5 p-5 cursor-pointer border-b-gray-500 border-b boder-b-2">
        <img
          className="w-[50px] h-[50px] rounded-full object-cover"
          src={Avatar}
          alt=""
        />
        <div className="flex flex-col gap-[10]">
          <span className="font-medium">Van Thuan</span>
          <p className="text-xs font-normalt-">Hello</p>
        </div>
      </div>
     { addMode && <AddUser/>}
      {/* Lặp lại các phần tử tin nhắn tương tự ở trên */}
    </div>
  );
};

export default ChatList;
