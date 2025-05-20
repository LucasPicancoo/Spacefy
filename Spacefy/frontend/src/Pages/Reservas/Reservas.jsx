import React, { useState, useEffect } from 'react';
import Header from "../../Components/Header/Header";

const Reservas = () => {
  const [reservas, setReservas] = useState([]);
  const [expandedCards, setExpandedCards] = useState({});

  useEffect(() => {
    // Exemplo de dados adaptados ao novo layout
    const reservasExemplo = [
      {
        id: '01',
        usuario: 'Zaylian Vortelli',
        dataAlugada: ['02/05/2025 - 15:30', '02/05/2025 - 20:30'],
        valor: 130.0,
        data: '01/05/2025 - 20:39',
        status: 'confirmada',
        endereco: 'Rua das Flores, 123 - Jardim Primavera',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '01234-567',
        telefone: '(11) 98765-4321',
        email: 'zaylian@email.com'
      },
      {
        id: '02',
        usuario: 'Zaylian Vortelli',
        dataAlugada: ['02/05/2025 - 15:30', '02/05/2025 - 20:30'],
        valor: 130.0,
        data: '01/05/2025 - 20:39',
        status: 'pendente',
        endereco: 'Rua das Flores, 123 - Jardim Primavera',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '01234-567',
        telefone: '(11) 98765-4321',
        email: 'zaylian@email.com'
      },
      {
        id: '03',
        usuario: 'Zaylian Vortelli',
        dataAlugada: ['02/05/2025 - 15:30', '02/05/2025 - 20:30'],
        valor: 130.0,
        data: '01/05/2025 - 20:39',
        status: 'pendente',
        endereco: 'Rua das Flores, 123 - Jardim Primavera',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '01234-567',
        telefone: '(11) 98765-4321',
        email: 'zaylian@email.com'
      },
    ];
    setReservas(reservasExemplo);
  }, []);

  const handleCancelarReserva = (id) => {
    setReservas(reservas.map(reserva =>
      reserva.id === id
        ? { ...reserva, status: 'cancelada' }
        : reserva
    ));
  };

  const handleEnviarMensagem = (reserva) => {
    console.log('Enviar mensagem para reserva:', reserva);
  };

  const toggleExpand = (id) => {
    setExpandedCards(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="w-full min-h-screen bg-[radial-gradient(circle,_#6ACDFF,_#C2EBFF)]">
      <Header />
      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="bg-white rounded-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-black">Minhas Reservas</h1>
        </div>
        <div className="mt-8">
          {/* Cabeçalho */}
          <div className="bg-white rounded-lg p-4 mb-4">
            <div className="grid grid-cols-12 gap-4 items-center">
              <div className="col-span-1">
                <h2 className="text-lg font-bold text-left text-black">ID</h2>
              </div>
              <div className="col-span-2">
                <h2 className="text-lg font-bold text-left text-black">Usuário</h2>
              </div>
              <div className="col-span-2">
                <h2 className="text-lg font-bold text-left text-black">Data Alugada</h2>
              </div>
              <div className="col-span-1">
                <h2 className="text-lg font-bold text-left text-black">Valor</h2>
              </div>
              <div className="col-span-2">
                <h2 className="text-lg font-bold text-left text-black">Data da Reserva</h2>
              </div>
              <div className="col-span-2">
                <h2 className="text-lg font-bold text-left text-black">Status</h2>
              </div>
              <div className="col-span-2">
                <h2 className="text-lg font-bold text-right text-black">Ações</h2>
              </div>
            </div>
          </div>
          {/* Linhas de reservas */}
          <div className="space-y-4">
            {reservas.map((reserva) => (
              <div key={reserva.id} className="w-full">
                <div className="bg-white rounded-lg shadow-md p-4">
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-1">
                      <p className="text-lg font-bold">{reserva.id}</p>
                    </div>
                    <div className="col-span-2">
                      <p>{reserva.usuario}</p>
                    </div>
                    <div className="col-span-2">
                      <p>
                        {reserva.dataAlugada[0]}<br />
                        {reserva.dataAlugada[1]}
                      </p>
                    </div>
                    <div className="col-span-1">
                      <p className="font-bold">
                        R$ {reserva.valor.toFixed(2).replace('.', ',')}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <p>{reserva.data}</p>
                    </div>
                    <div className="col-span-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        reserva.status === 'confirmada' 
                          ? 'bg-green-200 text-green-900'
                          : reserva.status === 'pendente'
                          ? 'bg-yellow-200 text-yellow-900'
                          : 'bg-red-200 text-red-900'
                      }`}>
                        {reserva.status === 'confirmada' 
                          ? 'Confirmada'
                          : reserva.status === 'pendente'
                          ? 'Pendente'
                          : 'Cancelada'}
                      </span>
                    </div>
                    <div className="col-span-2">
                      <div className="flex justify-end space-x-2">
                        <button
                          className="px-3 py-1 border border-blue-500 text-blue-500 rounded hover:bg-blue-50 transition-colors cursor-pointer"
                          onClick={() => handleEnviarMensagem(reserva)}
                        >
                          Mensagem
                        </button>
                        {reserva.status !== 'cancelada' && (
                          <button
                            className="px-3 py-1 border border-red-500 text-red-500 rounded hover:bg-red-50 transition-colors cursor-pointer"
                            onClick={() => handleCancelarReserva(reserva.id)}
                          >
                            Cancelar
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Botão de expansão centralizado */}
                  <div className="flex justify-center mt-2 border-t border-gray-100 pt-2">
                    <button
                      onClick={() => toggleExpand(reserva.id)}
                      className={`p-1.5 rounded-full hover:bg-gray-50 transition-all duration-300 cursor-pointer ${
                        expandedCards[reserva.id] ? 'rotate-180 bg-gray-50' : ''
                      }`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                  
                  {/* Conteúdo expandido */}
                  {expandedCards[reserva.id] && (
                    <div className="mt-2 pt-2">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-sm font-semibold text-gray-600 mb-2">Informações de Contato</h3>
                          <div className="space-y-2">
                            <p><span className="font-medium">Endereço:</span> {reserva.endereco}</p>
                            <p><span className="font-medium">Cidade/Estado:</span> {reserva.cidade} - {reserva.estado}</p>
                            <p><span className="font-medium">CEP:</span> {reserva.cep}</p>
                          </div>
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-gray-600 mb-2">Contato</h3>
                          <div className="space-y-2">
                            <p><span className="font-medium">Telefone:</span> {reserva.telefone}</p>
                            <p><span className="font-medium">Email:</span> {reserva.email}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reservas;