import api from './api';
import io from 'socket.io-client';
import Cookies from 'js-cookie';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Criar uma única instância do socket
let socket = null;

const getSocket = () => {
    if (!socket) {
        console.log('Criando nova conexão socket em:', SOCKET_URL);
        socket = io(SOCKET_URL, {
            auth: {
                token: Cookies.get('token')
            },
            transports: ['websocket'], // Forçar uso de WebSocket
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000
        });

        socket.on('connect', () => {
            console.log('Socket conectado com sucesso!');
        });

        socket.on('connect_error', (error) => {
            console.error('Erro ao conectar socket:', error);
        });

        socket.on('disconnect', (reason) => {
            console.log('Socket desconectado:', reason);
        });

        // Debug de eventos do socket
        socket.onAny((eventName, ...args) => {
            console.log(`Evento recebido: ${eventName}`, args);
        });
    }
    return socket;
};

// Função para garantir que o socket está conectado
const ensureSocketConnected = () => {
    return new Promise((resolve, reject) => {
        const socket = getSocket();
        
        if (socket.connected) {
            resolve(socket);
            return;
        }

        // Se não estiver conectado, espera a conexão
        const timeout = setTimeout(() => {
            reject(new Error('Timeout ao conectar socket'));
        }, 5000);

        socket.once('connect', () => {
            clearTimeout(timeout);
            resolve(socket);
        });

        socket.once('connect_error', (error) => {
            clearTimeout(timeout);
            reject(error);
        });
    });
};

// Entrar em uma sala (para receber mensagens)
const joinRoom = (roomId) => {
    const socket = getSocket();
    socket.emit('join', roomId);
    console.log(`Entrou na sala: ${roomId}`);
};

export const messageService = {
    async getConversations(userId) {
        const response = await api.get(`/chat/conversations/${userId}`);
        return response.data;
    },

    async getConversationHistory(conversationId) {
        const response = await api.get(`/chat/messages/${conversationId}`);
        return response.data;
    },

    async createConversation(senderId, receiverId) {
        console.log('Criando conversa com:', { senderId, receiverId });
        const response = await api.post('/chat/conversations', {
            senderId,
            receiverId,
            lastMessage: "Conversa iniciada",
            read: false
        });
        console.log('Resposta da criação da conversa:', response.data);
        return response.data;
    },

    async sendMessage(senderId, receiverId, message, conversationId) {
        console.log('Tentando enviar mensagem:', { senderId, receiverId, message, conversationId });
        
        // Verificar se o usuário está tentando enviar mensagem para si mesmo
        if (senderId === receiverId) {
            console.error('Tentativa de enviar mensagem para si mesmo');
            return Promise.reject(new Error('Você não pode enviar mensagens para si mesmo'));
        }

        try {
            // Garantir que o socket está conectado
            const socket = await ensureSocketConnected();
            
            const messageData = {
                senderId,
                receiverId,
                message,
                conversationId,
                timestamp: new Date()
            };

            socket.emit('send_message', messageData);
            console.log('Mensagem enviada:', messageData);
            return Promise.resolve();
        } catch (error) {
            console.error('Erro ao conectar socket:', error);
            return Promise.reject(error);
        }
    },

    onMessageReceived(callback) {
        console.log('Configurando listener para mensagens recebidas');
        const socket = getSocket();
        
        // Remover listener antigo se existir
        socket.off('receive_message');
        
        // Adicionar novo listener
        socket.on('receive_message', (message) => {
            console.log('Mensagem recebida via socket:', message);
            callback(message);
        });
    },

    onError(callback) {
        const socket = getSocket();
        socket.off('error');
        socket.on('error', (error) => {
            console.error('Erro no socket:', error);
            callback(error);
        });
    },

    joinRoom,
    getSocket,

    disconnect() {
        if (socket) {
            console.log('Desconectando socket');
            socket.disconnect();
            socket = null;
        }
    }
};
