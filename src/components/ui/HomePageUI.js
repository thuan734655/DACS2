import React, { useEffect, useLayoutEffect, useState } from "react";
import Sidebar from "./SidebarUI";
import HeaderUI from "./HeaderUI";
import FormCreatePost from "./FormCreatePostUI.js";
import SocialPost from "./SocialPost.js";
import NavCreatePostUI from "./NavCreatePostUI";
import { getPosts } from "../../services/postService";

const HomePageUI = () => {
  const [formCreatePostVisible, setFormCreatePostVisible] = useState(false);
  const [listPosts, setListPosts] = useState({});

  const loadPosts = async () => {
    try {
      const response = await getPosts();
      if (response && response.data) {
        setListPosts(response.data);
        localStorage.setItem("postData", JSON.stringify(response.data));
      } else {
        setListPosts({});
      }
    } catch (error) {
      console.error("Lỗi khi tải bài viết:", error);
    }
  };

  // Tải bài viết khi component được mount
  useLayoutEffect(() => {
    loadPosts();
  }, []);

  return (
    <div className="h-screen overflow-hidden">
      {/* Header */}
      <HeaderUI />

      {/* Main Content */}
      <div className="grid grid-cols-12 gap-4 px-2 py-6 h-full">
        {/* Sidebar - Chiếm 3 cột */}
        <div className="col-span-3 pt-10 overflow-y-auto">
          <Sidebar />
        </div>

        {/* Post - Chiếm 6 cột */}
        <div className="col-span-6 pt-10 h-full overflow-y-auto grid gap-4">
          {/* Phần tạo bài viết */}
          <div>
            <NavCreatePostUI
              setFormCreatePostVisible={setFormCreatePostVisible}
            />
            {formCreatePostVisible && (
              <FormCreatePost
                setFormCreatePostVisible={setFormCreatePostVisible}
                reloadPosts={loadPosts} // Truyền hàm reloadPosts để tải lại danh sách
              />
            )}
          </div>

          {/* Hiển thị các bài viết */}
          <div className="grid gap-4">
            {Object.keys(listPosts).length === 0 ? (
              <div>Chưa có bài viết nào.</div>
            ) : (
              Object.entries(listPosts).map(([postId, postData]) => {
                if (!postData || !postData.post) {
                  // Nếu không có dữ liệu bài viết, bỏ qua
                  console.warn(
                    `Dữ liệu không hợp lệ cho bài viết với ID ${postId}`,
                    postData
                  );
                  console.log(postData.post);
                  return null;
                }
                return (
                  <SocialPost
                    key={postId}
                    postId={postId}
                    groupedLikes = {postData.groupedLikes}
                    post={postData.post}
                    user={postData.infoUserList[postData.post.idUser]}
                  />
                );
              })
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
