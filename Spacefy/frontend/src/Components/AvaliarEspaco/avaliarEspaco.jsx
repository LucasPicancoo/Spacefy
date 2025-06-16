import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import { assessmentService } from '../../services/assessmentService';
import { useUser } from '../../Contexts/UserContext';
import { useParams, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AvaliarEspaco = () => {
    const { id: spaceID } = useParams();
    const { user } = useUser();
    const navigate = useNavigate();
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [hover, setHover] = useState(0);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            toast.error('Você precisa estar logado para fazer uma avaliação');
            navigate('/Login');
            return;
        }

        if (rating === 0) {
            toast.error('Por favor, selecione uma avaliação');
            return;
        }

        try {
            const assessmentData = {
                spaceID,
                userID: user.id,
                score: rating,
                comment
            };
            await assessmentService.createAssessment(assessmentData);
            setRating(0);
            setComment('');
            toast.success('Avaliação enviada com sucesso!');
        } catch (error) {
            console.error('Erro ao enviar avaliação:', error);
            toast.error(error.response?.data?.error || 'Erro ao enviar avaliação. Tente novamente.');
        }
    };

    return (
        <div className="bg-white rounded-xl shadow p-5 max-w-md mx-auto mb-10">
            <ToastContainer position="top-right" autoClose={3000} />
            <h2 className="text-2xl font-bold mb-4 text-[#363636] text-center">Avaliar Espaço</h2>
            <form onSubmit={handleSubmit} className="flex flex-col items-center">
                <div className="mb-4 w-full">
                    <label className="block text-[#363636] text-sm font-bold mb-2 text-center">
                        Sua Avaliação
                    </label>
                    <div className="flex gap-1 justify-center">
                        {[...Array(5)].map((_, index) => {
                            const ratingValue = index + 1;
                            return (
                                <FaStar
                                    key={index}
                                    className="cursor-pointer text-2xl transition-colors"
                                    color={ratingValue <= (hover || rating) ? "#1486B8" : "#e4e5e9"}
                                    onClick={() => setRating(ratingValue)}
                                    onMouseEnter={() => setHover(ratingValue)}
                                    onMouseLeave={() => setHover(0)}
                                />
                            );
                        })}
                    </div>
                </div>
                <div className="mb-4 w-full">
                    <label className="block text-[#363636] text-sm font-bold mb-2 text-center">
                        Comentário
                    </label>
                    <textarea
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1486B8] focus:border-transparent transition-colors"
                        rows="4"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Escreva sua avaliação aqui..."
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-[#1486B8] hover:bg-[#0f6a94] text-white font-bold py-2.5 px-4 rounded-lg transition-colors duration-300"
                >
                    Enviar Avaliação
                </button>
            </form>
        </div>
    );
};

export default AvaliarEspaco;
