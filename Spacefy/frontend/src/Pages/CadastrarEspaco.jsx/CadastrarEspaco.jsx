import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
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
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const iniciarCadastro = () => {
        setEtapaAtual(1);
    };

    const enviarDadosParaBackend = async () => {
        try {
            setLoading(true);
            setError(null);

            // Log detalhado de todas as informações do formulário
            console.log('=== INFORMAÇÕES COMPLETAS DO FORMULÁRIO ===');
            console.log('Informações Básicas:', {
                nome: formData.space_name,
                capacidade: formData.max_people,
                localizacao: formData.location,
                tipo: formData.space_type,
                descricao: formData.space_description
            });
            console.log('Equipamentos e Serviços:', formData.equipamentosEServicos);
            console.log('Disponibilidade:', formData.disponibilidade);
            console.log('Horários:', {
                inicio: formData.horario_inicio,
                fim: formData.horario_fim
            });
            console.log('Regras:', {
                permite_animais: formData.permite_animais,
                permite_fumar: formData.permite_fumar,
                permite_bebidas: formData.permite_bebidas
            });
            console.log('Preço:', formData.price_per_hour);
            console.log('Informações do Proprietário:', {
                nome: formData.nome_proprietario,
                cpf_cnpj: formData.cpf_cnpj,
                telefone: formData.telefone,
                email: formData.email
            });
            console.log('Documentos:', {
                documento_proprietario: formData.documento,
                documento_espaco: formData.documentoEspaco
            });
            console.log('Imagens:', formData.images);
            console.log('=======================================');

            // Obtém o token do localStorage
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Usuário não autenticado');
            }

            // Validação dos campos obrigatórios
            const camposObrigatorios = {
                space_name: 'Nome do espaço',
                max_people: 'Capacidade máxima',
                location: 'Localização',
                space_type: 'Tipo do espaço',
                horario_inicio: 'Horário de início',
                horario_fim: 'Horário de fim',
                owner_name: 'Nome do proprietário',
                document_number: 'CPF/CNPJ',
                owner_phone: 'Telefone',
                owner_email: 'Email'
            };

            const camposFaltantes = Object.entries(camposObrigatorios)
                .filter(([key]) => !formData[key])
                .map(([_, label]) => label);

            if (camposFaltantes.length > 0) {
                throw new Error(`Os seguintes campos são obrigatórios: ${camposFaltantes.join(', ')}`);
            }

            // Validação do preço
            if (!formData.price_per_hour || isNaN(parseFloat(formData.price_per_hour))) {
                throw new Error('O preço por hora deve ser um número válido');
            }

            // Validação dos documentos
            if (!formData.documento || !formData.documentoEspaco) {
                throw new Error('Os documentos do proprietário e do espaço são obrigatórios');
            }

            // Validação das imagens
            if (!formData.images || formData.images.length === 0) {
                throw new Error('Pelo menos uma imagem do espaço é obrigatória');
            }

            // Mapeia os dados do formulário para o formato esperado pelo backend
            const dadosFormatados = {
                space_name: formData.space_name,
                max_people: parseInt(formData.max_people),
                location: formData.location,
                space_type: formData.space_type,
                space_description: formData.space_description || '',
                space_amenities: Object.entries(formData.equipamentosEServicos || {})
                    .filter(([_, value]) => value === true)
                    .map(([key]) => key),
                week_days: Object.entries(formData.disponibilidade || {})
                    .filter(([_, value]) => value === true)
                    .map(([key]) => key),
                opening_time: formData.horario_inicio,
                closing_time: formData.horario_fim,
                space_rules: [
                    ...(formData.permite_animais ? ['animais'] : []),
                    ...(formData.permite_fumar ? ['fumar'] : []),
                    ...(formData.permite_bebidas ? ['bebidas'] : [])
                ],
                price_per_hour: parseFloat(formData.price_per_hour),
                owner_name: formData.owner_name || formData.nome_proprietario,
                document_number: formData.document_number || formData.cpf_cnpj,
                document_photo: formData.documento,
                space_document_photo: formData.documentoEspaco,
                owner_phone: formData.owner_phone || formData.telefone,
                owner_email: formData.owner_email || formData.email,
                image_url: formData.images
            };

            // Log dos dados formatados exatamente como serão enviados para a API
            console.log('=== DADOS FORMATADOS PARA API ===');
            console.log(JSON.stringify(dadosFormatados, null, 2));
            console.log('================================');

            // Configura o cabeçalho com o token
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            };

            // Envia os dados para o backend
            const response = await axios.post('http://localhost:3000/spaces/createSpace', dadosFormatados, config);

            if (response.status === 201) {
                // Redireciona para a página de sucesso
                console.log('Espaço cadastrado com sucesso!');
            }
        } catch (error) {
            console.error('Erro ao cadastrar espaço:', error);
            // Log mais detalhado do erro
            if (error.response) {
                console.error('Detalhes do erro:', {
                    status: error.response.status,
                    data: error.response.data,
                    headers: error.response.headers
                });
            }
            setError(error.response?.data?.error || error.message || 'Erro ao cadastrar espaço. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const proximaEtapa = async () => {
        if (etapaAtual < 7) {
            setEtapaAtual(etapaAtual + 1);
        } else {
            await enviarDadosParaBackend();
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
                                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-5 px-12 rounded-lg text-xl transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
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
                                                className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
                                            >
                                                Voltar
                                            </button>
                                        )}
                                        <button 
                                            onClick={proximaEtapa}
                                            disabled={loading}
                                            className={`bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            {loading ? 'Enviando...' : etapaAtual === 7 ? "Finalizar" : "Próximo"}
                                        </button>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div 
                                            className="bg-[#1EACE3] h-2 rounded-full transition-all duration-300"
                                            style={{ width: `${(etapaAtual / 7) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                                {error && (
                                    <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                                        {error}
                                    </div>
                                )}
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