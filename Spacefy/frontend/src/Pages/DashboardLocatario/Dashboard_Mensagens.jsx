import React, { useState } from "react";
import { FaPaperclip } from "react-icons/fa";

const conversasMock = [
  {
    id: 1,
    nome: "Luciano de Oliveira Ferreira",
    subtitulo: "Palacio de cristal",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    mensagens: [
      {
        autor: "eu",
        texto: `Boa tarde, doutor. Estou com uma dúvida sobre um contrato que assinei recentemente.\nHá algumas cláusulas que me parecem abusivas, e eu queria entender se posso contestá-las\nou rescindir o contrato sem prejuízo. Poderia me ajudar?`,
        hora: "15:32"
      },
      {
        autor: "outro",
        texto: `Boa tarde! Claro, fico à disposição para esclarecer suas dúvidas.\nPara que eu possa analisar melhor a situação, você poderia me informar qual é a natureza do contrato? É um contrato de prestação de serviços, aluguel, compra e venda, ou de outra categoria? Além disso, poderia mencionar quais cláusulas lhe parecem abusivas?`,
        hora: "15:33"
      }
    ]
  },
  {
    id: 2,
    nome: "Maria Fernanda Souza",
    subtitulo: "Sala de reunião 2",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    mensagens: [
      {
        autor: "eu",
        texto: `Olá, Maria! Gostaria de confirmar a reserva da sala para amanhã às 14h.`,
        hora: "09:10"
      },
      {
        autor: "outro",
        texto: `Olá! Sim, está confirmada. Qualquer dúvida, estou à disposição.`,
        hora: "09:12"
      }
    ]
  }
];

export default function Dashboard_Mensagens() {
  const [conversaSelecionada, setConversaSelecionada] = useState(conversasMock[0]);

  return (
    <div 
      className="flex w-full h-full min-h-0 bg-gradient-to-br from-[#1BAAE9] to-[#093C6B] p-8 gap-8 box-border"
      role="main"
      aria-label="Página de mensagens"
    >
      {/* Conversas */}
      <aside 
        className="w-72 bg-white rounded-xl shadow-lg flex flex-col min-h-0 h-full overflow-y-auto p-8 box-border"
        role="complementary"
        aria-label="Lista de conversas"
      >
        <h2 
          className="text-2xl font-bold mb-6"
          aria-label="Título da seção de conversas"
        >
          Conversas
        </h2>
        <div 
          className="flex flex-col gap-2"
          role="list"
          aria-label="Lista de conversas disponíveis"
        >
          {conversasMock.map((conversa) => (
            <button
              key={conversa.id}
              onClick={() => setConversaSelecionada(conversa)}
              className={`cursor-pointer rounded-lg px-4 py-3 text-left font-semibold focus:outline-none transition-colors ${
                conversaSelecionada.id === conversa.id
                  ? "bg-[#1486B8] text-white"
                  : "bg-white text-gray-800 border border-gray-200 hover:bg-gray-100"
              }`}
              role="listitem"
              aria-label={`Conversa com ${conversa.nome} sobre ${conversa.subtitulo}`}
              aria-selected={conversaSelecionada.id === conversa.id}
            >
              <div className="truncate">{conversa.nome.length > 22 ? conversa.nome.slice(0, 22) + "..." : conversa.nome}</div>
              <div className={`text-xs truncate ${conversaSelecionada.id === conversa.id ? "text-white/80" : "text-gray-500"}`}>{conversa.subtitulo}</div>
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
        {/* Topo do chat */}
        <div 
          className="flex items-center gap-3 border-b border-gray-200 pb-4 mb-4"
          role="banner"
          aria-label="Cabeçalho do chat"
        >
          <img 
            src={conversaSelecionada.avatar} 
            alt={`Avatar de ${conversaSelecionada.nome}`} 
            className="w-8 h-8 rounded-full" 
          />
          <span 
            className="text-xl font-semibold"
            aria-label={`Conversando com ${conversaSelecionada.nome}`}
          >
            {conversaSelecionada.nome}
          </span>
        </div>
        {/* Mensagens */}
        <div 
          className="flex-1 flex flex-col gap-6 overflow-y-auto pr-2 min-h-0"
          role="log"
          aria-label="Histórico de mensagens"
        >
          {conversaSelecionada.mensagens.map((msg, idx) =>
            msg.autor === "eu" ? (
              <div 
                className="flex flex-col items-end" 
                key={idx}
                role="listitem"
                aria-label={`Mensagem enviada às ${msg.hora}`}
              >
                <div 
                  className="bg-[#1486B8] text-white rounded-xl px-5 py-3 max-w-xl shadow-md relative whitespace-pre-line"
                  role="article"
                >
                  <span className="block text-base">{msg.texto}</span>
                  <span 
                    className="block text-xs text-right text-white/80 mt-2"
                    aria-label={`Enviada às ${msg.hora}`}
                  >
                    {msg.hora}
                  </span>
                </div>
              </div>
            ) : (
              <div 
                className="flex items-start gap-2" 
                key={idx}
                role="listitem"
                aria-label={`Mensagem recebida às ${msg.hora}`}
              >
                <img 
                  src={conversaSelecionada.avatar} 
                  alt={`Avatar de ${conversaSelecionada.nome}`} 
                  className="w-8 h-8 rounded-full mt-1" 
                />
                <div>
                  <div 
                    className="bg-[#22346C] text-white rounded-xl px-5 py-3 max-w-xl shadow-md whitespace-pre-line"
                    role="article"
                  >
                    <span className="block text-base">{msg.texto}</span>
                    <span 
                      className="block text-xs text-right text-white/80 mt-2"
                      aria-label={`Recebida às ${msg.hora}`}
                    >
                      {msg.hora}
                    </span>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
        {/* Campo de digitação */}
        <form 
          className="flex items-center gap-3 mt-6 bg-[#166b8e] rounded-xl px-4 py-2"
          role="form"
          aria-label="Formulário de envio de mensagem"
        >
          <FaPaperclip 
            className="text-white text-xl cursor-pointer" 
            aria-label="Anexar arquivo"
            role="button"
          />
          <input
            type="text"
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
      </section>
    </div>
  );
} 