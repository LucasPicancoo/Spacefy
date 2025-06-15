import React, { useState, useEffect } from 'react';
import Header from "../../Components/Header/Header";
import { useUser } from "../../Contexts/UserContext";
import { rentalService } from "../../services/rentalService";
import { useNavigate } from 'react-router-dom';

const Reservas = () => {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReservas = async () => {
      try {
        if (!user?.id) {
          throw new Error("Usuário não encontrado");
        }

        const data = await rentalService.getRentalsByUserID(user.id);
        setReservas(data);
        setLoading(false);
      } catch (err) {
        console.error("Erro detalhado ao buscar reservas:", err);
        setError(err.message || "Erro ao carregar reservas. Por favor, tente novamente mais tarde.");
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchReservas();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center" role="status" aria-label="Carregando reservas">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" aria-hidden="true"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8" role="alert" aria-label="Mensagem de erro">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Erro!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

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

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#1BAAE9] to-[#093C6B]" role="main" aria-label="Página de Reservas">
      <Header />
      <div className="p-8">
        <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-8xl mx-auto" role="region" aria-label="Lista de Reservas">
          <div className="flex flex-col">
            <div className="grid grid-cols-12 font-bold text-lg pb-2 border-b border-gray-200" role="rowgroup" aria-label="Cabeçalho da tabela">
              <div className="col-span-1 pl-4" role="columnheader" aria-label="Identificador">ID</div>
              <div className="col-span-3 pl-2" role="columnheader" aria-label="Nome do Espaço">Espaço</div>
              <div className="col-span-3" role="columnheader" aria-label="Período do Aluguel">Data Alugada</div>
              <div className="col-span-2 -ml-1" role="columnheader" aria-label="Valor Total">Valor</div>
              <div className="col-span-3 -ml-3" role="columnheader" aria-label="Data da Reserva">Data</div>
            </div>
            <div className="flex flex-col gap-4 mt-4 max-h-[calc(100vh-240px)] overflow-y-auto" role="list" aria-label="Lista de reservas">
              {reservas.length === 0 ? (
                <div className="text-center py-4 text-gray-500" role="status" aria-label="Nenhuma reserva encontrada">
                  Nenhuma reserva encontrada
                </div>
              ) : (
                reservas.map((reserva) => (
                  <div
                    key={reserva._id}
                    className="grid grid-cols-12 items-center bg-white rounded-lg shadow border border-gray-200 px-4 py-3 hover:shadow-md transition-all"
                    role="listitem"
                    aria-label={`Reserva ${reserva._id.slice(-4)} - ${reserva.space?.space_name || "Espaço não encontrado"}`}
                  >
                    <div className="col-span-1 font-medium" aria-label={`ID da reserva: ${reserva._id.slice(-4)}`}>{reserva._id.slice(-4)}</div>
                    <div className="col-span-3">
                      <button
                        onClick={() => navigate(`/espaco/${reserva.space?._id}`)}
                        className="text-blue-600 hover:text-blue-800 hover:underline transition-colors cursor-pointer"
                        aria-label={`Ver detalhes do espaço ${reserva.space?.space_name || "Espaço não encontrado"}`}
                      >
                        {reserva.space?.space_name || "Espaço não encontrado"}
                      </button>
                    </div>
                    <div className="col-span-3 flex flex-col text-sm text-gray-700" aria-label={`Período do aluguel: de ${new Date(reserva.start_date).toLocaleDateString()} ${reserva.startTime} até ${new Date(reserva.end_date).toLocaleDateString()} ${reserva.endTime}`}>
                      <span>{new Date(reserva.start_date).toLocaleDateString()} - {reserva.startTime}</span>
                      <span>{new Date(reserva.end_date).toLocaleDateString()} - {reserva.endTime}</span>
                    </div>
                    <div className="col-span-2 font-bold" aria-label={`Valor total: R$ ${reserva.value.toFixed(2)}`}>R$ {reserva.value.toFixed(2)}</div>
                    <div className="col-span-3" aria-label={`Data da reserva: ${new Date(reserva.createdAt).toLocaleString()}`}>{new Date(reserva.createdAt).toLocaleString()}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reservas;