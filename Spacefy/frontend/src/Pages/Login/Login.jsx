import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../Components/Header/Header";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import profile from "../../assets/Profile.svg";
import { useUser } from "../../Contexts/UserContext";
import { authService } from "../../services/authService";
import Cookies from "js-cookie"; // Importa a biblioteca js-cookie

function LoginUsuario() {
  const navigate = useNavigate();
  const { login } = useUser();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { token, user } = await authService.login(
        formData.email,
        formData.password
      );

      if (token) {
        login(token); // O método login do contexto já armazena o token no cookie
        navigate("/Home", { replace: true });
      } else {
        toast.error("Erro: Token não recebido.");
      }
    } catch (error) {
      if (!error.response) {
        toast.error("Erro de conexão com o servidor.");
      } else if (error.response.status === 401) {
        toast.error("E-mail ou senha incorretos.");
      } else {
        toast.error("Erro no servidor. Tente novamente mais tarde.");
      }
    }
  };

  return (
    <div className="w-full min-h-screen bg-[radial-gradient(circle,_#6ACDFF,_#C2EBFF)]">
      <Header />
      <div className="max-w-lg mx-auto mt-4 sm:mt-6 md:mt-10 py-6 sm:py-8 md:py-10 bg-white rounded-2xl shadow-md px-4 sm:px-6 md:px-8">
        <div className="w-full border-b-2 border-[#E3E3E3] pb-2 mb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-center w-full text-[#2F2F2F]">
            Login
          </h2>
        </div>
        <img
          src={profile}
          alt="Profile"
          className="w-20 sm:w-24 md:w-28 h-auto mx-auto mb-4 mt-5"
        />
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="flex flex-col gap-1">
            <label className="block mt-3 sm:mt-5 font-medium text-[#2F2F2F]">
              E-mail
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Digite seu e-mail"
              className="w-full p-2 text-sm sm:text-base border-2 border-[#A1A1A1] rounded-lg focus:outline-none"
              required
            />

            <label className="block mt-3 font-medium text-[#2F2F2F]">
              Senha
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Digite sua senha"
              className="w-full p-2 text-sm sm:text-base border-2 border-[#A1A1A1] rounded-lg focus:outline-none"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full mt-3 cursor-pointer bg-[#1EACE3] text-white py-2 sm:py-3 rounded-lg hover:bg-[#1486B8] transition text-lg sm:text-xl font-bold tracking-wide"
            style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.4)" }}
          >
            Login
          </button>

          <div className="flex flex-col items-center mt-4">
            <label className="block text-sm sm:text-base">
              Não possui uma conta?
            </label>
            <button
              onClick={() => navigate("/cadastro")}
              className="text-[#1EACE3] hover:text-[#1486B8] cursor-pointer text-sm sm:text-base"
            >
              Crie uma conta
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}

export default LoginUsuario;
