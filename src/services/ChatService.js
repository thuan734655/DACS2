import { getDatabase, ref, push, onValue } from 'firebase/database';
import app from '../config/firebaseConfig';

const db = getDatabase(app);

const generateRoomId = (userId1, userId2) => {
  const sortedIds = [userId1, userId2].sort();
  return `${sortedIds[0]}_${sortedIds[1]}`;
};

const convertFileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};

export const sendMessage = async (senderId, receiverId, message, file = null) => {
  const roomId = generateRoomId(senderId, receiverId);
  const chatRef = ref(db, `chats/${roomId}`);
  
  let fileData = null;
  let fileInfo = null;
  
  if (file) {
    fileData = await convertFileToBase64(file);
    fileInfo = {
      name: file.name,
      type: file.type,
      size: file.size
    };
  }

  await push(chatRef, {
    senderId,
    message: message || '',
    fileData,
    fileInfo,
    timestamp: Date.now(),
    type: file ? 'file' : 'text'
  });
};

export const subscribeToChat = (userId1, userId2, callback) => {
  const roomId = generateRoomId(userId1, userId2);
  const chatRef = ref(db, `chats/${roomId}`);
  
  const unsubscribe = onValue(chatRef, (snapshot) => {
    const messages = [];
    snapshot.forEach((childSnapshot) => {
      messages.push({
        id: childSnapshot.key,
        ...childSnapshot.val()
      });
    });
    callback(messages);
  });

  return unsubscribe;
};