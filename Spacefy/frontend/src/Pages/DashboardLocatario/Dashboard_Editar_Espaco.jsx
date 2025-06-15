import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { spaceService } from "../../services/spaceService";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Etapa1 from '../CadastrarEspaco.jsx/Etapas/Etapa1';
import Etapa2 from '../CadastrarEspaco.jsx/Etapas/Etapa2';
import Etapa3 from '../CadastrarEspaco.jsx/Etapas/Etapa3';
import Etapa4 from '../CadastrarEspaco.jsx/Etapas/Etapa4';
import Etapa5 from '../CadastrarEspaco.jsx/Etapas/Etapa5';
import Etapa6 from '../CadastrarEspaco.jsx/Etapas/Etapa6';
import Etapa7 from '../CadastrarEspaco.jsx/Etapas/Etapa7';
import Etapa8 from '../CadastrarEspaco.jsx/Etapas/Etapa8';
import { useUser } from '../../Contexts/UserContext';
import Cookies from "js-cookie";

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
    weekly_days: 'Dias da semana e horários',
    owner_name: 'Nome do proprietário',
    document_number: 'CPF/CNPJ',
    owner_phone: 'Telefone',
    owner_email: 'Email',
    space_amenities: 'Comodidades',
    document_photo: 'Documento do proprietário',
    space_document_photo: 'Documento do espaço',
    image_url: 'Imagem do espaço'
};

// Número total de etapas do formulário
const TOTAL_ETAPAS = 8;

// Componente da barra de progresso que mostra o avanço na edição
const BarraProgresso = ({ etapaAtual }) => (
    <div className="mt-4" role="progressbar" aria-valuenow={etapaAtual} aria-valuemin={1} aria-valuemax={TOTAL_ETAPAS} aria-label={`Progresso: etapa ${etapaAtual} de ${TOTAL_ETAPAS}`}>
        <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
                className="bg-[#1EACE3] h-2 rounded-full transition-all duration-300"
                style={{ width: `${(etapaAtual / TOTAL_ETAPAS) * 100}%` }}
                aria-hidden="true"
            />
        </div>
    </div>
);

const Dashboard_Editar_Espaco = ({ espaco, onVoltar }) => {
    const navigate = useNavigate();
    const { user } = useUser();
    const [etapaAtual, setEtapaAtual] = useState(1);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Carrega os dados do espaço quando o componente é montado
    useEffect(() => {
        if (espaco) {
            // Garante que os dados de localização sejam corretamente mapeados
            const dadosFormatados = {
                ...espaco,
                street: espaco.location?.street || '',
                number: espaco.location?.number || '',
                complement: espaco.location?.complement || '',
                neighborhood: espaco.location?.neighborhood || '',
                city: espaco.location?.city || '',
                state: espaco.location?.state || '',
                zipCode: espaco.location?.zipCode || '',
                coordinates: espaco.location?.coordinates || null
            };
            setFormData(dadosFormatados);
        }
    }, [espaco]);

    // Validação dos campos obrigatórios do formulário
    const validarCamposObrigatorios = () => {
        // Se não houver alterações, não precisa validar
        if (Object.keys(formData).length === 0) {
            return true;
        }

        // Verifica apenas os campos que foram alterados
        const camposFaltantes = Object.entries(CAMPOS_OBRIGATORIOS)
            .filter(([key]) => {
                // Se o campo foi alterado, ele deve ser preenchido
                if (formData[key] !== undefined && formData[key] !== espaco[key]) {
                    if (key === 'weekly_days') {
                        return !formData[key] || formData[key].length === 0;
                    }
                    return !formData[key];
                }
                return false;
            })
            .map(([_, label]) => label);

        if (camposFaltantes.length > 0) {
            toast.error(`Os seguintes campos são obrigatórios: ${camposFaltantes.join(', ')}`);
            return false;
        }
        return true;
    };

    // Validação do preço por hora
    const validarPreco = () => {
        // Se o preço não foi alterado, não precisa validar
        if (formData.price_per_hour === undefined) {
            return true;
        }

        if (!formData.price_per_hour || isNaN(parseFloat(formData.price_per_hour))) {
            toast.error('O preço por hora deve ser um número válido');
            return false;
        }
        return true;
    };

    // Validação dos documentos obrigatórios
    const validarDocumentos = () => {
        // Se os documentos não foram alterados, não precisa validar
        if (formData.document_photo === undefined && formData.space_document_photo === undefined) {
            return true;
        }

        if (!formData.document_photo || !formData.space_document_photo) {
            toast.error('Os documentos do proprietário e do espaço são obrigatórios');
            return false;
        }
        return true;
    };

    // Validação das imagens do espaço
    const validarImagens = () => {
        // Se a imagem não foi alterada, não precisa validar
        if (formData.image_url === undefined) {
            return true;
        }

        if (!formData.image_url) {
            toast.error('A imagem do espaço é obrigatória');
            return false;
        }
        return true;
    };

    // Validação dos campos de localização
    const validarLocalizacao = () => {
        const camposLocalizacao = ['street', 'number', 'neighborhood', 'city', 'state', 'zipCode'];
        const camposAlterados = camposLocalizacao.filter(campo => 
            formData[campo] !== undefined && formData[campo] !== espaco.location?.[campo]
        );

        // Se nenhum campo de localização foi alterado, não precisa validar
        if (camposAlterados.length === 0) {
            return true;
        }

        // Verifica se todos os campos alterados estão preenchidos
        const camposFaltantes = camposAlterados
            .filter(campo => !formData[campo])
            .map(campo => CAMPOS_OBRIGATORIOS[campo]);

        if (camposFaltantes.length > 0) {
            toast.error(`Os seguintes campos são obrigatórios: ${camposFaltantes.join(', ')}`);
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
            zipCode: formData.zipCode,
            coordinates: formData.coordinates
        };

        return {
            space_name: formData.space_name,
            max_people: parseInt(formData.max_people),
            location: locationData,
            space_type: formData.space_type,
            space_description: formData.space_description || '',
            space_amenities: formData.space_amenities || [],
            weekly_days: formData.weekly_days || [],
            week_days: formData.weekly_days?.map(day => day.day) || [], // Mantido para compatibilidade
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

            const token = Cookies.get("token");
            if (!token) {
                toast.error('Usuário não autenticado. Por favor, faça login novamente.');
                return;
            }

            if (!validarLocalizacao() || !validarPreco() || !validarDocumentos() || !validarImagens()) {
                return;
            }

            const dadosFormatados = formatarDadosParaEnvio();
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            };

            const response = await spaceService.updateSpace(espaco._id, dadosFormatados);

            if (response && response._id) {
                toast.success('Espaço atualizado com sucesso!');
                onVoltar();
            } else {
                toast.error('Erro ao atualizar espaço. Tente novamente.');
            }
        } catch (error) {
            console.error('Erro ao atualizar espaço:', error);
            
            if (error.response) {
                const mensagensErro = {
                    400: error.response.data.error || 'Erro ao atualizar espaço. Verifique os dados e tente novamente.',
                    401: 'Sessão expirada. Por favor, faça login novamente.',
                    403: 'Você não tem permissão para atualizar este espaço.'
                };

                toast.error(mensagensErro[error.response.status] || 'Erro ao atualizar espaço. Tente novamente mais tarde.');
            } else {
                toast.error('Erro de conexão com o servidor. Verifique sua conexão com a internet e tente novamente.');
            }
        } finally {
            setLoading(false);
        }
    };

    // Função para avançar para a próxima etapa ou finalizar a edição
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

    // Função para renderizar a etapa atual
    const renderizarEtapa = () => {
        const props = {
            formData,
            onUpdate: atualizarFormData,
            proximaEtapa,
            etapaAnterior,
            loading
        };

        switch (etapaAtual) {
            case 1:
                return <Etapa1 {...props} />;
            case 2:
                return <Etapa2 {...props} />;
            case 3:
                return <Etapa3 {...props} />;
            case 4:
                return <Etapa4 {...props} />;
            case 5:
                return <Etapa5 {...props} />;
            case 6:
                return <Etapa6 {...props} />;
            case 7:
                return <Etapa7 {...props} />;
            case 8:
                return <Etapa8 {...props} />;
            default:
                return null;
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-white" role="main" aria-label="Edição de espaço">
            <div className="flex-1 p-8">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2" aria-label="Editar Espaço">
                                    Editar Espaço
                                </h1>
                                <p className="text-gray-600" role="status" aria-label={`Etapa ${etapaAtual} de ${TOTAL_ETAPAS}`}>
                                    Etapa {etapaAtual} de {TOTAL_ETAPAS}
                                </p>
                            </div>
                            <div className="flex gap-4" role="toolbar" aria-label="Ações de navegação">
                                <button
                                    onClick={onVoltar}
                                    className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg transition duration-300 ease-in-out"
                                    disabled={loading}
                                    aria-label="Cancelar edição"
                                >
                                    Cancelar
                                </button>
                                {etapaAtual > 1 && (
                                    <button
                                        onClick={etapaAnterior}
                                        className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg transition duration-300 ease-in-out"
                                        disabled={loading}
                                        aria-label="Voltar para etapa anterior"
                                    >
                                        Voltar
                                    </button>
                                )}
                                <button
                                    onClick={proximaEtapa}
                                    className="bg-[#1EACE3] hover:bg-[#1a9bc9] text-white font-semibold py-2 px-6 rounded-lg transition duration-300 ease-in-out"
                                    disabled={loading}
                                    aria-label={etapaAtual === TOTAL_ETAPAS ? 'Salvar alterações' : 'Ir para próxima etapa'}
                                >
                                    {etapaAtual === TOTAL_ETAPAS ? 'Salvar' : 'Próximo'}
                                </button>
                            </div>
                        </div>
                        <BarraProgresso etapaAtual={etapaAtual} />
                    </div>

                    <div role="region" aria-label={`Etapa ${etapaAtual} do formulário de edição`}>
                        {renderizarEtapa()}
                    </div>
                </div>
            </div>
            <ToastContainer role="status" aria-live="polite" />
        </div>
    );
};

export default Dashboard_Editar_Espaco; 