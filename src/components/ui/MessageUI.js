import React from "react";
import ListUI from "../ui/ChatForm/List/ListUI";
import ChatUI from "../ui/ChatForm/Chat/ChatUI";
import DetailUI from "../ui//ChatForm/Detail/DetailUI";
import Notification from "../ui/ChatForm/Notification/Notification";
const MessageUI = () => {
  return (
    <div className="flex justify-center items-center w-screen h-screen fixed">
      <div className="w-[90vw] h-[90vh] bg-custom-dark rounded-xl backdrop-blur-xl flex ">
        <div className="flex-1">
          <ListUI></ListUI>
        </div>
        <div className="flex-[2] border-l border-r h-full">
          <ChatUI></ChatUI>
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
