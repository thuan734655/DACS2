import React from "react";
import CreatePost from "./CreatPostUI";
import Sidebar from "./SidebarUI";
import HeaderUI from "./HeaderUI";

const HomePageUI = () => {
  return (
    <div className="h-screen overflow-hidden">
      {/* Header giữ nguyên */}
      <HeaderUI />

      {/* Main Content */}
      <div className="grid grid-cols-12 gap-4 px-2 py-6 h-full">
        {/* Sidebar - Chiếm 3 cột */}
        <div className="col-span-3 pt-10 overflow-y-auto">
          <Sidebar />
        </div>

        {/* Create Post - Chiếm 6 cột */}
        <div className="col-span-6 pt-10 h-full overflow-y-auto ">
          <CreatePost />
        </div>

        {/* Phần Extra Content - Chiếm 2 cột */}
        <div className="col-span-3 h-full overflow-y-auto pt-10 ">
          <div className="bg-gray-100 p-3 rounded-lg shadow-lg">
            {/* Nội dung bên phải */}
            Phần nội dung bên phải
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePageUI;
