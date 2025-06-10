import React, { useState, useEffect, useRef } from "react";
import { FaPaperclip } from "react-icons/fa";
import Header from "../../Components/Header/Header";
import { useUser } from "../../Contexts/UserContext";
import { useLocation } from 'react-router-dom';
import { messageService } from "../../services/messageService";

export default function Messages({ showHeader = true }) {
  const { user, isLoggedIn } = useUser();
  const location = useLocation();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const socketInitialized = useRef(false);

  useEffect(() => {
    const loadConversations = async () => {
      try {
        setLoading(true);
        const data = await messageService.getConversations(user.id);
        
        // Transformar os dados para o formato esperado pelo componente
        const formattedConversations = data.map(conv => {
          // Determinar quem é o outro usuário na conversa
          const otherUser = conv.senderId._id === user.id ? conv.receiverId : conv.senderId;
          
          return {
            _id: conv._id,
            name: `${otherUser.name} ${otherUser.surname}`,
            role: "usuário",
            lastMessage: {
              content: conv.lastMessage,
              createdAt: conv.updatedAt
            },
            otherUserId: otherUser._id,
            read: conv.read
          };
        });

        console.log('Conversas formatadas:', formattedConversations);

        setConversations(formattedConversations);
        
        // Verificar se há um receiverId na URL
        const params = new URLSearchParams(location.search);
        const receiverId = params.get('receiverId');

        if (receiverId) {
          const existingConversation = formattedConversations.find(conv => 
            conv.otherUserId === receiverId
          );

          if (existingConversation) {
            setSelectedConversation(existingConversation);
          }
        } else if (formattedConversations.length > 0) {
          setSelectedConversation(formattedConversations[0]);
        }
      } catch (err) {
        setError('Erro ao carregar conversas');
        console.error('Erro ao carregar conversas:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      loadConversations();
    }
  }, [location.search, user?.id]);

  // Efeito para carregar mensagens quando uma conversa é selecionada
  useEffect(() => {
    const loadMessages = async () => {
      if (selectedConversation) {
        try {
          setLoading(true);
          const data = await messageService.getConversationHistory(selectedConversation._id);
          // Mapear os dados da API para o formato esperado pelo componente
          const formattedMessages = data.map(msg => ({
            _id: msg._id,
            content: msg.message,
            senderId: msg.senderId,
            createdAt: msg.timestamp
          }));
          setMessages(formattedMessages);
          scrollToBottom();
        } catch (err) {
          setError('Erro ao carregar mensagens');
          console.error('Erro ao carregar mensagens:', err);
        } finally {
          setLoading(false);
        }
      }
    };

    loadMessages();
  }, [selectedConversation]);

  // Efeito para entrar na sala quando uma conversa é selecionada
  useEffect(() => {
    if (selectedConversation) {
      // Entrar na sala da conversa
      messageService.joinRoom(selectedConversation._id);
      console.log('Entrou na sala da conversa:', selectedConversation._id);

      // Configurar listener para mensagens recebidas
      messageService.onMessageReceived((message) => {
        console.log('Mensagem recebida:', message);
        
        // Atualizar a lista de mensagens
        setMessages(prevMessages => {
          // Verificar se a mensagem já existe
          const messageExists = prevMessages.some(m => m._id === message._id);
          if (messageExists) return prevMessages;
          
          return [...prevMessages, {
            _id: message._id,
            content: message.message,
            senderId: message.senderId,
            createdAt: message.timestamp
          }];
        });

        // Atualizar a lista de conversas
        setConversations(prevConversations => {
          return prevConversations.map(conv => {
            if (conv._id === message.conversationId) {
              return {
                ...conv,
                lastMessage: {
                  content: message.message,
                  createdAt: message.timestamp
                }
              };
            }
            return conv;
          });
        });

        scrollToBottom();
      });

      // Configurar listener para erros
      messageService.onError((error) => {
        console.error('Erro no socket:', error);
        setError('Erro na conexão do chat: ' + error.message);
      });

      // Cleanup function
      return () => {
        console.log('Saindo da sala da conversa:', selectedConversation._id);
        const socket = messageService.getSocket();
        if (socket) {
          socket.off('receive_message');
          socket.off('error');
        }
      };
    }
  }, [selectedConversation]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    // Determinar o destinatário correto
    const receiverId = selectedConversation?.otherUserId || new URLSearchParams(location.search).get('receiverId');
    
    // Verificar se o usuário está tentando enviar mensagem para si mesmo
    if (user.id === receiverId) {
      setError('Você não pode enviar mensagens para si mesmo');
      return;
    }

    try {
      // Se não houver conversa selecionada, o socket irá criar uma nova automaticamente
      await messageService.sendMessage(
        user.id,
        receiverId,
        newMessage,
        selectedConversation?._id
      );

      // Limpar o campo de mensagem
      setNewMessage("");
      scrollToBottom();

    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      setError('Erro ao enviar mensagem: ' + error.message);
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Hoje";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Ontem";
    } else {
      return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    }
  };

  if (!isLoggedIn) {
    return <div className="flex justify-center items-center h-screen">Por favor, faça login para acessar as mensagens</div>;
  }

  if (loading) {
    return (
      <div className="flex flex-col h-screen">
        {showHeader && <Header />}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-xl text-gray-600">Carregando conversas...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-screen">
        {showHeader && <Header />}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-xl text-red-600">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      {showHeader && <Header />}
      <div className="flex w-full h-full min-h-0 bg-gradient-to-br from-[#1BAAE9] to-[#093C6B] p-8 gap-8 box-border">
        {/* Conversas */}
        <aside className="w-72 bg-white rounded-xl shadow-lg flex flex-col min-h-0 h-full overflow-y-auto p-8 box-border">
          <h2 className="text-2xl font-bold mb-6">Conversas</h2>
          <div className="flex flex-col gap-2">
            {conversations.map((conversation) => (
              <button
                key={conversation._id}
                onClick={() => setSelectedConversation(conversation)}
                className={`cursor-pointer rounded-lg px-4 py-3 text-left font-semibold focus:outline-none transition-colors ${
                  selectedConversation?._id === conversation._id
                    ? "bg-[#1486B8] text-white"
                    : "bg-white text-gray-800 border border-gray-200 hover:bg-gray-100"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="truncate font-bold">{conversation.name}</div>
                  <div className={`text-xs ${selectedConversation?._id === conversation._id ? "text-white/80" : "text-gray-500"}`}>
                    {formatTime(conversation.lastMessage.createdAt)}
                  </div>
                </div>
                <div className={`text-xs truncate ${selectedConversation?._id === conversation._id ? "text-white/80" : "text-gray-500"}`}>
                  {conversation.lastMessage.content || "Nenhuma mensagem"}
                </div>
                <div className="flex justify-between items-center">
                  <div className={`text-xs ${selectedConversation?._id === conversation._id ? "text-white/60" : "text-gray-400"}`}>
                    {formatDate(conversation.lastMessage.createdAt)}
                  </div>
                  {!conversation.read && (
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </aside>

        {/* Chat principal */}
        <section className="flex-1 flex flex-col bg-white rounded-xl shadow-lg p-8 min-w-0 h-full min-h-0 box-border">
          {selectedConversation || location.search.includes('receiverId') ? (
            <>
              {/* Topo do chat */}
              <div className="flex items-center gap-3 border-b border-gray-200 pb-4 mb-4">
                <div className="w-8 h-8 rounded-full bg-[#1486B8] flex items-center justify-center text-white">
                  {selectedConversation?.name?.[0] || "U"}
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-semibold">{selectedConversation?.name || "Nova conversa"}</span>
                  <span className="text-sm text-gray-500 capitalize">{selectedConversation?.role || "usuário"}</span>
                </div>
              </div>
              
              {/* Mensagens */}
              <div className="flex-1 flex flex-col gap-6 overflow-y-auto pr-2 min-h-0">
                {messages.map((msg) =>
                  msg.senderId === user.id ? (
                    <div className="flex flex-col items-end" key={msg._id}>
                      <div className="bg-[#1486B8] text-white rounded-xl px-5 py-3 max-w-xl shadow-md relative whitespace-pre-line">
                        <span className="block text-base">{msg.content}</span>
                        <span className="block text-xs text-right text-white/80 mt-2">
                          {formatTime(msg.createdAt)}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-2" key={msg._id}>
                      <div className="w-8 h-8 rounded-full bg-[#22346C] flex items-center justify-center text-white">
                        {selectedConversation?.name?.[0] || "U"}
                      </div>
                      <div>
                        <div className="bg-[#22346C] text-white rounded-xl px-5 py-3 max-w-xl shadow-md whitespace-pre-line">
                          <span className="block text-base">{msg.content}</span>
                          <span className="block text-xs text-right text-white/80 mt-2">
                            {formatTime(msg.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Campo de digitação */}
              <form onSubmit={handleSendMessage} className="flex items-center gap-3 mt-6 bg-[#166b8e] rounded-xl px-4 py-2">
                <FaPaperclip className="text-white text-xl cursor-pointer" />
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Digite a mensagem aqui..."
                  className="flex-1 bg-transparent outline-none text-white placeholder:text-white/70 px-2 py-2 text-lg"
                />
                <button type="submit" className="text-white text-3xl font-bold px-2 hover:scale-110 transition-transform">&#8594;</button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Selecione uma conversa para começar
            </div>
          )}
        </section>
      </div>
    </div>
  );
} 