// src/services/chatService.js
import { db } from "../config/firebase";
import { collection, addDoc, query, onSnapshot, orderBy, serverTimestamp, where, getDocs, doc, setDoc, getDoc } from "firebase/firestore";
import { userService } from "./userService";

const getUserData = async (userId) => {
  try {
    const userData = await userService.getUserById(userId);
    return {
      id: userId,
      name: userData.name || userData.displayName || "Usuário",
      role: userData.role || "usuário",
      photoURL: userData.photoURL || null
    };
  } catch {
    return { id: userId, name: "Usuário", role: "usuário", photoURL: null };
  }
};

const getUserChats = async (userId) => {
  const chatsRef = collection(db, "chats");
  const q = query(chatsRef, where("participants", "array-contains", userId));
  
  const snapshot = await getDocs(q);
  const chats = await Promise.all(
    snapshot.docs.map(async doc => {
      const chatData = doc.data();
      const otherUserId = chatData.participants.find(id => id !== userId);
      const otherUserData = await getUserData(otherUserId);
      
      return {
        _id: doc.id,
        ...chatData,
        otherUser: otherUserData
      };
    })
  );

  return chats.sort((a, b) => {
    const timeA = a.lastMessage?.timestamp?.toDate() || new Date(0);
    const timeB = b.lastMessage?.timestamp?.toDate() || new Date(0);
    return timeB - timeA;
  });
};

const getOrCreateChat = async (userId1, userId2) => {
  const chatId = [userId1, userId2].sort().join('_');
  const chatRef = doc(db, "chats", chatId);
  
  const chatDoc = await getDoc(chatRef);
  
  if (!chatDoc.exists()) {
    return null;
  }

  return chatId;
};

const createChat = async (userId1, userId2) => {
  const chatId = [userId1, userId2].sort().join('_');
  const chatRef = doc(db, "chats", chatId);
  
  await setDoc(chatRef, {
    participants: [userId1, userId2],
    createdAt: serverTimestamp(),
    lastMessage: null
  });

  return chatId;
};

const sendMessage = async (chatId, senderId, text) => {
  if (!chatId || !senderId || !text.trim()) return;

  const messageData = {
    senderId,
    text,
    timestamp: serverTimestamp()
  };

  await addDoc(collection(db, "chats", chatId, "messages"), messageData);
  await setDoc(doc(db, "chats", chatId), {
    lastMessage: { ...messageData }
  }, { merge: true });
};

const listenToMessages = (chatId, callback) => {
  if (!chatId || !callback) return;

  const q = query(
    collection(db, "chats", chatId, "messages"),
    orderBy("timestamp", "asc")
  );

  return onSnapshot(q, snapshot => 
    callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
  );
};

export const chatService = {
  getUserData,
  getUserChats,
  getOrCreateChat,
  createChat,
  sendMessage,
  listenToMessages
};
