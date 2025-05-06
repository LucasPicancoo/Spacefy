import { useState } from "react";
import axios from "axios";
import Header from "../../Components/Header/Header";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
function CadastroUsuario() {
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
    telephone: "",
    role: "usuario",
  });

  const navigate = useNavigate();

  const [senhaInvalida, setSenhaInvalida] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    if (e.target.name === "password" || e.target.name === "confirmPassword") {
      setSenhaInvalida(false); // reseta o erro ao digitar
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setSenhaInvalida(true);
      return;
    } //INCREMENTAR VALIDAÇÃO NO BACKEND

    try {
      await axios.post("http://localhost:3000/users/createUser", formData);
      // setMensagem("Usuário cadastrado com sucesso!"); OPCIONAL
      setFormData({ name: "", surname: "", email: "", password: "", telephone: "", role: "" });
      toast.success("Usuário cadastrado com sucesso!");
    } catch (error) {
      if (error.response) {
        toast.error(`Erro: ${error.response.data?.mensagem || "falha ao cadastrar."}`);
      } else {
        toast.error("Erro de conexão com o servidor.");
      }
    }
  };

  return (
    <div className="w-full min-h-screen bg-[radial-gradient(circle,_#6ACDFF,_#C2EBFF)]">
    <Header />
    <div className="max-w-lg mx-auto mt-4 sm:mt-6 md:mt-10 py-6 sm:py-8 md:py-10 bg-white rounded-2xl shadow-md px-4 sm:px-6 md:px-8">
      <div className="w-full border-b-2 border-[#E3E3E3] pb-2 mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-center w-full text-[#2F2F2F]">Cadastro</h2>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        <label className="block mb-2 font-medium text-[#2F2F2F] text-sm sm:text-base">Nome Completo</label>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-1">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Primeiro Nome"
          className="w-full sm:w-1/3 p-2 text-sm sm:text-base border-2 border-[#A1A1A1] rounded-lg focus:outline-none"
          required
        />
        
        <input
          type="text"
          name="surname"
          value={formData.surname}
          onChange={handleChange}
          placeholder="Sobrenome"
          className="w-full sm:w-2/3 p-2 text-sm sm:text-base border-2 border-[#A1A1A1] rounded-lg focus:outline-none"
          required
        />
        </div>

        <label className="block mb-2 font-medium text-[#2F2F2F] text-sm sm:text-base">E-mail</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Digite seu e-mail"
          className="w-full p-2 text-sm sm:text-base border-2 border-[#A1A1A1] rounded-lg focus:outline-none"
          required
        />
        <label className="block mb-2 font-medium text-[#2F2F2F] text-sm sm:text-base">Senha</label>
        <div className="flex flex-col gap-2">
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Digite sua senha"
          className={`w-full p-2 text-sm sm:text-base border-2 rounded-lg ${ senhaInvalida ? "border-red-500 text-red-500" : "border-[#A1A1A1] text-black" } focus:outline-none`}
          required
        />
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Digite sua senha novamente"
            className={`w-full p-2 text-sm sm:text-base border-2 rounded-lg ${senhaInvalida ? "border-red-500 text-red-500" : "border-[#A1A1A1] text-black"} focus:outline-none`}
            required
          />
          {senhaInvalida && (
            <p className="text-red-500 text-xs sm:text-sm font-medium">As senhas não coincidem.</p>
          )}
        </div>

        <label className="block mb-2 font-medium text-[#2F2F2F] text-sm sm:text-base">Telefone</label>
        <input
          type="tel"
          name="telephone"
          value={formData.telephone}
          onChange={handleChange}
          placeholder="Digite seu telefone"
          className="w-full p-2 text-sm sm:text-base border-2 border-[#A1A1A1] rounded-lg focus:outline-none"
          required
        />
        <button
          type="submit"
          className="w-full mt-3 cursor-pointer bg-[#1EACE3] text-white py-2 sm:py-3 rounded-lg hover:bg-[#1486B8] transition text-lg sm:text-xl font-bold tracking-wide"
          style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.4)' }}
        >
          Cadastrar
        </button>
        <div className="flex flex-col items-center">
        <label className="block text-sm sm:text-base">Já possui uma conta?</label>
        <button onClick={() => navigate("/login")} className="text-[#1EACE3] hover:text-[#1486B8] cursor-pointer text-sm sm:text-base">Faça login</button>
        </div>
      </form>
    </div>
    <ToastContainer />
    </div>
  );
}

export default CadastroUsuario;
