import React, { useEffect, useState } from "react";
import ChatList from "../List/chatList/ChatList";
import UserInfo from "../List/infoUser/UserInfo";
import {
  getConversationPartner,
  getInfoUser
} from "../../../../services/loginService";

const ListUI = () => {
  const [infoUser, setInfoUser] = useState(null);
  const [idUser, setIdUser] = useState(localStorage.getItem("idUser"));
  const [conversationPartner, setConversationPartner] = useState(null);
  useEffect(() => {
    const fetchInfoUser = async () => {
      try {
        const infoUser = await getInfoUser(idUser);
        setInfoUser(infoUser.data.data);
        const partnerResponse = await getConversationPartner(idUser);
        setConversationPartner(partnerResponse.data.data);    
        console.log(partnerResponse.data.data); 
      } catch (error) {
        console.error("Error fetching user information:", error);
      }
    };
  
    
    fetchInfoUser();
  }, [idUser]); // Add dependencies as needed.

  return (
    <div className="h-screen flex flex-col"> {/* Đặt chiều cao cố định cho toàn bộ màn hình */}
      <div className="flex-none"> {/* Đặt UserInfo ở trên cùng */}
        <UserInfo user1={conversationPartner ? conversationPartner.fullName : "user"}/>
      </div>
      <div className="flex-1"> {/* Cuộn và ẩn thanh cuộn */}
        <ChatList />
      </div>
    </div>
  );
};

export default ListUI;
