import axios from 'axios';
import io from 'socket.io-client';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

let socket = null;

export const initializeSocket = (token) => {
  if (socket) {
    socket.disconnect();
  }

  socket = io(API_URL, {
    auth: {
      token
    }
  });

  return socket;
};

export const getConversations = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/messages/conversations`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar conversas:', error);
    throw error;
  }
};

export const getMessages = async (conversationId, token) => {
  try {
    const response = await axios.get(`${API_URL}/messages/conversation/${conversationId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar mensagens:', error);
    throw error;
  }
};

export const sendMessage = (conversationId, receiverId, content) => {
  return new Promise((resolve, reject) => {
    if (!socket) {
      reject(new Error('Socket não inicializado'));
      return;
    }

    socket.emit('send_message', {
      conversationId,
      receiverId,
      content
    }, (response) => {
      if (response.error) {
        reject(response.error);
      } else {
        resolve(response);
      }
    });
  });
};

export const joinConversation = (conversationId) => {
  if (!socket) {
    throw new Error('Socket não inicializado');
  }

  socket.emit('join_conversation', conversationId);
};

export const markMessageAsRead = async (messageId, token) => {
  try {
    await axios.put(`${API_URL}/messages/${messageId}/read`, {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  } catch (error) {
    console.error('Erro ao marcar mensagem como lida:', error);
    throw error;
  }
}; 