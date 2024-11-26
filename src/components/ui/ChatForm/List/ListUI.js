import React from "react";
import ChatList from "../List/chatList/ChatList";
import UserInfo from "../List/infoUser/UserInfo";


const ListUI = () => {
 
  return (
    <div className="h-screen flex flex-col"> {/* Đặt chiều cao cố định cho toàn bộ màn hình */}
      <div className="flex-none"> {/* Đặt UserInfo ở trên cùng */}
        <UserInfo />
      </div>
      <div className="flex-1"> {/* Cuộn và ẩn thanh cuộn */}
        <ChatList />
      </div>
    </div>
  );
};

export default ListUI;
