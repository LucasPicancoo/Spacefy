import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../Components/Header/Header";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import profile from "../../assets/Profile.svg";
import { useUser } from "../../Contexts/userContext";

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

    //console.log(formData); //REMOVER APOS FASE DE TESTES

    try {
      const response = await axios.post(
        "http://localhost:3000/auth/login",
        formData
      );

      const { token, user} = response.data;
      // console.log("Token recebido:", token); //REMOVER APOS FASE DE TESTES

      if (token) {
        login(token);
        localStorage.setItem("token", token);
        navigate("/Home", { replace: true }) ;
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
    <div className="w-full h-screen bg-[radial-gradient(circle,_#6ACDFF,_#C2EBFF)]">
      <Header />
      <div className="max-w-lg mx-auto mt-10 py-10 bg-white rounded-2xl shadow-md">
        <div className="w-full border-b-2 border-[#E3E3E3] pb-2 mb-4">
          <h2 className="text-2xl font-bold text-center w-full text-[#2F2F2F]">
            Login
          </h2>
        </div>
        <img
          src={profile}
          alt="Profile"
          className="w-28 h-auto mx-auto mb-4 mt-5"
        />
        <form onSubmit={handleSubmit} className="space-y-6 mx-10">
          <div className="flex flex-col gap-1">
            <label className="block mt-5 font-medium text-[#2F2F2F]">
              E-mail
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Digite seu e-mail"
              className="w-full p-2 border-2 border-[#A1A1A1] rounded-lg focus:outline-none"
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
              className="w-full p-2 border-2 border-[#A1A1A1] rounded-lg focus:outline-none"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full mt-3 cursor-pointer bg-[#1EACE3] text-white py-3 rounded-lg hover:bg-[#1486B8] transition text-xl font-bold tracking-wide"
            style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.4)" }}
          >
            Login
          </button>

          <div className="flex flex-col items-center mt-4">
            <label className="block">Não possui uma conta?</label>
            <button onClick={() => navigate("/cadastro")} className="text-[#1EACE3] hover:text-[#1486B8] cursor-pointer">
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
