import { createContext, useContext, useState } from 'react';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const [isMinimized, setIsMinimized] = useState(true);
    const [messages, setMessages] = useState([
        { id: 1, text: 'Olá, Eu sou o Spax! Seu copiloto virtual na busca por espaços incríveis. Como posso te ajudar hoje?', sender: 'bot' },
    ]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const addMessage = (message) => {
        setMessages(prev => [...prev, message]);
    };

    const clearMessages = () => {
        setMessages([{ id: 1, text: 'Olá! Eu sou o Spax — seu copiloto virtual na busca por espaços incríveis. Como posso te ajudar hoje?', sender: 'bot' }]);
    };

    return (
        <ChatContext.Provider value={{
            isMinimized,
            setIsMinimized,
            messages,
            setMessages,
            newMessage,
            setNewMessage,
            isLoading,
            setIsLoading,
            addMessage,
            clearMessages
        }}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error('useChat deve ser usado dentro de um ChatProvider');
    }
    return context;
}; 