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
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 w-full max-w-2xl max-h-[80vh] overflow-y-auto shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Avaliações</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl">✕</button>
        </div>
        <div className="space-y-4">
          {reviews.length === 0 && (
            <div className="text-center text-gray-500">Nenhuma avaliação encontrada.</div>
          )}
          {reviews.map((review, idx) => (
            <div key={idx} className="bg-gray-50 rounded-lg p-4 flex flex-col">
              <div className="flex items-center mb-1">
                <div className="w-7 h-7 rounded-full bg-[#1DA1F2] flex items-center justify-center text-white font-bold mr-2">
                  {review.name[0]}
                </div>
                <span className="font-semibold text-sm text-gray-800">{review.name}</span>
              </div>
              <p className="text-xs text-gray-700 leading-relaxed">{review.review}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommentsModal; 