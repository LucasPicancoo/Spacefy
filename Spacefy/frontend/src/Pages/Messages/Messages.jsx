import React, { useState, useEffect, useRef } from "react";
import { FaPaperclip } from "react-icons/fa";
import Header from "../../Components/Header/Header";
import { useUser } from "../../Contexts/UserContext";
import { useLocation } from 'react-router-dom';
import { chatService } from "../../services/chatService";
import { serverTimestamp } from "firebase/firestore";

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

  useEffect(() => {
    const loadConversations = async () => {
      try {
        setLoading(true);
        
        if (user?.id) {
          // Carregar conversas do usuário
          const userChats = await chatService.getUserChats(user.id);
          setConversations(userChats);
          
          const params = new URLSearchParams(location.search);
          const receiverId = params.get('receiverId');

          if (receiverId) {
            try {
              const chatId = await chatService.getOrCreateChat(user.id, receiverId);
              
              if (chatId) {
                // Se o chat já existe, seleciona ele
                const existingChat = userChats.find(chat => chat._id === chatId);
                if (existingChat) {
                  setSelectedConversation(existingChat);
                }
              } else {
                // Se não existe, busca os dados do usuário e cria um objeto temporário para a nova conversa
                const otherUserData = await chatService.getUserData(receiverId);
                const newChat = {
                  _id: null,
                  participants: [user.id, receiverId],
                  lastMessage: null,
                  otherUser: otherUserData
                };
                setSelectedConversation(newChat);
              }
            } catch (error) {
              console.error("Erro ao verificar chat:", error);
              setError("Erro ao iniciar conversa");
            }
          }
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

  useEffect(() => {
    let unsubscribe = null;

    if (selectedConversation?._id) {
      unsubscribe = chatService.listenToMessages(selectedConversation._id, (newMessages) => {
        setMessages(newMessages);
        scrollToBottom();
      });
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [selectedConversation?._id]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      let chatId = selectedConversation?._id;

      // Se não existe um chatId, cria um novo chat
      if (!chatId) {
        chatId = await chatService.createChat(user.id, selectedConversation.participants[1]);
        
        // Atualiza o selectedConversation com o novo chatId
        const updatedConversation = {
          ...selectedConversation,
          _id: chatId,
          lastMessage: {
            text: newMessage,
            timestamp: new Date(),
            senderId: user.id
          }
        };
        
        setSelectedConversation(updatedConversation);
        
        // Adiciona a nova conversa à lista de conversas
        setConversations(prev => [updatedConversation, ...prev]);
      }

      await chatService.sendMessage(chatId, user.id, newMessage);
      setNewMessage("");
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      setError("Erro ao enviar mensagem");
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    
    let date;
    if (timestamp instanceof Date) {
      date = timestamp;
    } else if (typeof timestamp === 'object' && timestamp !== null && 'toDate' in timestamp) {
      date = timestamp.toDate();
    } else {
      return "";
    }
    
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    
    let date;
    if (timestamp instanceof Date) {
      date = timestamp;
    } else if (typeof timestamp === 'object' && timestamp !== null && 'toDate' in timestamp) {
      date = timestamp.toDate();
    } else {
      return "";
    }
    
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
    return (
      <div 
        className="flex justify-center items-center h-screen"
        role="alert"
        aria-label="Mensagem de login necessária"
      >
        Por favor, faça login para acessar as mensagens
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col h-screen">
        {showHeader && <Header />}
        <div 
          className="flex-1 flex items-center justify-center"
          role="status"
          aria-label="Carregando conversas"
        >
          <div className="text-xl text-gray-600">Carregando conversas...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-screen">
        {showHeader && <Header />}
        <div 
          className="flex-1 flex items-center justify-center"
          role="alert"
          aria-label="Mensagem de erro"
        >
          <div className="text-xl text-red-600">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen" role="main" aria-label="Página de mensagens">
      {showHeader && <Header />}
      <div className="flex w-full h-full min-h-0 bg-gradient-to-br from-[#1BAAE9] to-[#093C6B] p-8 gap-8 box-border">
        {/* Conversas */}
        <aside 
          className="w-72 bg-white rounded-xl shadow-lg flex flex-col min-h-0 h-full overflow-y-auto p-8 box-border"
          role="complementary"
          aria-label="Lista de conversas"
        >
          <h2 className="text-2xl font-bold mb-6">Conversas</h2>
          <div className="flex flex-col gap-2" role="list" aria-label="Lista de conversas disponíveis">
            {conversations.map((conversation) => (
              <button
                key={conversation._id}
                onClick={() => setSelectedConversation(conversation)}
                className={`cursor-pointer rounded-lg px-4 py-3 text-left font-semibold focus:outline-none transition-colors ${
                  selectedConversation?._id === conversation._id
                    ? "bg-[#1486B8] text-white"
                    : "bg-white text-gray-800 border border-gray-200 hover:bg-gray-100"
                }`}
                role="listitem"
                aria-label={`Conversa com ${conversation.otherUser?.name || "Usuário"}. ${conversation.lastMessage?.text || "Nenhuma mensagem"}. ${conversation.lastMessage?.timestamp ? `Última mensagem às ${formatTime(conversation.lastMessage.timestamp)}` : ""}`}
                aria-selected={selectedConversation?._id === conversation._id}
              >
                <div className="flex justify-between items-start">
                  <div className="truncate font-bold">{conversation.otherUser?.name || "Usuário"}</div>
                  <div className={`text-xs ${selectedConversation?._id === conversation._id ? "text-white/80" : "text-gray-500"}`}>
                    {conversation.lastMessage?.timestamp && formatTime(conversation.lastMessage.timestamp)}
                  </div>
                </div>
                <div className={`text-xs truncate ${selectedConversation?._id === conversation._id ? "text-white/80" : "text-gray-500"}`}>
                  {conversation.lastMessage?.text || "Nenhuma mensagem"}
                </div>
                <div className="flex justify-between items-center">
                  <div className={`text-xs ${selectedConversation?._id === conversation._id ? "text-white/60" : "text-gray-400"}`}>
                    {conversation.lastMessage?.timestamp && formatDate(conversation.lastMessage.timestamp)}
                  </div>
                  {!conversation.read && (
                    <div 
                      className="w-2 h-2 rounded-full bg-blue-500"
                      role="status"
                      aria-label="Nova mensagem não lida"
                    ></div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </aside>

        {/* Chat principal */}
        <section 
          className="flex-1 flex flex-col bg-white rounded-xl shadow-lg p-8 min-w-0 h-full min-h-0 box-border"
          role="region"
          aria-label="Área de chat"
        >
          {selectedConversation || location.search.includes('receiverId') ? (
            <>
              {/* Topo do chat */}
              <div className="flex items-center gap-3 border-b border-gray-200 pb-4 mb-4">
                <div 
                  className="w-8 h-8 rounded-full bg-[#1486B8] flex items-center justify-center text-white"
                  role="img"
                  aria-label={`Avatar de ${selectedConversation?.otherUser?.name || "Usuário"}`}
                >
                  {selectedConversation?.otherUser?.name?.[0] || "U"}
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-semibold">{selectedConversation?.otherUser?.name || "Nova conversa"}</span>
                  <span className="text-sm text-gray-500 capitalize">{selectedConversation?.otherUser?.role || "usuário"}</span>
                </div>
              </div>
              
              {/* Mensagens */}
              <div 
                className="flex-1 flex flex-col gap-6 overflow-y-auto pr-2 min-h-0"
                role="log"
                aria-label="Histórico de mensagens"
              >
                {messages.map((msg) =>
                  msg.senderId === user.id ? (
                    <div 
                      className="flex flex-col items-end" 
                      key={msg.id}
                      role="listitem"
                      aria-label={`Sua mensagem: ${msg.text}. Enviada às ${msg.timestamp && formatTime(msg.timestamp)}`}
                    >
                      <div className="bg-[#1486B8] text-white rounded-xl px-5 py-3 max-w-xl shadow-md relative whitespace-pre-line">
                        <span className="block text-base">{msg.text}</span>
                        <span className="block text-xs text-right text-white/80 mt-2">
                          {msg.timestamp && formatTime(msg.timestamp)}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div 
                      className="flex items-start gap-2" 
                      key={msg.id}
                      role="listitem"
                      aria-label={`Mensagem de ${selectedConversation?.otherUser?.name || "Usuário"}: ${msg.text}. Enviada às ${msg.timestamp && formatTime(msg.timestamp)}`}
                    >
                      <div 
                        className="w-8 h-8 rounded-full bg-[#22346C] flex items-center justify-center text-white"
                        role="img"
                        aria-label={`Avatar de ${selectedConversation?.otherUser?.name || "Usuário"}`}
                      >
                        {selectedConversation?.name?.[0] || "U"}
                      </div>
                      <div>
                        <div className="bg-[#22346C] text-white rounded-xl px-5 py-3 max-w-xl shadow-md whitespace-pre-line">
                          <span className="block text-base">{msg.text}</span>
                          <span className="block text-xs text-right text-white/80 mt-2">
                            {msg.timestamp && formatTime(msg.timestamp)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Campo de digitação */}
              <form 
                onSubmit={handleSendMessage} 
                className="flex items-center gap-3 mt-6 bg-[#166b8e] rounded-xl px-4 py-2"
                role="form"
                aria-label="Formulário para enviar mensagem"
              >
                <button 
                  type="button"
                  className="text-white text-xl cursor-pointer"
                  aria-label="Anexar arquivo"
                >
                  <FaPaperclip />
                </button>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Digite a mensagem aqui..."
                  className="flex-1 bg-transparent outline-none text-white placeholder:text-white/70 px-2 py-2 text-lg"
                  aria-label="Campo para digitar mensagem"
                />
                <button 
                  type="submit" 
                  className="text-white text-3xl font-bold px-2 hover:scale-110 transition-transform"
                  aria-label="Enviar mensagem"
                >
                  &#8594;
                </button>
              </form>
            </>
          ) : (
            <div 
              className="flex-1 flex items-center justify-center text-gray-500"
              role="status"
              aria-label="Selecione uma conversa para começar"
            >
              Selecione uma conversa para começar
            </div>
          )}
        </section>
      </div>
    </div>
  );
} 