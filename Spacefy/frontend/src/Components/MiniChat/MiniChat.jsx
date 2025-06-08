import { useState } from 'react';
import { FaComments } from 'react-icons/fa';

const MiniChat = () => {
  const [isMinimized, setIsMinimized] = useState(true);
  const [messages, setMessages] = useState([
    { id: 1, text: 'Olá! Como posso ajudar?', sender: 'bot' },
  ]);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      setMessages([
        ...messages,
        { id: messages.length + 1, text: newMessage, sender: 'user' },
      ]);
      setNewMessage('');
    }
  };

  return (
    <div className="fixed bottom-8 right-24 z-[9999]">
      <div
        className={`transform transition-all duration-300 ease-in-out absolute bottom-0 right-0 ${
          isMinimized
            ? 'opacity-0 scale-95 translate-y-4 pointer-events-none'
            : 'opacity-100 scale-100 translate-y-0'
        }`}
      >
        <div className="bg-white rounded-lg shadow-xl w-80 h-96 flex flex-col border-2 border-[#00A3FF]">
          {/* Header */}
          <div className="bg-[#00A3FF] text-white p-3 rounded-t-lg flex justify-between items-center">
            <h3 className="font-semibold">Assistente Virtual</h3>
            <button
              onClick={() => setIsMinimized(true)}
              className="hover:text-gray-200 transition-colors cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.sender === 'user'
                      ? 'bg-[#00A3FF] text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <form onSubmit={handleSendMessage} className="p-3 border-t">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Digite sua mensagem..."
                className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00A3FF]"
              />
              <button
                type="submit"
                className="bg-[#00A3FF] text-white px-4 py-2 rounded-lg hover:bg-[#0084CC] transition-colors cursor-pointer"
              >
                Enviar
              </button>
            </div>
          </form>
        </div>
      </div>

      <button
        onClick={() => setIsMinimized(false)}
        className={`bg-[#00A3FF] text-white p-4 rounded-full shadow-lg hover:bg-[#0084CC] transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#00A3FF] focus:ring-opacity-50 cursor-pointer ${
          !isMinimized ? 'opacity-0 scale-0' : 'opacity-100 scale-100'
        }`}
        aria-label="Abrir chat"
      >
        <FaComments className="text-xl" />
      </button>
    </div>
  );
};

export default MiniChat;
