import React from "react";
import Avatar from "../../../../../assets/imgs/avatar.png";
import More from "../../../../../assets/imgs/more.png";
import Edit from "../../../../../assets/imgs/edit.png";
import Video from "../../../../../assets/imgs/video.png";
const UserInfo = ({user1}) => {
  return (
    <div className="p-[20px] flex items-center justify-between">
      <div className="flex items-center gap-[20px]">
        <img
          src={Avatar}
          alt=""
          className="w-[50px] h-[50px] rounded-full object-cover"
        />
        <span>{user1}</span>
      </div>
      <div className="flex gap-[20px] cursor-pointer">
        <img className="h-5 w-5" src={More} alt="" />
        <img className="h-5 w-5" src={Video} alt="" />
        <img className="h-5 w-5" src={Edit} alt="" />
      </div>
    </div>
  );
};

export default UserInfo;
