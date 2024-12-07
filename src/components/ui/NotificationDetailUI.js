import {React, useState, useEffect} from 'react';
import io from "socket.io-client";
import SocialPost from './SocialPost';

const socket = io("http://localhost:5000");


const NotificationDetailUI = ({notification,onback}) => {
  const user = JSON.parse(localStorage.getItem("user")); 
  const [isPost, setIsPost] = useState( notification.type === 'POST_REACTION' || notification.type === 'POST_COMMENT' ||  notification.type === 'POST_REPLY_COMMENT' || notification.type === 'POST_REPLY_TO_REPLY' ||notification.type === 'POST_SHARE');
  const [dataNotification, setDataNotification] = useState({});
  const [isLoad, setLoad] = useState(true);
  useEffect(() => {
    socket.on("res_getPostById", (data) => {
      setDataNotification(data);
      setLoad(false);
    });
    socket.emit("getPostById", { postId: notification.postId });

  }, []);
  return (
    <div>
      {isLoad && <div className="text-center py-4">Đang tải bài viết...</div>}
      { isPost && isLoad === false  && (
        <SocialPost postId={dataNotification.post.postId} post = {dataNotification.post} user={user} groupedLikes = {dataNotification.groupedLikes} commentCountDefault = {dataNotification.commentCount}/>
      )}
    </div>
  );
};

export default NotificationDetailUI;