import logo from "../../assets/Logo.svg";
import { CgProfile } from "react-icons/cg";
import { useState, useRef, useEffect } from "react";
import { useUser } from "../../Contexts/userContext"; // Importe o hook useUser
import { useNavigate } from "react-router-dom";

export default function Header() {
  const { user, isLoggedIn, logout } = useUser(); // Usando o contexto
  const [menuVisible, setMenuVisible] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  // Fecha o menu ao clicar fora dele
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout(); // Usando o logout do contexto
    navigate("/"); // Redirecionamento após logout
  };

  const handlePerfil = () => {
    navigate("/Perfil");
  };

  useEffect(() => {
    console.log(user); // Verifique se o nome está sendo atribuído corretamente
  }, [user]);

  return (
    <header className="bg-white shadow-md h-17 relative flex items-center border-b-2 border-[#E3E3E3]">
      <div onClick={() => navigate("/")} className="absolute left-4 md:left-12 flex items-center gap-x-2 cursor-pointer">
        <img src={logo} alt="Logo" className="w-6 sm:w-8 md:w-10 h-auto" />
        <span className="text-2xl sm:text-3xl md:text-4xl bg-gradient-to-r from-[#1EACE3] to-[#152F6C] bg-clip-text text-transparent tracking-widest">
          SPACEFY
        </span>
      </div>
      <nav className="mx-auto flex gap-x-8 text-gray-600">
        <button onClick={() => navigate("/Descobrir")} className="relative group cursor-pointer">
          Descobrir
          <span className="absolute left-0 bottom-0 w-full h-0.5 bg-[#1EACE3] scale-x-0 group-hover:scale-x-100 origin-left transition-all duration-300"></span>
        </button>
        <button onClick={() => navigate("/")} className="relative group cursor-pointer">
          Anunciar
          <span className="absolute left-0 bottom-0 w-full h-0.5 bg-[#1EACE3] scale-x-0 group-hover:scale-x-100 origin-left transition-all duration-300"></span>
        </button>
      </nav>

      {isLoggedIn ? (
        <>
          <div
            className="absolute right-5 md:right-10 lg:right-30 flex items-center gap-1 cursor-pointer"
            onClick={toggleMenu}
          >
            <CgProfile className="text-[#2F2F2F] w-6 h-auto" />
            <span className="text-sm text-[#2F2F2F] font-medium hidden sm:inline">
              {user?.name} {/* Exibindo o nome do usuário */}
            </span>
          </div>

          {menuVisible && (
            <div
              ref={menuRef}
              className="absolute right-5 md:right-10 lg:right-30 mt-2 bg-white shadow-lg rounded-md w-40 z-10"
              style={{ top: "calc(50% + 10px)", right: "0.5rem" }}
            >
              <ul className="text-gray-700">
                <li className="px-4 py-2 hover:bg-gray-200 rounded-md cursor-pointer" onClick={handlePerfil}>
                  Meu Perfil
                </li>
                <li className="px-4 py-2 hover:bg-gray-200 rounded-md cursor-pointer">
                  Mensagens
                </li>
                <li className="px-4 py-2 hover:bg-gray-200 rounded-md cursor-pointer" onClick={handleLogout}>
                  Logout
                </li>
              </ul>
            </div>
          )}
        </>
      ) : (
        <div className="absolute right-5 md:right-10 lg:right-30">
          <button onClick={() => navigate("/Cadastro")} className="hover:text-blue-600 cursor-pointer">
            Cadastre-se
          </button>
        </div>
      )}
    </header>
  );
}
