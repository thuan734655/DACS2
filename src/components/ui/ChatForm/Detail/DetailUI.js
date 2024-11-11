import React from "react";
import Avatar from "../../../.././assets/imgs/avatar.png";
import ArrowUp from "../../../.././assets/imgs/arrowUp.png";
import ArrowDown from "../../../.././assets/imgs/arrowDown.png";
import Download from "../../../.././assets/imgs/download.png";

const DetailUI = () => {
  return (
    <div className="p-5 rounded-lg max-w-md mx-auto">
      <div className="user flex items-center justify-center gap-5 p-[30px] flex-col border-b">
        <img
          src={Avatar}
          alt="User Avatar"
          className="w-12 h-12 rounded-full"
        />
        <div className="text-center">
          <h2 className="text-xl font-semibold">Hoang Phi</h2>
          <p className="text-sm text-gray-500">Lorem ipsum dolor.</p>
        </div>
      </div>

      <div className="info space-y-5 pt-[50px]">
        {/* Chat Settings */}
        <div className="option">
          <div className="title flex justify-between items-center cursor-pointer">
            <span className="text-lg font-medium">Cài đặt đoạn chat</span>
            <img src={ArrowUp} alt="Expand settings" className="w-4 h-4" />
          </div>
        </div>

        {/* Privacy & Help */}
        <div className="option">
          <div className="title flex justify-between items-center cursor-pointer">
            <span className="text-lg font-medium">
              Quyền riêng tư & trợ giúp
            </span>
            <img src={ArrowUp} alt="Expand privacy" className="w-4 h-4" />
          </div>
        </div>

        {/* Shared Photos */}
        <div className="option">
          <div className="title flex justify-between items-center cursor-pointer">
            <span className="text-lg font-medium">Chia sẻ ảnh</span>
            <img src={ArrowDown} alt="Collapse photos" className="w-4 h-4" />
          </div>
          <div className="photos mt-3 space-y-3">
            <div className="photoItems flex items-center justify-between">
              <div className="photodetail flex items-center gap-3">
                <img
                  src="https://scontent.fdad2-1.fna.fbcdn.net/v/t39.30808-6/431660495_939206387782393_657506016628201315_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=HdJENbKGj6sQ7kNvgGqiHy7&_nc_zt=23&_nc_ht=scontent.fdad2-1.fna&_nc_gid=AKSdeGd2uF14eYggHKloXtn&oh=00_AYBwVXW5_e02LXKvkaFwU6KBHaKZ11iyLEhPZkXAxngk2w&oe=67301125"
                  alt=""
                  className="w-16 h-16 rounded-md object-cover"
                />
                <span className="text-sm">photo_2024_2.png</span>
              </div>
              <img
                src={Download}
                alt="Download icon"
                className="w-5 h-5 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Shared Files */}
        <div className="option">
          <div className="title flex justify-between items-center cursor-pointer">
            <span className="text-lg font-medium">Chia sẻ files</span>
            <img src={ArrowUp} alt="Expand files" className="w-4 h-4" />
          </div>
        </div>

        <button className="w-full bg-red-300 text-white py-2 rounded-lg font-semibold mt-5 hover:bg-red-600">
          Block User
        </button>
      </div>
    </div>
  );
};

export default DetailUI;
