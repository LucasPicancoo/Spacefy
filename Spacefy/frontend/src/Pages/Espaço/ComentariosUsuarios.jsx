import React from "react";
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";

function renderStars(avaliacao, size = 'text-base') {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        if (avaliacao >= i) {
            stars.push(<FaStar key={i} className={`text-yellow-400 ${size}`} />);
        } else if (avaliacao >= i - 0.5) {
            stars.push(<FaStarHalfAlt key={i} className={`text-yellow-400 ${size}`} />);
        } else {
            stars.push(<FaRegStar key={i} className={`text-yellow-400 ${size}`} />);
        }
    }
    return stars;
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
    <div className="container mx-auto px-4 mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">Comentários dos usuários</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-items-center">
            {assessments.slice(0, 3).map((assessment, index) => (
                <div key={index} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-[#00A3FF] flex items-center justify-center mr-3"></div>
                            <div className="flex flex-col">
                                <span className="font-bold text-base text-[#363636]">{assessment.userID.name}</span>
                                <div className="flex items-center">
                                    {renderStars(assessment.score, 'text-sm')}
                                </div>
                            </div>
                        </div>
                        <span className="text-[#696868] text-sm">{formatarData(assessment.evaluation_date)}</span>
                    </div>
                    <p className="text-[#696868] text-base mb-2">{assessment.comment}</p>
                </div>
            ))}
        </div>
        {assessments.length > 3 && (
            <div className="text-center mt-8">
                <button 
                    onClick={onVerTodas}
                    className="bg-[#00A3FF] text-white px-6 py-2 rounded-full hover:bg-[#0088cc] transition-colors cursor-pointer"
                >
                    Ver todos os comentários
                </button>
            </div>
        )}
    </div>
);

export default ComentariosUsuarios; 