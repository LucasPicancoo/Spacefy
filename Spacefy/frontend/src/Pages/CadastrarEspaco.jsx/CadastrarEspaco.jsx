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
    const [etapaAtual, setEtapaAtual] = useState(0);

    const iniciarCadastro = () => {
        setEtapaAtual(1);
    };

    const proximaEtapa = () => {
        if (etapaAtual < 7) {
            setEtapaAtual(etapaAtual + 1);
        } else {
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
                    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] w-full">
                        <div className="text-center w-full max-w-3xl px-4">
                            <h1 className="text-5xl font-bold text-gray-900 mb-8">
                                Cadastre seu espaço e alcance mais locatários!
                            </h1>
                            <div className="space-y-6 mb-12">
                                <p className="text-xl text-gray-700">
                                    Tem uma sala de reunião, auditório ou espaço para eventos disponível?
                                </p>
                                <p className="text-xl text-gray-700">
                                    Cadastre-se na nossa plataforma e conecte-se com pessoas que precisam de um local como o seu!
                                </p>
                                <p className="text-xl text-gray-700">
                                    Preencha os detalhes abaixo e comece a alugar seu espaço de forma prática e segura!
                                </p>
                            </div>
                            <button
                                onClick={iniciarCadastro}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-5 px-12 rounded-lg text-xl transition duration-300 ease-in-out transform hover:scale-105"
                            >
                                Iniciar Cadastro
                            </button>
                        </div>
                    </div>
                );
        }
    };

    return (
        <>
            <Header />
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <div className="w-full h-full bg-white p-8">
                    {renderizarEtapa()}
                </div>

                {etapaAtual > 0 && (
                    <div className="fixed bottom-8 flex gap-4">
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
                            {etapaAtual === 7 ? "Finalizar" : "Próximo"}
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};

export default CadastrarEspaco;
