import React, { useEffect } from "react";

const CommentsModal = ({ isOpen, onClose, reviews }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
      aria-label="Modal de avaliações"
    >
      <div 
        className="bg-white rounded-lg p-8 w-full max-w-2xl max-h-[80vh] overflow-y-auto shadow-lg"
        role="document"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold" id="modal-titulo">Avaliações</h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700 text-xl"
            aria-label="Fechar modal de avaliações"
          >
            ✕
          </button>
        </div>
        <div 
          className="space-y-4"
          role="region"
          aria-labelledby="modal-titulo"
        >
          {reviews.length === 0 && (
            <div 
              className="text-center text-gray-500"
              role="status"
              aria-label="Nenhuma avaliação disponível"
            >
              Nenhuma avaliação encontrada.
            </div>
          )}
          <div role="list" aria-label="Lista de avaliações">
            {reviews.map((review, idx) => (
              <div 
                key={idx} 
                className="bg-gray-50 rounded-lg p-4 flex flex-col"
                role="listitem"
              >
                <div className="flex items-center mb-1">
                  <div 
                    className="w-7 h-7 rounded-full bg-[#1DA1F2] flex items-center justify-center text-white font-bold mr-2"
                    role="img"
                    aria-label={`Avatar de ${review.name}`}
                  >
                    {review.name[0]}
                  </div>
                  <span 
                    className="font-semibold text-sm text-gray-800"
                    aria-label={`Avaliação de ${review.name}`}
                  >
                    {review.name}
                  </span>
                </div>
                <p 
                  className="text-xs text-gray-700 leading-relaxed"
                  aria-label={`Conteúdo da avaliação de ${review.name}`}
                >
                  {review.review}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentsModal; 