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
    const [formData, setFormData] = useState({});

    const iniciarCadastro = () => {
        setEtapaAtual(1);
    };

    const proximaEtapa = () => {
        if (etapaAtual < 7) {
            setEtapaAtual(etapaAtual + 1);
        } else {
            // Aqui você pode adicionar a lógica para enviar os dados para o backend
            navigate('/Espaço');
        }
    };

    const etapaAnterior = () => {
        if (etapaAtual > 1) {
            setEtapaAtual(etapaAtual - 1);
        }
    };

    const atualizarFormData = (dados) => {
        setFormData(prev => ({ ...prev, ...dados }));
    };

    const renderizarEtapa = () => {
        switch (etapaAtual) {
            case 1:
                return <Etapa1 formData={formData} onUpdate={atualizarFormData} />;
            case 2:
                return <Etapa2 formData={formData} onUpdate={atualizarFormData} />;
            case 3:
                return <Etapa3 formData={formData} onUpdate={atualizarFormData} />;
            case 4:
                return <Etapa4 formData={formData} onUpdate={atualizarFormData} />;
            case 5:
                return <Etapa5 formData={formData} onUpdate={atualizarFormData} />;
            case 6:
                return <Etapa6 formData={formData} onUpdate={atualizarFormData} />;
            case 7:
                return <Etapa7 formData={formData} onUpdate={atualizarFormData} />;
            default:
                return (
                    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] w-full bg-white">
                        <div className="max-w-4xl text-center">
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
            {etapaAtual === 0 ? (
                <div className="w-full min-h-[calc(100vh-80px)] bg-white flex items-center justify-center">
                    {renderizarEtapa()}
                </div>
            ) : (
                <div className="min-h-screen bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        {etapaAtual > 0 && (
                            <div className="mb-8">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl font-bold text-gray-900">
                                        Cadastro de Espaço - Etapa {etapaAtual} de 7
                                    </h2>
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
                                            {etapaAtual === 7 ? "Finalizar" : "Próximo"}
                                        </button>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div 
                                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                            style={{ width: `${(etapaAtual / 7) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div className="bg-white rounded-lg shadow-lg p-8">
                            {renderizarEtapa()}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default CadastrarEspaco; 