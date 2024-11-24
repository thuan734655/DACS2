import React, { useEffect, useState } from "react";
import Sidebar from "./SidebarUI";
import HeaderUI from "./HeaderUI";
import FormCreatePost from "./FormCreatePostUI";
import SocialPost from "./SocialPost";
import NavCreatePostUI from "./NavCreatePostUI";
import { getPosts } from "../../services/postService";

const HomePageUI = () => {
  const [formCreatePostVisible, setFormCreatePostVisible] = useState(false);
  const [listPosts, setListPosts] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadPosts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getPosts();
      if (response && response.data) {
        setListPosts(response.data);
        localStorage.setItem("postData", JSON.stringify(response.data));
      } else {
        setListPosts({});
      }
    } catch (error) {
      console.error("Lỗi khi tải bài viết:", error);
      setError("Không thể tải bài viết. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  return (
    <div className="h-screen overflow-hidden">
      <HeaderUI />
      <div className="grid grid-cols-12 gap-4 px-2 py-6 h-full">
        <div className="col-span-3 pt-10 overflow-y-auto">
          <Sidebar />
        </div>
        <div className="col-span-6 pt-10 h-full overflow-y-auto grid gap-4">
          <div>
            <NavCreatePostUI
              setFormCreatePostVisible={setFormCreatePostVisible}
            />
            {formCreatePostVisible && (
              <FormCreatePost
                setFormCreatePostVisible={setFormCreatePostVisible}
                reloadPosts={loadPosts}
              />
            )}
          </div>
          <div className="grid gap-4">
            {isLoading ? (
              <div>Đang tải bài viết...</div>
            ) : error ? (
              <div className="text-red-500">{error}</div>
            ) : Object.keys(listPosts).length === 0 ? (
              <div>Chưa có bài viết nào.</div>
            ) : (
              Object.entries(listPosts).map(([postId, postData]) => {
                if (!postData || !postData.post) {
                  console.warn(
                    `Dữ liệu không hợp lệ cho bài viết với ID ${postId}`,
                    postData
                  );
                  return null;
                }
                return (
                  <SocialPost
                    key={postId}
                    postId={postId}
                    groupedLikes={postData.groupedLikes}
                    comments={postData.comments}
                    post={postData.post}
                    user={postData.infoUserList[postData.post.idUser]}
                  />
                );
              })
            )}
          </div>
        </div>
        <div className="col-span-3 h-full overflow-y-auto pt-10">
          <div className="bg-gray-100 p-3 rounded-lg shadow-lg">
            Phần nội dung bên phải
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePageUI;
