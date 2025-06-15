import React, { useState, useEffect } from 'react';
import Header from '../../Components/Header/Header';
import { userService } from '../../services/userService';
import { uploadImages } from '../../services/imageService';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

function EditarPerfilUsuario() {
  const [formData, setFormData] = useState({
    primeiroNome: '',
    sobrenome: '',
    email: '',
    telefone: '',
    senha: '',
    confirmeSenha: '',
    fotoPerfil: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userId, setUserId] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      const decoded = jwtDecode(token);
      setUserId(decoded.id);
      setFormData({
        primeiroNome: decoded.name || '',
        sobrenome: decoded.surname || '',
        email: decoded.email || '',
        telefone: decoded.telephone || '',
        fotoPerfil: decoded.profilePhoto || '',
        senha: '',
        confirmeSenha: ''
      });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    setError('');
    setSuccess('');
  };

  const validateForm = () => {
    if (!formData.primeiroNome || !formData.sobrenome || !formData.email || !formData.telefone) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return false;
    }

    if (formData.senha && formData.senha !== formData.confirmeSenha) {
      setError('As senhas não coincidem.');
      return false;
    }

    if (formData.senha && formData.senha.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return false;
    }

    return true;
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const [imageUrl] = await uploadImages([file]);
      setFormData(prev => ({
        ...prev,
        fotoPerfil: imageUrl
      }));
      setSuccess('Foto de perfil atualizada com sucesso!');
    } catch (error) {
      setError('Erro ao fazer upload da imagem. Tente novamente.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const userData = {
        name: formData.primeiroNome,
        surname: formData.sobrenome,
        email: formData.email,
        telephone: formData.telefone,
        password: formData.senha || undefined,
        profilePhoto: formData.fotoPerfil
      };

      const response = await userService.updateUser(userId, userData);
      
      if (response.token) {
        Cookies.set('token', response.token);
      }

      setSuccess('Perfil atualizado com sucesso!');
      setFormData(prev => ({
        ...prev,
        senha: '',
        confirmeSenha: ''
      }));
    } catch (error) {
      setError(error.response?.data?.error || 'Erro ao atualizar perfil. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50" role="main" aria-label="Página de Edição de Perfil">
      <Header />
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center" aria-label="Título da página">Editar Perfil</h1>
        <div className="flex flex-col md:flex-row justify-between max-w-[1200px] mx-auto gap-8 lg:gap-16">
          {/* Informações do usuario */}
          <div className="w-full md:w-[400px] lg:w-[450px]" role="region" aria-label="Informações do usuário">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="relative flex justify-center mb-8">
                <div className="w-48 h-48 bg-gray-200 rounded-full relative overflow-hidden" role="img" aria-label="Área da foto de perfil">
                  {uploadingImage ? (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100" role="status" aria-label="Carregando imagem">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00A3FF]" aria-hidden="true"></div>
                    </div>
                  ) : formData.fotoPerfil ? (
                    <img 
                      src={formData.fotoPerfil} 
                      alt="Foto de perfil do usuário" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-4xl" role="img" aria-label={`Iniciais do usuário: ${formData.primeiroNome.charAt(0)}${formData.sobrenome.charAt(0)}`}>
                      {formData.primeiroNome.charAt(0)}{formData.sobrenome.charAt(0)}
                    </div>
                  )}
                  <label 
                    htmlFor="fotoPerfil" 
                    className={`absolute bottom-3 right-3 bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md hover:bg-gray-50 transition-colors ${uploadingImage ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    aria-label="Alterar foto de perfil"
                  >
                    <span className="text-xl" aria-hidden="true">📷</span>
                    <input
                      type="file"
                      id="fotoPerfil"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={uploadingImage}
                      aria-label="Selecionar nova foto de perfil"
                    />
                  </label>
                </div>
              </div>
              <div className="space-y-4 text-gray-700" role="list" aria-label="Informações pessoais">
                <div className="p-3 bg-gray-50 rounded-lg" role="listitem">
                  <p className="text-sm text-gray-500">Primeiro Nome</p>
                  <p className="font-medium" aria-label={`Primeiro nome: ${formData.primeiroNome}`}>{formData.primeiroNome}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg" role="listitem">
                  <p className="text-sm text-gray-500">Sobrenome</p>
                  <p className="font-medium" aria-label={`Sobrenome: ${formData.sobrenome}`}>{formData.sobrenome}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg" role="listitem">
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium" aria-label={`Email: ${formData.email}`}>{formData.email}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg" role="listitem">
                  <p className="text-sm text-gray-500">Telefone</p>
                  <p className="font-medium" aria-label={`Telefone: ${formData.telefone}`}>{formData.telefone}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Formulario de edição */}
          <div className="w-full md:w-[500px] lg:w-[550px]" role="region" aria-label="Formulário de edição">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600" role="alert" aria-label="Mensagem de erro">
                  {error}
                </div>
              )}
              {success && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-600" role="status" aria-label="Mensagem de sucesso">
                  {success}
                </div>
              )}
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-gray-700 font-medium" htmlFor="primeiroNome">Primeiro Nome</label>
                  <div className="relative">
                    <input
                      type="text"
                      id="primeiroNome"
                      name="primeiroNome"
                      value={formData.primeiroNome}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-700 transition-all"
                      required
                      aria-label="Campo para editar primeiro nome"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-gray-700 font-medium" htmlFor="sobrenome">Sobrenome</label>
                  <div className="relative">
                    <input
                      type="text"
                      id="sobrenome"
                      name="sobrenome"
                      value={formData.sobrenome}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-700 transition-all"
                      required
                      aria-label="Campo para editar sobrenome"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-gray-700 font-medium" htmlFor="email">Email</label>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-700 transition-all"
                      required
                      aria-label="Campo para editar email"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-gray-700 font-medium" htmlFor="telefone">Telefone</label>
                  <div className="relative flex gap-3">
                    <select 
                      className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent w-28 text-gray-700 transition-all"
                      aria-label="Selecionar código do país"
                    >
                      <option value="+55">+55</option>
                    </select>
                    <div className="relative flex-1">
                      <input
                        type="tel"
                        id="telefone"
                        name="telefone"
                        value={formData.telefone}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-700 transition-all"
                        required
                        aria-label="Campo para editar número de telefone"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-gray-700 font-medium" htmlFor="senha">Nova Senha (opcional)</label>
                  <div className="relative">
                    <input
                      type="password"
                      id="senha"
                      name="senha"
                      value={formData.senha}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-700 transition-all"
                      minLength={6}
                      aria-label="Campo para inserir nova senha"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-gray-700 font-medium" htmlFor="confirmeSenha">Confirme sua senha</label>
                  <div className="relative">
                    <input
                      type="password"
                      id="confirmeSenha"
                      name="confirmeSenha"
                      value={formData.confirmeSenha}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-700 transition-all"
                      minLength={6}
                      aria-label="Campo para confirmar nova senha"
                    />
                  </div>
                </div>

                <button
                  type="submit" 
                  disabled={loading}
                  className={`w-full bg-[#00A3FF] text-white py-3 px-6 rounded-lg font-medium hover:bg-[#0088cc] transition-all focus:outline-none focus:ring-2 focus:ring-[#00A3FF] focus:ring-offset-2 mt-8 text-lg cursor-pointer shadow-md ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  aria-label={loading ? "Salvando alterações..." : "Salvar alterações do perfil"}
                >
                  {loading ? 'Salvando...' : 'Salvar alterações'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditarPerfilUsuario;


