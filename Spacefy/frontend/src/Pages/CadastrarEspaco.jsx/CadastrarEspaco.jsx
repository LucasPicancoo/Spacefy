import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { spaceService } from "../../services/spaceService";
import Header from '../../Components/Header/Header';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Etapa1 from './Etapas/Etapa1';
import Etapa2 from './Etapas/Etapa2';
import Etapa3 from './Etapas/Etapa3';
import Etapa4 from './Etapas/Etapa4';
import Etapa5 from './Etapas/Etapa5';
import Etapa6 from './Etapas/Etapa6';
import Etapa7 from './Etapas/Etapa7';
import Etapa8 from './Etapas/Etapa8';
import { useUser } from '../../Contexts/userContext';

// Mapeamento dos campos obrigatórios e suas mensagens de erro
const CAMPOS_OBRIGATORIOS = {
    space_name: 'Nome do espaço',
    max_people: 'Capacidade máxima',
    street: 'Rua',
    number: 'Número',
    neighborhood: 'Bairro',
    city: 'Cidade',
    state: 'Estado',
    zipCode: 'CEP',
    space_type: 'Tipo do espaço',
    opening_time: 'Horário de início',
    closing_time: 'Horário de fim',
    owner_name: 'Nome do proprietário',
    document_number: 'CPF/CNPJ',
    owner_phone: 'Telefone',
    owner_email: 'Email',
    space_amenities: 'Comodidades',
    week_days: 'Dias da semana',
    document_photo: 'Documento do proprietário',
    space_document_photo: 'Documento do espaço',
    image_url: 'Imagem do espaço'
};

// Número total de etapas do formulário
const TOTAL_ETAPAS = 8;

// Componente da tela inicial com botão para iniciar o cadastro
const TelaInicial = ({ onIniciar }) => (
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
                onClick={onIniciar}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-5 px-12 rounded-lg text-xl transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
            >
                Iniciar Cadastro
            </button>
        </div>
    </div>
);

// Componente da barra de progresso que mostra o avanço no cadastro
const BarraProgresso = ({ etapaAtual }) => (
    <div className="mt-4">
        <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
                className="bg-[#1EACE3] h-2 rounded-full transition-all duration-300"
                style={{ width: `${(etapaAtual / TOTAL_ETAPAS) * 100}%` }}
            />
        </div>
    </div>
);

const CadastrarEspaco = () => {
    const navigate = useNavigate();
    const { user, isLoggedIn } = useUser();
    const [etapaAtual, setEtapaAtual] = useState(0);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Verificação de autenticação e papel do usuário
    React.useEffect(() => {
        if (!isLoggedIn) {
            toast.error('Você precisa estar logado para cadastrar um espaço.');
            navigate('/login');
            return;
        }

        if (user.role !== 'locatario') {
            toast.error('Apenas locadores podem cadastrar espaços.');
            navigate('/');
            return;
        }
    }, [isLoggedIn, user, navigate]);

    // Função para iniciar o cadastro, mudando para a primeira etapa
    const iniciarCadastro = () => setEtapaAtual(1);

    // Validação dos campos obrigatórios do formulário
    const validarCamposObrigatorios = () => {
        const camposFaltantes = Object.entries(CAMPOS_OBRIGATORIOS)
            .filter(([key]) => !formData[key])
            .map(([_, label]) => label);

        if (camposFaltantes.length > 0) {
            toast.error(`Os seguintes campos são obrigatórios: ${camposFaltantes.join(', ')}`);
            return false;
        }
        return true;
    };

    // Validação do preço por hora
    const validarPreco = () => {
        if (!formData.price_per_hour || isNaN(parseFloat(formData.price_per_hour))) {
            toast.error('O preço por hora deve ser um número válido');
            return false;
        }
        return true;
    };

    // Validação dos documentos obrigatórios
    const validarDocumentos = () => {
        if (!formData.document_photo || !formData.space_document_photo) {
            toast.error('Os documentos do proprietário e do espaço são obrigatórios');
            return false;
        }
        return true;
    };

    // Validação das imagens do espaço
    const validarImagens = () => {
        if (!formData.image_url) {
            toast.error('A imagem do espaço é obrigatória');
            return false;
        }
        return true;
    };

    // Formatação dos dados para envio ao backend
    const formatarDadosParaEnvio = () => {
        // Combina os campos de endereço em um único objeto
        const locationData = {
            street: formData.street,
            number: formData.number,
            complement: formData.complement,
            neighborhood: formData.neighborhood,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode
        };

        return {
            owner_id: user.id,
            space_name: formData.space_name,
            max_people: parseInt(formData.max_people),
            location: locationData,
            space_type: formData.space_type,
            space_description: formData.space_description || '',
            space_amenities: formData.space_amenities || [],
            week_days: formData.week_days || [],
            opening_time: formData.opening_time,
            closing_time: formData.closing_time,
            space_rules: formData.space_rules || [],
            price_per_hour: parseFloat(formData.price_per_hour),
            owner_name: formData.owner_name,
            document_number: formData.document_number,
            document_photo: formData.document_photo,
            space_document_photo: formData.space_document_photo,
            owner_phone: formData.owner_phone,
            owner_email: formData.owner_email,
            image_url: formData.image_url
        };
    };

    // Função para enviar os dados ao backend
    const enviarDadosParaBackend = async () => {
        try {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('Usuário não autenticado. Por favor, faça login novamente.');
                return;
            }

            if (!formData.termos_aceitos) {
                toast.error('Você precisa aceitar os termos e condições para continuar.');
                return;
            }

            if (!validarCamposObrigatorios() || !validarPreco() || !validarDocumentos() || !validarImagens()) {
                return;
            }

            const dadosFormatados = formatarDadosParaEnvio();
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            };

            const response = await spaceService.createSpace(dadosFormatados);

            if (response.status === 201) {
                toast.success('Espaço cadastrado com sucesso!');
                navigate('/espacos');
            }
        } catch (error) {
            console.error('Erro ao cadastrar espaço:', error);
            
            if (error.response) {
                const mensagensErro = {
                    400: error.response.data.error || 'Erro ao cadastrar espaço. Verifique os dados e tente novamente.',
                    401: 'Sessão expirada. Por favor, faça login novamente.',
                    403: 'Você não tem permissão para cadastrar espaços.'
                };

                toast.error(mensagensErro[error.response.status] || 'Erro ao cadastrar espaço. Tente novamente mais tarde.');
            } else {
                toast.error('Erro de conexão com o servidor. Verifique sua conexão com a internet e tente novamente.');
            }
        } finally {
            setLoading(false);
        }
    };

    // Função para avançar para a próxima etapa ou finalizar o cadastro
    const proximaEtapa = async () => {
        if (etapaAtual < TOTAL_ETAPAS) {
            setEtapaAtual(etapaAtual + 1);
        } else {
            await enviarDadosParaBackend();
        }
    };

    // Função para voltar para a etapa anterior
    const etapaAnterior = () => {
        if (etapaAtual > 1) {
            setEtapaAtual(etapaAtual - 1);
        }
    };

    // Função para atualizar os dados do formulário
    const atualizarFormData = (dados) => {
        setFormData(prev => ({ ...prev, ...dados }));
    };

    // Função para renderizar a etapa atual do formulário
    const renderizarEtapa = () => {
        const etapas = {
            1: <Etapa1 formData={formData} onUpdate={atualizarFormData} />,
            2: <Etapa2 formData={formData} onUpdate={atualizarFormData} />,
            3: <Etapa3 formData={formData} onUpdate={atualizarFormData} />,
            4: <Etapa4 formData={formData} onUpdate={atualizarFormData} />,
            5: <Etapa5 formData={formData} onUpdate={atualizarFormData} />,
            6: <Etapa6 formData={formData} onUpdate={atualizarFormData} />,
            7: <Etapa7 formData={formData} onUpdate={atualizarFormData} />,
            8: <Etapa8 formData={formData} onUpdate={atualizarFormData} />
        };

        return etapas[etapaAtual] || <TelaInicial onIniciar={iniciarCadastro} />;
    };

    // Renderização do componente
    return (
        <>
            <Header />
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
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
                                        Cadastro de Espaço - Etapa {etapaAtual} de {TOTAL_ETAPAS}
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
                                            {loading ? 'Enviando...' : etapaAtual === TOTAL_ETAPAS ? "Finalizar" : "Próximo"}
                                        </button>
                                    </div>
                                </div>
                                <BarraProgresso etapaAtual={etapaAtual} />
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