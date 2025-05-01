import React, { useState } from 'react';
import Header from '../../Components/Header/Header';

function EditarPerfilUsuario() {
  const [formData, setFormData] = useState({
    primeiroNome: 'Ricardo',
    sobrenome: 'Penne Decco',
    email: 'ricardopenne777@gmail.com',
    telefone: '(32) 99137-4767',
    senha: '',
    confirmeSenha: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aqui você implementará a lógica para salvar as alterações
    console.log('Dados atualizados:', formData);
  };

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between max-w-[1200px] mx-auto gap-16 lg:gap-32">
          {/* Informações do usuario */}
          <div className="w-full md:w-[400px] lg:w-[450px]">
            <div className="bg-[#9C9C9C] rounded-xl p-8 py-20">
              <div className="relative flex justify-center mb-8">
                <div className="w-60 h-60 bg-black rounded-full relative">
                  <button className="absolute bottom-3 right-3 bg-white rounded-full w-10 h-10 flex items-center justify-center">
                    <span className="text-2xl">📷</span>
                  </button>
                </div>
              </div>
              <div className="space-y-4 text-white text-lg font-medium">
                <div>
                  <p>Primeiro Nome: Ricardo</p>
                </div>
                <div>
                  <p>Sobrenome: Penne Decco</p>
                </div>
                <div>
                  <p>Email: ricardopenne777@gmail.com</p>
                </div>
                <div>
                  <p>Telefone: +55 (32) 99137-4767</p>
                </div>
              </div>
            </div>
          </div>

          {/* Formulario de edição */}
          <div className="w-full md:w-[500px] lg:w-[550px] pt-4">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-[#0891B2] text-base">Primeiro Nome:</label>
                <div className="relative">
                  <input
                    type="text"
                    name="primeiroNome"
                    value={formData.primeiroNome}
                    onChange={handleChange}
                    className="w-full p-3 border-2 border-[#0891B2] rounded-full focus:outline-none focus:ring-2 focus:ring-[#0891B2] focus:border-transparent text-lg"
                  />
                  <button type="button" className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#0891B2]">
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[#0891B2] text-base">Sobrenome:</label>
                <div className="relative">
                  <input
                    type="text"
                    name="sobrenome"
                    value={formData.sobrenome}
                    onChange={handleChange}
                    className="w-full p-3 border-2 border-[#0891B2] rounded-full focus:outline-none focus:ring-2 focus:ring-[#0891B2] focus:border-transparent text-lg"
                  />
                  <button type="button" className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#0891B2]">
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[#0891B2] text-base">Email:</label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-3 border-2 border-[#0891B2] rounded-full focus:outline-none focus:ring-2 focus:ring-[#0891B2] focus:border-transparent text-lg"
                  />
                  <button type="button" className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#0891B2]">
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[#0891B2] text-base">Telefone:</label>
                <div className="relative flex gap-3">
                  <select className="p-3 border-2 border-[#0891B2] rounded-full focus:outline-none focus:ring-2 focus:ring-[#0891B2] focus:border-transparent w-28 text-lg">
                    <option value="+55">+55</option>
                  </select>
                  <div className="relative flex-1">
                    <input
                      type="tel"
                      name="telefone"
                      value={formData.telefone}
                      onChange={handleChange}
                      className="w-full p-3 border-2 border-[#0891B2] rounded-full focus:outline-none focus:ring-2 focus:ring-[#0891B2] focus:border-transparent text-lg"
                    />
                    <button type="button" className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#0891B2]">
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[#0891B2] text-base">Senha:</label>
                <div className="relative">
                  <input
                    type="password"
                    name="senha"
                    value={formData.senha}
                    onChange={handleChange}
                    className="w-full p-3 border-2 border-[#0891B2] rounded-full focus:outline-none focus:ring-2 focus:ring-[#0891B2] focus:border-transparent text-lg"
                  />
                  <button type="button" className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#0891B2]">
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[#0891B2] text-base">Confirme sua senha:</label>
                <div className="relative">
                  <input
                    type="password"
                    name="confirmeSenha"
                    value={formData.confirmeSenha}
                    onChange={handleChange}
                    className="w-full p-3 border-2 border-[#0891B2] rounded-full focus:outline-none focus:ring-2 focus:ring-[#0891B2] focus:border-transparent text-lg"
                  />
                </div>
              </div>

              <button
                type="submit" 
                className="w-full bg-[#0891B2] text-white py-3 px-6 rounded-full font-medium hover:bg-[#0891B2]/90 transition-colors focus:outline-none focus:ring-2 focus:ring-[#0891B2] focus:ring-offset-2 mt-8 text-lg cursor-pointer"
              >
                Salvar alterações
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default EditarPerfilUsuario;


