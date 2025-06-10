import React, { useState, useEffect } from 'react';
import Header from '../../Components/Header/Header';
import { userService } from '../../services/userService';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

function EditarPerfilUsuario() {
  const [formData, setFormData] = useState({
    primeiroNome: '',
    sobrenome: '',
    email: '',
    telefone: '',
    senha: '',
    confirmeSenha: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userId, setUserId] = useState('');

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
        password: formData.senha || undefined
      };

      const response = await userService.updateUser(userId, userData);
      
      // Atualiza o token no cookie
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
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Editar Perfil</h1>
        <div className="flex flex-col md:flex-row justify-between max-w-[1200px] mx-auto gap-8 lg:gap-16">
          {/* Informações do usuario */}
          <div className="w-full md:w-[400px] lg:w-[450px]">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="relative flex justify-center mb-8">
                <div className="w-48 h-48 bg-gray-200 rounded-full relative overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-4xl">
                    {formData.primeiroNome.charAt(0)}{formData.sobrenome.charAt(0)}
                  </div>
                  <button className="absolute bottom-3 right-3 bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md hover:bg-gray-50 transition-colors">
                    <span className="text-xl">📷</span>
                  </button>
                </div>
              </div>
              <div className="space-y-4 text-gray-700">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Primeiro Nome</p>
                  <p className="font-medium">{formData.primeiroNome}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Sobrenome</p>
                  <p className="font-medium">{formData.sobrenome}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{formData.email}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Telefone</p>
                  <p className="font-medium">{formData.telefone}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Formulario de edição */}
          <div className="w-full md:w-[500px] lg:w-[550px]">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
                  {error}
                </div>
              )}
              {success && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-600">
                  {success}
                </div>
              )}
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-gray-700 font-medium">Primeiro Nome</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="primeiroNome"
                      value={formData.primeiroNome}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-700 transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-gray-700 font-medium">Sobrenome</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="sobrenome"
                      value={formData.sobrenome}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-700 transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-gray-700 font-medium">Email</label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-700 transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-gray-700 font-medium">Telefone</label>
                  <div className="relative flex gap-3">
                    <select className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent w-28 text-gray-700 transition-all">
                      <option value="+55">+55</option>
                    </select>
                    <div className="relative flex-1">
                      <input
                        type="tel"
                        name="telefone"
                        value={formData.telefone}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-700 transition-all"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-gray-700 font-medium">Nova Senha (opcional)</label>
                  <div className="relative">
                    <input
                      type="password"
                      name="senha"
                      value={formData.senha}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-700 transition-all"
                      minLength={6}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-gray-700 font-medium">Confirme sua senha</label>
                  <div className="relative">
                    <input
                      type="password"
                      name="confirmeSenha"
                      value={formData.confirmeSenha}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-700 transition-all"
                      minLength={6}
                    />
                  </div>
                </div>

                <button
                  type="submit" 
                  disabled={loading}
                  className={`w-full bg-[#00A3FF] text-white py-3 px-6 rounded-lg font-medium hover:bg-[#0088cc] transition-all focus:outline-none focus:ring-2 focus:ring-[#00A3FF] focus:ring-offset-2 mt-8 text-lg cursor-pointer shadow-md ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
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


