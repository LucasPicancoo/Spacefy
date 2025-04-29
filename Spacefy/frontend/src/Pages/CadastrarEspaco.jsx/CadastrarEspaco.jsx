import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../Components/Header/Header';
import Etapa1 from './Etapas/Etapa1';
import Etapa2 from './Etapas/Etapa2';
import Etapa3 from './Etapas/Etapa3';
import Etapa4 from './Etapas/Etapa4';
import Etapa5 from './Etapas/Etapa5';
import Etapa6 from './Etapas/Etapa6';
import Etapa7 from './Etapas/Etapa7';

const CadastrarEspaco = () => {
    const navigate = useNavigate();
    const [etapaAtual, setEtapaAtual] = useState(0); // 0 = título, 1-7 = etapas

    const proximaEtapa = () => {
        if (etapaAtual < 7) {
            setEtapaAtual(etapaAtual + 1);
        } else {
            // Quando finalizar, redireciona para a página de informações do espaço
            navigate('/Espaço');
        }
    };

    const etapaAnterior = () => {
        if (etapaAtual > 1) {
            setEtapaAtual(etapaAtual - 1);
        }
    };

    const fecharModal = () => {
        setEtapaAtual(0);
    };

    const renderizarEtapa = () => {
        switch (etapaAtual) {
            case 1:
                return <Etapa1 isOpen={true} onClose={fecharModal} />;
            case 2:
                return <Etapa2 isOpen={true} onClose={fecharModal} />;
            case 3:
                return <Etapa3 isOpen={true} onClose={fecharModal} />;
            case 4:
                return <Etapa4 isOpen={true} onClose={fecharModal} />;
            case 5:
                return <Etapa5 isOpen={true} onClose={fecharModal} />;
            case 6:
                return <Etapa6 isOpen={true} onClose={fecharModal} />;
            case 7:
                return <Etapa7 isOpen={true} onClose={fecharModal} />;
            default:
                return (
                    <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">
                        Página de Cadastro de Espaço
                    </h1>
                );
        }
    };

    const getBotaoTexto = () => {
        if (etapaAtual === 0) return "Ver Mensagem";
        if (etapaAtual === 7) return "Finalizar";
        return "Próximo";
    };

    return (
        <>
            <Header />
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
                <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 mb-8">
                    {renderizarEtapa()}
                </div>

                <div className="flex gap-4">
                    {etapaAtual > 1 && (
                        <button 
                            onClick={etapaAnterior}
                            className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
                        >
                            Voltar
                        </button>
                    )}
                    <button 
                        onClick={proximaEtapa}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
                    >
                        {getBotaoTexto()}
                    </button>
                </div>
            </div>
        </>
    );
};

export default CadastrarEspaco;
