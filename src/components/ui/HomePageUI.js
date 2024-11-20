import React, { useEffect, useState } from "react";
import Sidebar from "./SidebarUI";
import HeaderUI from "./HeaderUI";
import FormCreatePost from "./FormCreatePostUI.js";
import SocialPost from "./SocialPost.js";
import NavCreatePostUI from "./NavCreatePostUI";
import { getPosts } from "../../services/postService";

const HomePageUI = () => {
  const [formCreatePostVisible, setFormCreatePostVisible] = useState(false);
  const [listPosts, setListPosts] = useState([]);

  // Hàm tải lại danh sách bài viết
  const loadPosts = async () => {
    const response = await getPosts();
    if (response) {
      setListPosts(response.data);
      console.log(response.data, "loadPosts");
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

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

        {/* Post - Chiếm 6 cột, dùng Grid cho các bài đăng */}
        <div className="col-span-6 pt-10 h-full overflow-y-auto grid gap-4">
          {/* Phần tạo bài viết */}
          <div>
            <NavCreatePostUI
              setFormCreatePostVisible={setFormCreatePostVisible}
            />
            {formCreatePostVisible && (
              <FormCreatePost
                setFormCreatePostVisible={setFormCreatePostVisible}
                reloadPosts={loadPosts} // Truyền hàm loadPosts để reload khi có bài viết mới
              />
            )}
          </div>

          {/* Hiển thị các bài đăng */}
          <div className="grid gap-4">
            {listPosts.length === 0 ? (
              <div>Chưa có bài viết nào.</div>
            ) : (
              listPosts.map((postData, index) => (
                <SocialPost
                  key={index}
                  postId={postData.postId}
                  post={postData.post}
                  user={postData.user}
                />
              ))
            )}
          </div>
        </div>

        {/* Phần Extra Content - Chiếm 2 cột */}
        <div className="col-span-3 h-full overflow-y-auto pt-10">
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
