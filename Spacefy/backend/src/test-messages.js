const { io } = require("socket.io-client");

// Configuração do cliente
const socket = io("http://localhost:3000", {
  auth: {
    // Cole aqui o token que você pegou da API
    token: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MDU4MjUyZTk0YTY2OTU5MDQ2YzdlYiIsIm5hbWUiOiJMdWNhcyIsInN1cm5hbWUiOiJQaWNhbmNvIiwiZW1haWwiOiJsdWNhc0BnbWFpbC5jb20iLCJ0ZWxlcGhvbmUiOiIzMjAwMzIwMDAwMCIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc0OTMxOTE2MSwiZXhwIjoxNzQ5MzIyNzAxfQ.sHIZuktltbrQFR27qL2x5aXFhaIGDubA0hP_1BzG9Xc"
  }
});

// Eventos de conexão
socket.on("connect", () => {
  console.log("Conectado ao servidor!");
  
  // Exemplo de uso - descomente as linhas que quiser testar
  // joinConversation("conversa123");
  // sendMessage("conversa123", "ID_DO_DESTINATARIO", "Olá, esta é uma mensagem de teste!");
});

socket.on("connect_error", (error) => {
  console.error("Erro na conexão:", error.message);
});

// Entrar em uma conversa
function joinConversation(conversationId) {
  socket.emit("join_conversation", conversationId);
  console.log(`Entrou na conversa: ${conversationId}`);
}

// Enviar uma mensagem
function sendMessage(conversationId, receiverId, content) {
  const messageData = {
    conversationId,
    receiverId,
    content
  };
  
  socket.emit("send_message", messageData);
  console.log("Mensagem enviada:", messageData);
}

// Marcar mensagem como lida
function markAsRead(messageId) {
  socket.emit("mark_as_read", messageId);
  console.log(`Mensagem marcada como lida: ${messageId}`);
}

// Ouvir novas mensagens
socket.on("new_message", (message) => {
  console.log("Nova mensagem recebida:", message);
});

// Ouvir confirmação de mensagem lida
socket.on("message_read", (messageId) => {
  console.log(`Mensagem ${messageId} foi marcada como lida`);
});

// Interface para interação via console
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion() {
  readline.question('\nO que você quer fazer?\n1. Enviar mensagem (cria nova conversa se não existir)\n2. Entrar em uma conversa existente\n3. Marcar mensagem como lida\n4. Sair\nEscolha uma opção: ', (answer) => {
    switch(answer) {
      case '1':
        readline.question('Digite o ID do destinatário: ', (receiverId) => {
          readline.question('Digite a mensagem: ', (content) => {
            // Para uma nova conversa, podemos usar uma combinação dos IDs
            const conversationId = `conv-${receiverId}`;
            sendMessage(conversationId, receiverId, content);
            askQuestion();
          });
        });
        break;
      case '2':
        readline.question('Digite o ID da conversa: ', (conversationId) => {
          joinConversation(conversationId);
          askQuestion();
        });
        break;
      case '3':
        readline.question('Digite o ID da mensagem: ', (messageId) => {
          markAsRead(messageId);
          askQuestion();
        });
        break;
      case '4':
        console.log('Saindo...');
        socket.disconnect();
        readline.close();
        process.exit();
        break;
      default:
        console.log('Opção inválida');
        askQuestion();
    }
  });
}

// Iniciar a interface
askQuestion();

// Para manter o script rodando
process.on("SIGINT", () => {
  socket.disconnect();
  readline.close();
  process.exit();
}); 