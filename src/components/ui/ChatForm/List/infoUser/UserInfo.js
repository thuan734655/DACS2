import React, { useEffect, useState } from "react";
import More from "../../../../../assets/imgs/more.png";
import Edit from "../../../../../assets/imgs/edit.png";
import Video from "../../../../../assets/imgs/video.png";
const UserInfo = () => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    // Lấy dữ liệu từ localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData)); // Cập nhật state
    }
  }, []);

  // Render giao diện
  if (!user) {
    return <p>No user data found.</p>;
  }
  return (
    <div className="p-[20px] flex items-center justify-between">
      <div className="flex items-center gap-[20px]">
        <img
          src={user.avatar}
          alt=""
          className="w-[50px] h-[50px] rounded-full object-cover"
        />
        <span>{user.fullName}</span>
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
