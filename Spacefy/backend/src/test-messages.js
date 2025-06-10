const { io } = require("socket.io-client");

// IDs dos usuários para teste
const USERS = {
  LUCAS: {
    id: "68058252e94a66959046c7eb",
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MDU4MjUyZTk0YTY2OTU5MDQ2YzdlYiIsIm5hbWUiOiJMdWNhcyIsInN1cm5hbWUiOiJQaWNhbmNvIiwiZW1haWwiOiJsdWNhc0BnbWFpbC5jb20iLCJ0ZWxlcGhvbmUiOiIzMjAwMzIwMDAwMCIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc0OTUwODQ2MywiZXhwIjoxNzQ5NTEyMDAzfQ.4X3XTjdWn3q9b7ogOCmbmLkTBJov_XVTMnF1F2u8Kd4"
  },
  HIAN: {
    id: "68157fb8e5f157d9eefc865b",
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MTU3ZmI4ZTVmMTU3ZDllZWZjODY1YiIsIm5hbWUiOiJIaWFuIiwic3VybmFtZSI6IkxvYyIsImVtYWlsIjoiSGlhbjIyQGdtYWlsLmNvbSIsInRlbGVwaG9uZSI6IjMyOTk5OTk5OTk5Iiwicm9sZSI6ImxvY2F0YXJpbyIsImlhdCI6MTc0OTUwODQ0NiwiZXhwIjoxNzQ5NTExOTg2fQ.jXumNuy_9HZE2X6zVPxyiFXf8BpjOkbLtNMoN_fosRM" // Substitua pelo token do Hian
  }
};

// Interface para interação via console
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

// Pergunta qual usuário está usando
readline.question('Qual usuário está usando? (1 - Lucas, 2 - Hian): ', (answer) => {
  const user = answer === '1' ? USERS.LUCAS : USERS.HIAN;
  
  // Configuração do cliente
  const socket = io("http://localhost:3000", {
    auth: {
      token: user.token
    }
  });

  // Eventos de conexão
  socket.on("connect", () => {
    console.log("Conectado ao servidor!");
    // Entrar automaticamente na sala do usuário atual
    joinRoom(user.id);
  });

  socket.on("connect_error", (error) => {
    console.error("Erro na conexão:", error.message);
  });

  socket.on("error", (error) => {
    console.error("Erro no socket:", error.message);
  });

  // Entrar em uma sala (para receber mensagens)
  function joinRoom(userId) {
    socket.emit("join", userId);
    console.log(`Entrou na sala do usuário: ${userId}`);
  }

  // Enviar uma mensagem
  function sendMessage(senderId, receiverId, message) {
    const messageData = {
      senderId,
      receiverId,
      message
    };
    
    console.log("Tentando enviar mensagem:", messageData);
    socket.emit("send_message", messageData);
    console.log("Mensagem enviada:", messageData);
  }

  // Ouvir novas mensagens
  socket.on("receive_message", (message) => {
    console.log("Nova mensagem recebida:", message);
  });

  // Debug de eventos do socket
  socket.onAny((eventName, ...args) => {
    console.log(`Evento recebido: ${eventName}`, args);
  });

  function askQuestion() {
    readline.question('\nO que você quer fazer?\n1. Enviar mensagem\n2. Entrar em uma sala\n3. Sair\nEscolha uma opção: ', (answer) => {
      switch(answer) {
        case '1':
          readline.question('Digite o ID do destinatário: ', (receiverId) => {
            readline.question('Digite a mensagem: ', (message) => {
              sendMessage(user.id, receiverId, message);
              askQuestion();
            });
          });
          break;
        case '2':
          readline.question('Digite o ID do usuário para entrar na sala: ', (userId) => {
            joinRoom(userId);
            askQuestion();
          });
          break;
        case '3':
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
}); 