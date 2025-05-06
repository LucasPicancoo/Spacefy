import React, { useState } from "react";
import CommentsModal from "../../Components/CommentsModal";

const reviewsMock = [
  { name: "João Silva", review: "Ótimo locatário, recomendo!" },
  { name: "Maria Souza", review: "Muito educado e responsável." },
  { name: "Carlos Lima", review: "Tudo certo na negociação." },
];

export default function Dashboard_Perfil() {
  const [showCommentsModal, setShowCommentsModal] = useState(false);

  return (
    <div className="p-8 flex flex-col gap-10 h-full w-full">
      <div className="flex flex-col md:flex-row gap-12 w-full">
        {/* Card lateral */}
        <div className="w-full md:w-96 flex-shrink-0 flex flex-col gap-6">
          <div className="bg-white rounded-xl shadow p-8 flex flex-col items-center">
            <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center mb-4">
              <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </div>
            <div className="text-center">
              <div className="font-bold text-2xl">Zaylian Vortelli</div>
              <div className="text-gray-500 text-base">Locatário</div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-3 text-base items-stretch">
            <div className="font-bold text-gray-700 mb-1 text-lg">Sobre o anunciante</div>
            <div className="flex items-center gap-2 text-gray-700">
              <span className="font-bold">01</span> imóvel cadastrado
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              Desde 17 de março de 2022
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.049 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" /></svg>
              4.2/5 (183 avaliações)
            </div>
            <button className="mt-3 bg-[#1486B8] hover:bg-[#0f6a94] text-white font-semibold py-3 px-6 rounded-lg text-lg transition duration-300 ease-in-out" onClick={() => setShowCommentsModal(true)}>Ver avaliações</button>
          </div>
        </div>
        {/* Conteúdo principal */}
        <div className="flex-1 bg-white rounded-xl shadow p-12 flex flex-col gap-12 min-w-[340px]">
          <div>
            <div className="font-bold text-2xl mb-4">Descrição de Zaylian:</div>
            <div className="text-gray-700 text-lg">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce congue, magna sed feugiat lobortis, est tellus laoreet purus, sed auctor quam dolor at ipsum. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Maecenas risus tellus, vehicula rutrum pellentesque vitae, pretium at libero.
            </div>
            <hr className="my-8 border-blue-200" />
          </div>
          <div>
            <div className="font-bold text-2xl mb-5">Locais de Zaylian</div>
            <div className="flex flex-wrap gap-10">
              <div className="flex flex-col items-center bg-gray-50 rounded-2xl shadow-md p-6 w-72">
                <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80" alt="Palácio de Cristal" className="w-56 h-56 object-cover rounded-xl mb-4" />
                <div className="font-bold text-xl leading-tight">Palácio de Cristal</div>
                <div className="text-gray-500 text-base truncate w-56">Rua Leonidio Valentim Ferr...</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showCommentsModal && (
        <CommentsModal isOpen={showCommentsModal} onClose={() => setShowCommentsModal(false)} reviews={reviewsMock} />
      )}
    </div>
  );
} 