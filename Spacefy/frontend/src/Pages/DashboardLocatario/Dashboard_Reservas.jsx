import React from "react";
import SidebarDashboardLocatario from "../../Components/SidebarDashboardLocatario";
import Header from "../../Components/Header/Header";

export default function Dashboard_Reservas() {
  // Dados mockados para exibição
  const reservas = [
    {
      id: "01",
      usuario: "Lucas Picanco",
      dataAlugada: ["02/05/2025 - 15:30", "02/05/2025 - 20:30"],
      valor: "R$ 130,00",
      data: "01/05/2025 - 20:39",
    },
    {
      id: "02",
      usuario: "Lucas Picanco",
      dataAlugada: ["02/05/2025 - 15:30", "02/05/2025 - 20:30"],
      valor: "R$ 130,00",
      data: "01/05/2025 - 20:39",
    },
    {
      id: "03",
      usuario: "Lucas Picanco",
      dataAlugada: ["02/05/2025 - 15:30", "02/05/2025 - 20:30"],
      valor: "R$ 130,00",
      data: "01/05/2025 - 20:39",
    },
    {
      id: "04",
      usuario: "Lucas Picanco",
      dataAlugada: ["02/05/2025 - 15:30", "02/05/2025 - 20:30"],
      valor: "R$ 130,00",
      data: "01/05/2025 - 20:39",
    },
    {
      id: "05",
      usuario: "Lucas Picanco",
      dataAlugada: ["03/05/2025 - 10:00", "03/05/2025 - 18:00"],
      valor: "R$ 150,00",
      data: "02/05/2025 - 15:20",
    },
    {
      id: "06",
      usuario: "Lucas Picanco",
      dataAlugada: ["04/05/2025 - 14:00", "04/05/2025 - 22:00"],
      valor: "R$ 180,00",
      data: "03/05/2025 - 09:45",
    },
    {
      id: "07",
      usuario: "Lucas Picanco",
      dataAlugada: ["05/05/2025 - 09:00", "05/05/2025 - 17:00"],
      valor: "R$ 160,00",
      data: "04/05/2025 - 11:30",
    },
    {
      id: "08",
      usuario: "Lucas Picanco",
      dataAlugada: ["06/05/2025 - 13:00", "06/05/2025 - 21:00"],
      valor: "R$ 170,00",
      data: "05/05/2025 - 14:15",
    },
    {
      id: "09",
      usuario: "Lucas Picanco",
      dataAlugada: ["07/05/2025 - 11:00", "07/05/2025 - 19:00"],
      valor: "R$ 140,00",
      data: "06/05/2025 - 16:40",
    },
    {
      id: "10",
      usuario: "Lucas Picanco",
      dataAlugada: ["08/05/2025 - 16:00", "08/05/2025 - 00:00"],
      valor: "R$ 200,00",
      data: "07/05/2025 - 10:20",
    },
    {
      id: "11",
      usuario: "Lucas Picanco",
      dataAlugada: ["09/05/2025 - 08:00", "09/05/2025 - 16:00"],
      valor: "R$ 160,00",
      data: "08/05/2025 - 13:50",
    },
    {
      id: "12",
      usuario: "Lucas Picanco",
      dataAlugada: ["10/05/2025 - 12:00", "10/05/2025 - 20:00"],
      valor: "R$ 170,00",
      data: "09/05/2025 - 15:30",
    },
    {
      id: "13",
      usuario: "Lucas Picanco",
      dataAlugada: ["11/05/2025 - 15:00", "11/05/2025 - 23:00"],
      valor: "R$ 190,00",
      data: "10/05/2025 - 09:15",
    },
    {
      id: "14",
      usuario: "Lucas Picanco",
      dataAlugada: ["12/05/2025 - 10:00", "12/05/2025 - 18:00"],
      valor: "R$ 150,00",
      data: "11/05/2025 - 14:40",
    },
    {
      id: "15",
      usuario: "Lucas Picanco",
      dataAlugada: ["13/05/2025 - 14:00", "13/05/2025 - 22:00"],
      valor: "R$ 180,00",
      data: "12/05/2025 - 11:25",
    },
    {
      id: "16",
      usuario: "Lucas Picanco",
      dataAlugada: ["14/05/2025 - 09:00", "14/05/2025 - 17:00"],
      valor: "R$ 160,00",
      data: "13/05/2025 - 16:50",
    },
    {
      id: "17",
      usuario: "Lucas Picanco",
      dataAlugada: ["15/05/2025 - 13:00", "15/05/2025 - 21:00"],
      valor: "R$ 170,00",
      data: "14/05/2025 - 10:35",
    },
    {
      id: "18",
      usuario: "Lucas Picanco",
      dataAlugada: ["16/05/2025 - 11:00", "16/05/2025 - 19:00"],
      valor: "R$ 140,00",
      data: "15/05/2025 - 13:45",
    },
    {
      id: "19",
      usuario: "Lucas Picanco",
      dataAlugada: ["17/05/2025 - 16:00", "17/05/2025 - 00:00"],
      valor: "R$ 200,00",
      data: "16/05/2025 - 15:20",
    },
    {
      id: "20",
      usuario: "Lucas Picanco",
      dataAlugada: ["18/05/2025 - 08:00", "18/05/2025 - 16:00"],
      valor: "R$ 160,00",
      data: "17/05/2025 - 12:10",
    },
    {
      id: "21",
      usuario: "Lucas Picanco",
      dataAlugada: ["19/05/2025 - 12:00", "19/05/2025 - 20:00"],
      valor: "R$ 170,00",
      data: "18/05/2025 - 14:30",
    },
    {
      id: "22",
      usuario: "Lucas Picanco",
      dataAlugada: ["20/05/2025 - 15:00", "20/05/2025 - 23:00"],
      valor: "R$ 190,00",
      data: "19/05/2025 - 11:45",
    },
    {
      id: "23",
      usuario: "Rafael Portugal",
      dataAlugada: ["21/05/2025 - 10:00", "21/05/2025 - 18:00"],
      valor: "R$ 150,00",
      data: "20/05/2025 - 16:25",
    },
    {
      id: "24",
      usuario: "Lucas Picanco",
      dataAlugada: ["22/05/2025 - 14:00", "22/05/2025 - 22:00"],
      valor: "R$ 180,00",
      data: "21/05/2025 - 13:15",
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#1BAAE9] to-[#093C6B]">
      <Header />
      <div className="flex flex-1">
        <SidebarDashboardLocatario />
        <main className="flex-1 p-8">
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
                {reservas.map((reserva) => (
                  <div
                    key={reserva.id}
                    className="grid grid-cols-12 items-center bg-white rounded-lg shadow border border-gray-200 px-4 py-3 hover:shadow-md transition-all"
                  >
                    <div className="col-span-1 font-medium">{reserva.id}</div>
                    <div className="col-span-3">{reserva.usuario}</div>
                    <div className="col-span-3 flex flex-col text-sm text-gray-700">
                      {reserva.dataAlugada.map((d, i) => (
                        <span key={i}>{d}</span>
                      ))}
                    </div>
                    <div className="col-span-2 font-bold">{reserva.valor}</div>
                    <div className="col-span-3">{reserva.data}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
