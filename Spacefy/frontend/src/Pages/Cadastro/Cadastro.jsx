import { useState } from "react";
import axios from "axios";
import Header from "../../Components/Header/Header";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function CadastroUsuario() {
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
    telephone: "",
    role: "usuario",
  });

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

    console.log("Formulário preenchido:", formData); //REMOVER APOS FASE DE TESTES

    try {
      await axios.post("http://localhost:3000/users/createUser", formData);
      // setMensagem("Usuário cadastrado com sucesso!"); OPCIONAL
      setFormData({ name: "", surname: "", email: "", password: "", telephone: "", role: "" });
    } catch (error) {
      if (error.response) {
        toast.error(`Erro: ${error.response.data?.mensagem || "falha ao cadastrar."}`);
      } else {
        toast.error("Erro de conexão com o servidor.");
      }
    }
  };

  return (
    <div className="w-full h-screen bg-[radial-gradient(circle,_#6ACDFF,_#C2EBFF)]">
    <Header />
    <div className="max-w-lg mx-auto mt-10 py-10 bg-white rounded-2xl shadow-md">
      <div className="w-full border-b-2 border-[#E3E3E3] pb-2 mb-4">
        <h2 className="text-2xl font-bold text-center w-full text-[#2F2F2F]">Cadastro</h2>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6 mx-10">
        <label className="block mb-2 font-medium text-[#2F2F2F]">Nome Completo</label>
        <div className="flex gap-1">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Primeiro Nome"
          className="w-1/3 p-2 border-2 border-[#A1A1A1] rounded-lg focus:outline-none"
          required
        />
        
        <input
          type="text"
          name="surname"
          value={formData.surname}
          onChange={handleChange}
          placeholder="Sobrenome"
          className="w-2/3 p-2 border-2 border-[#A1A1A1] rounded-lg focus:outline-none"
          required
        />
        </div>

        <label className="block mb-2 font-medium text-[#2F2F2F]">E-mail</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Digite seu e-mail"
          className="w-full p-2 border-2 border-[#A1A1A1] rounded-lg focus:outline-none"
          required
        />
        <label className="block mb-2 font-medium text-[#2F2F2F]"> Senha</label>
        <div className="flex flex-col gap-2">
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Digite sua senha"
          className={`w-full p-2 border-2 rounded-lg ${ senhaInvalida ? "border-red-500 text-red-500" : "border-[#A1A1A1] text-black" } focus:outline-none`}
          required
        />
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Digite sua senha novamente"
            className={`w-full p-2 border-2 rounded-lg ${senhaInvalida ? "border-red-500 text-red-500" : "border-[#A1A1A1] text-black"} focus:outline-none`}
            required
          />
          {senhaInvalida && (
            <p className="text-red-500 text-sm font-medium">As senhas não coincidem.</p>
          )}
        </div>

        <label className="block mb-2 font-medium text-[#2F2F2F]">Telefone</label>
        <input
          type="tel"
          name="telephone"
          value={formData.telephone}
          onChange={handleChange}
          placeholder="Digite seu telefone"
          className="w-full p-2 border-2 border-[#A1A1A1] rounded-lg focus:outline-none"
          required
        />
        <button
          type="submit"
          className="w-full mt-3 cursor-pointer bg-[#1EACE3] text-white py-3 rounded-lg hover:bg-[#1486B8] transition text-xl font-bold tracking-wide"
          style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.4)' }}
        >
          Cadastrar
        </button>
        <div className="flex flex-col items-center">
        <label className="block">Já possui uma conta?</label>
        <a href="/login" className="text-[#1EACE3] hover:text-[#1486B8]">Faça login</a>
        </div>
      </form>
    </div>
    <ToastContainer />
    </div>
  );
}

export default CadastroUsuario;
