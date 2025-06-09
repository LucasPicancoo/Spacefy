import React, { useState, useEffect, useRef } from "react";
import { FaPaperclip } from "react-icons/fa";
import Header from "../../Components/Header/Header";
import { useUser } from "../../Contexts/UserContext";
import { useLocation } from 'react-router-dom';
import { messageService } from "../../services/messageService";

// Dados mock para as mensagens
const mockMessages = {
  "1": [
    {
      _id: "1",
      content: "Olá, tudo bem?",
      senderId: "2",
      createdAt: new Date().toISOString()
    },
    {
      _id: "2",
      content: "Tudo ótimo! E com você?",
      senderId: "1",
      createdAt: new Date().toISOString()
    }
  ],
  "2": [
    {
      _id: "3",
      content: "Quando podemos começar?",
      senderId: "3",
      createdAt: new Date(Date.now() - 86400000).toISOString()
    }
  ],
  "3": [
    {
      _id: "4",
      content: "O projeto está aprovado!",
      senderId: "4",
      createdAt: new Date(Date.now() - 172800000).toISOString()
    }
  ]
};

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
        const data = await messageService.getConversations(user.id);
        
        // Transformar os dados para o formato esperado pelo componente
        const formattedConversations = data.map(conv => ({
          _id: conv._id,
          name: `${conv.senderId.name} ${conv.senderId.surname}`,
          role: "usuário", // Você pode ajustar isso baseado em alguma lógica específica
          lastMessage: {
            content: conv.lastMessage,
            createdAt: conv.updatedAt
          },
          otherUserId: conv.receiverId._id,
          read: conv.read
        }));

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

  useEffect(() => {
    if (selectedConversation) {
      // Carregar mensagens mock para a conversa selecionada
      setMessages(mockMessages[selectedConversation._id] || []);
      scrollToBottom();
    }
  }, [selectedConversation]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    const newMessageObj = {
      _id: Date.now().toString(),
      content: newMessage,
      senderId: user.id,
      createdAt: new Date().toISOString()
    };

    setMessages(prev => [...prev, newMessageObj]);
    setNewMessage("");
    scrollToBottom();
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
          {selectedConversation ? (
            <>
              {/* Topo do chat */}
              <div className="flex items-center gap-3 border-b border-gray-200 pb-4 mb-4">
                <div className="w-8 h-8 rounded-full bg-[#1486B8] flex items-center justify-center text-white">
                  {selectedConversation.name?.[0] || "U"}
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-semibold">{selectedConversation.name}</span>
                  <span className="text-sm text-gray-500 capitalize">{selectedConversation.role}</span>
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
                        {selectedConversation.name?.[0] || "U"}
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