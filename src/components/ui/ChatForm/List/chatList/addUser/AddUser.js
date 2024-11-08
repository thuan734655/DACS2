import React from "react";
import Avatar from "../../../../../../assets/imgs/avatar.png";
const AddUser = () => {
  return (
    <div className="adduser p-[30px] bg-slate-400 rounded-xl absolute top-0 left-0 right-0 m-auto bottom-0 w-max h-max">
      <form action="" className="flex gap-5">
        <input type="text" placeholder="Username" name="username" className="p-5 rounded-xl border-none outline-none"/>
        <button className="p-5 rounded-xl bg-blue-500 text-white border-none cursor-pointer">Tìm Kiếm</button>
      </form>
      <div className="user mt-14 flex items-center justify-between">
        <div className="detail flex items-center gap-5">
          <img src={Avatar} alt="" className="w-[50px] h-[50px] rounded-[50%]" />
        </div>
        <span>Hoang Phi</span>
        <button className="p-3   rounded-xl bg-blue-500 text-white border-none cursor-pointer">Thêm bạn</button>
      </div>
    </div>
  );
};

export default AddUser;
