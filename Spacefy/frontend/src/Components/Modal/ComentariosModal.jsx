import React, { useEffect } from "react";
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";

function renderStars(avaliacao, size = 'text-base') {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        if (avaliacao >= i) {
            stars.push(
                <FaStar 
                    key={i} 
                    className={`text-yellow-400 ${size}`} 
                    aria-hidden="true"
                />
            );
        } else if (avaliacao >= i - 0.5) {
            stars.push(
                <FaStarHalfAlt 
                    key={i} 
                    className={`text-yellow-400 ${size}`} 
                    aria-hidden="true"
                />
            );
        } else {
            stars.push(
                <FaRegStar 
                    key={i} 
                    className={`text-yellow-400 ${size}`} 
                    aria-hidden="true"
                />
            );
        }
    }
    return (
        <div role="img" aria-label={`${avaliacao} de 5 estrelas`} className="flex flex-row">
            {stars}
        </div>
    );
}

function formatarData(dataString) {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

const ComentariosModal = ({ isOpen, onClose, comments }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 backdrop-blur-sm bg-black/10 flex justify-center items-center z-50"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
        >
            <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[80vh] flex flex-col" role="document">
                <div className="p-8 pb-4 relative">
                    <button 
                        onClick={onClose} 
                        className="absolute top-4 right-4 text-gray-500 hover:text-[#00A3FF] text-2xl font-bold cursor-pointer"
                        aria-label="Fechar modal de comentários"
                    >
                        &times;
                    </button>
                    <h2 id="modal-title" className="text-2xl font-bold text-center">Comentários dos usuários</h2>
                </div>
                <div 
                    className="p-8 pt-4 overflow-y-auto"
                    role="region"
                    aria-label="Lista de comentários"
                >
                    <div className="flex flex-col gap-6" role="list">
                        {(comments && comments.length > 0) ? (
                            comments.map((comment, idx) => (
                                <div 
                                    key={idx} 
                                    className="bg-gray-50 p-4 rounded shadow flex flex-col"
                                    role="listitem"
                                    aria-labelledby={`comment-title-${idx}`}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center">
                                            <div 
                                                className="w-6 h-6 rounded-full bg-[#00A3FF] flex items-center justify-center mr-2"
                                                role="img"
                                                aria-label="Avatar do usuário"
                                            ></div>
                                            <div className="flex flex-col">
                                                <span 
                                                    id={`comment-title-${idx}`}
                                                    className="font-bold text-sm text-[#363636]"
                                                >
                                                    {comment.userID.name}
                                                </span>
                                                <div className="flex items-center">
                                                    {renderStars(comment.score, 'text-sm')}
                                                </div>
                                            </div>
                                        </div>
                                        <span 
                                            className="text-[#696868] text-xs"
                                            aria-label={`Data do comentário: ${formatarData(comment.evaluation_date)}`}
                                        >
                                            {formatarData(comment.evaluation_date)}
                                        </span>
                                    </div>
                                    <p 
                                        className="text-[#696868] text-sm"
                                        aria-label={`Comentário de ${comment.userID.name}`}
                                    >
                                        {comment.comment}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p 
                                className="text-center text-[#696868]"
                                role="status"
                                aria-label="Nenhum comentário disponível"
                            >
                                Nenhum comentário encontrado.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ComentariosModal; 