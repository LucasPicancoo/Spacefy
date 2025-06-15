import React from "react";
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";

function renderStars(avaliacao, size = 'text-2xl') {
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
            className="flex flex-row"
        >
            {stars}
        </div>
    );
}

const AvaliacaoGeral = ({ averageScore }) => (
    <div 
        className="mt-16"
        role="region"
        aria-label="Seção de avaliação geral do espaço"
    >
        <hr 
            className="border-t border-[#00A3FF] mb-8"
            aria-hidden="true"
        />
        <h2 
            className="text-3xl font-bold text-center mb-2"
            aria-label="Avaliação geral do espaço"
        >
            Avaliação Geral
        </h2>
        <div 
            className="flex flex-col items-center mb-8"
            role="group"
            aria-label="Nota média do espaço"
        >
            <div 
                className="flex items-center gap-2 mb-4"
                role="presentation"
            >
                {renderStars(averageScore)}
                <span 
                    className="text-2xl font-bold ml-2"
                    aria-label={`Nota média: ${averageScore.toFixed(1)}`}
                >
                    {averageScore.toFixed(1)}
                </span>
            </div>
        </div>
        <hr 
            className="border-t border-[#00A3FF] mb-8"
            aria-hidden="true"
        />
    </div>
);

export default AvaliacaoGeral; 