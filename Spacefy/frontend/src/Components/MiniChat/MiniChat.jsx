import { FaComments } from 'react-icons/fa';
import { openAIService } from '../../services/openAIService';
import { useNavigate } from 'react-router-dom';
import { useChat } from '../../Contexts/ChatContext';

const MiniChat = () => {
  const navigate = useNavigate();
  const {
    isMinimized,
    setIsMinimized,
    messages,
    setMessages,
    newMessage,
    setNewMessage,
    isLoading,
    setIsLoading
  } = useChat();

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const userMessage = { id: messages.length + 1, text: newMessage, sender: 'user' };
      setMessages(prev => [...prev, userMessage]);
      setNewMessage('');
      setIsLoading(true);

      try {
        const response = await openAIService.processUserPrompt(newMessage);
        const botMessage = { 
          id: messages.length + 2, 
          text: 'Encontrei alguns espaços que podem te interessar! Vou mostrar para você.', 
          sender: 'bot' 
        };
        setMessages(prev => [...prev, botMessage]);

        // Prepara os filtros com base na resposta do OpenAI
        const filtros = {
          tipoEspaco: response.tipo_espaco || '',
          location: response.cidade || '',
          caracteristicas: response.comodidades || [],
          regras: response.regras || [],
          ordenarPor: 'asc'
        };

        // Navega para a página de descobrir com os filtros
        navigate('/Descobrir', { state: { filtros } });
        setIsMinimized(true);
      } catch (error) {
        const errorMessage = { 
          id: messages.length + 2, 
          text: 'Desculpe, ocorreu um erro ao processar sua mensagem.', 
          sender: 'bot' 
        };
        setMessages(prev => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="fixed bottom-8 right-24 z-[9999]" role="complementary" aria-label="Chat de assistente virtual">
      <div
        className={`transform transition-all duration-300 ease-in-out absolute bottom-0 right-0 ${
          isMinimized
            ? 'opacity-0 scale-95 translate-y-4 pointer-events-none'
            : 'opacity-100 scale-100 translate-y-0'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Chat com assistente virtual"
      >
        <div className="bg-white rounded-lg shadow-xl w-80 h-96 flex flex-col border-2 border-[#00A3FF]">
          {/* Header */}
          <div className="bg-[#00A3FF] text-white p-3 rounded-t-lg flex justify-between items-center">
            <h3 className="font-semibold" id="chat-title">Spax - Assistente Virtual</h3>
            <button
              onClick={() => setIsMinimized(true)}
              className="hover:text-gray-200 transition-colors cursor-pointer"
              aria-label="Minimizar chat"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
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
          <div 
            className="flex-1 overflow-y-auto p-4 space-y-4"
            role="log"
            aria-label="Histórico de mensagens"
            aria-live="polite"
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
                role="listitem"
                aria-label={message.sender === 'user' ? 'Sua mensagem' : 'Mensagem do assistente'}
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
            {isLoading && (
              <div 
                className="flex justify-start"
                role="status"
                aria-label="Processando mensagem"
              >
                <div className="bg-gray-100 text-gray-800 rounded-lg p-3">
                  <div className="flex space-x-2" aria-hidden="true">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <form 
            onSubmit={handleSendMessage} 
            className="p-3 border-t"
            role="form"
            aria-label="Formulário de mensagem"
          >
            <div className="flex space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Digite sua mensagem..."
                className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00A3FF]"
                aria-label="Campo de mensagem"
                aria-required="true"
              />
              <button
                type="submit"
                className="bg-[#00A3FF] text-white px-4 py-2 rounded-lg hover:bg-[#0084CC] transition-colors cursor-pointer"
                aria-label="Enviar mensagem"
                disabled={isLoading}
                aria-busy={isLoading}
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
        aria-label="Abrir chat com assistente virtual"
        aria-expanded={!isMinimized}
        aria-controls="chat-dialog"
      >
        <FaComments className="text-xl" aria-hidden="true" />
      </button>
    </div>
  );
};

export default MiniChat;
