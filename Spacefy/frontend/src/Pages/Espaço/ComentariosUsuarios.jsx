import React from "react";
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
        <div 
            role="img" 
            aria-label={`Avaliação de ${avaliacao} estrelas`}
            className="flex"
        >
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

const ComentariosUsuarios = ({ assessments, onVerTodas }) => (
    <div 
        className="container mx-auto px-4 mb-16"
        role="region"
        aria-label="Seção de comentários dos usuários"
    >
        <h2 
            className="text-3xl font-bold text-center mb-12"
            aria-label="Comentários dos usuários"
        >
            Comentários dos usuários
        </h2>
        <div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-items-center"
            role="list"
            aria-label="Lista de comentários dos usuários"
        >
            {assessments.slice(0, 3).map((assessment, index) => (
                <div 
                    key={index} 
                    className="bg-white p-8 rounded-lg shadow-md w-full max-w-md flex flex-col"
                    role="listitem"
                    aria-label={`Comentário de ${assessment.userID.name}`}
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                            <div 
                                className="w-8 h-8 rounded-full bg-[#00A3FF] flex items-center justify-center mr-3"
                                role="img"
                                aria-label={`Avatar de ${assessment.userID.name}`}
                            ></div>
                            <div className="flex flex-col">
                                <span 
                                    className="font-bold text-base text-[#363636]"
                                    aria-label={`Nome do usuário: ${assessment.userID.name}`}
                                >
                                    {assessment.userID.name}
                                </span>
                                <div className="flex items-center">
                                    {renderStars(assessment.score, 'text-sm')}
                                </div>
                            </div>
                        </div>
                        <span 
                            className="text-[#696868] text-sm"
                            aria-label={`Data do comentário: ${formatarData(assessment.evaluation_date)}`}
                        >
                            {formatarData(assessment.evaluation_date)}
                        </span>
                    </div>
                    <p 
                        className="text-[#696868] text-base mb-2"
                        aria-label={`Comentário: ${assessment.comment}`}
                    >
                        {assessment.comment}
                    </p>
                </div>
            ))}
        </div>
        {assessments.length > 3 && (
            <div className="text-center mt-8">
                <button 
                    onClick={onVerTodas}
                    className="bg-[#00A3FF] text-white px-6 py-2 rounded-full hover:bg-[#0088cc] transition-colors cursor-pointer"
                    aria-label="Ver todos os comentários"
                >
                    Ver todos os comentários
                </button>
            </div>
        )}
    </div>
);

export default ComentariosUsuarios; 