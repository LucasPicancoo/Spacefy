import React from "react";
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";

function renderStars(avaliacao, size = 'text-2xl') {
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

const AvaliacaoGeral = ({ averageScore }) => (
    <div className="mt-16">
        <hr className="border-t border-[#00A3FF] mb-8" />
        <h2 className="text-3xl font-bold text-center mb-2">Avaliação Geral</h2>
        <div className="flex flex-col items-center mb-8">
            <div className="flex items-center gap-2 mb-4">
                {renderStars(averageScore)}
                <span className="text-2xl font-bold ml-2">{averageScore.toFixed(1)}</span>
            </div>
        </div>
        <hr className="border-t border-[#00A3FF] mb-8" />
    </div>
);

export default AvaliacaoGeral; 