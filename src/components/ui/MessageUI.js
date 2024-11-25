import React, { useEffect, useState } from "react";
import ListUI from "../ui/ChatForm/List/ListUI";
import ChatUI from "../ui/ChatForm/Chat/ChatUI";
import DetailUI from "../ui//ChatForm/Detail/DetailUI";
import Notification from "../ui/ChatForm/Notification/Notification";

import {
  getInfoUser,
  getConversationPartner,
} from "../../services/loginService";

const MessageUI = () => {
  const [infoUser, setInfoUser] = useState(null);
  const [conversationPartner, setConversationPartner] = useState(null);
  const [idUser, setIdUser] = useState(localStorage.getItem("idUser"));
  useEffect(() => {
    const fetchInfoUser = async () => {
      try {
        const infoUser = await getInfoUser(idUser);
        setInfoUser(infoUser.data.data);
        console.log(infoUser.data.data);

        // Fetch conversation partner's information
        const partnerResponse = await getConversationPartner(idUser);
        setConversationPartner(partnerResponse.data.data);            
      } catch (error) {
        console.error("Error fetching user information:", error);
      }
    };
    
    fetchInfoUser();
  }, [idUser]); // Add dependencies as needed.

  return (
    <div className="flex justify-center items-center w-screen h-screen fixed">
      <div className="w-[90vw] h-[90vh] bg-custom-dark rounded-xl backdrop-blur-xl flex ">
        <div className="flex-1">
          <ListUI ></ListUI>
        </div>
        <div className="flex-[2] border-l border-r h-full">
          <ChatUI
            user1={infoUser ? infoUser.fullName : "loading"}
            user2={conversationPartner ? conversationPartner.fullName : "user"}
          ></ChatUI>
        </div>
        <div className="flex-1">
          <DetailUI></DetailUI>
        </div>
      </div>
      <div>
        <Notification></Notification>
      </div>
    </div>
  );
};

export default MessageUI;