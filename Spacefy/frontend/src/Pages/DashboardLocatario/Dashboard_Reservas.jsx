import React, { useState, useEffect } from "react";
import { useUser } from "../../Contexts/userContext";
import { rentalService } from "../../services/rentalService";

export default function Dashboard_Reservas() {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useUser();

  useEffect(() => {
    const fetchReservas = async () => {
      try {
        if (!user?.id) {
          throw new Error("Usuário não encontrado");
        }

        const data = await rentalService.getRentalsByOwner(user.id);
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
      <div className="p-8 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Erro!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-8xl mx-auto">
        <div className="flex flex-col">
          <div className="grid grid-cols-12 font-bold text-lg pb-2 border-b border-gray-200">
            <div className="col-span-1 pl-4">ID</div>
            <div className="col-span-3 pl-2">Usuário</div>
            <div className="col-span-3">Data Alugada</div>
            <div className="col-span-2 -ml-1">Valor</div>
            <div className="col-span-3 -ml-3">Data</div>
          </div>
          <div className="flex flex-col gap-4 mt-4 max-h-[calc(100vh-240px)] overflow-y-auto">
            {reservas.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                Nenhuma reserva encontrada
              </div>
            ) : (
              reservas.map((reserva) => (
                <div
                  key={reserva._id}
                  className="grid grid-cols-12 items-center bg-white rounded-lg shadow border border-gray-200 px-4 py-3 hover:shadow-md transition-all"
                >
                  <div className="col-span-1 font-medium">{reserva._id.slice(-4)}</div>
                  <div className="col-span-3">{reserva.user?.name || "Usuário não encontrado"}</div>
                  <div className="col-span-3 flex flex-col text-sm text-gray-700">
                    <span>{new Date(reserva.start_date).toLocaleDateString()} - {reserva.startTime}</span>
                    <span>{new Date(reserva.end_date).toLocaleDateString()} - {reserva.endTime}</span>
                  </div>
                  <div className="col-span-2 font-bold">R$ {reserva.value.toFixed(2)}</div>
                  <div className="col-span-3">{new Date(reserva.createdAt).toLocaleString()}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
