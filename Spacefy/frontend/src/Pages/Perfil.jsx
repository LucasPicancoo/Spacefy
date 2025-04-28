import React from "react";
import Header from "../Components/Header/Header";
import { useUser } from "../Contexts/UserContext"; // Importe o hook useUser

const Perfil = () => {
  const { user, isLoggedIn } = useUser(); // Use o contexto para pegar os dados do usuário

  if (!isLoggedIn) {
    return <div>Você precisa estar logado para ver o perfil.</div>;
  }

  return (
    <div>
      <Header />

      <section className="bg-white rounded-xl shadow-md p-6 w-72 flex flex-col items-center">
        <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-4xl mb-2">
          <span role="img" aria-label="avatar">
            👤
          </span>
        </div>
        <div className="text-center mb-2">
          <div className="font-semibold">{user?.name}</div>
          <div className="text-xs text-gray-500"></div>
        </div>
        <button className="bg-[#00A3FF] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#0084CC] transition-colors">
          Editar Perfil
        </button>
        <div className="mt-4 text-left w-full bg-gray-50 rounded-lg p-3 text-xs">
          <div className="font-bold mb-1">Sobre o usuário</div>
          <div>
            <b>Nome:</b> {user?.name}
          </div>
          <div>
            <b>E-mail:</b> {user?.email || "Não informado"}
          </div>
          <div>
            <b>Telefone:</b> {user?.phone || "Não informado"}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Perfil;
