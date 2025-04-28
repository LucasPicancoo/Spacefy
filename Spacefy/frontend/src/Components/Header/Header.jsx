import logo from "../../assets/Logo.svg";
import { CgProfile } from "react-icons/cg";
import { useState, useRef, useEffect } from "react";

export default function Header() {
  const [menuVisible, setMenuVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const menuRef = useRef(null);

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

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      setIsLoggedIn(true);
      setUser(JSON.parse(storedUser));
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
    window.location.href = "/";
  };

  return (
    <header className="bg-white shadow-md h-17 relative flex items-center border-b-2 border-[#E3E3E3]">
      <a
        className="absolute left-4 md:left-12 flex items-center gap-x-2"
        href="/"
      >
        <img src={logo} alt="Logo" className="w-6 sm:w-8 md:w-10 h-auto" />
        <span className="text-2xl sm:text-3xl md:text-4xl bg-gradient-to-r from-[#1EACE3] to-[#152F6C] bg-clip-text text-transparent tracking-widest">
          SPACEFY
        </span>
      </a>
      <nav className="mx-auto flex gap-x-8 text-gray-600">
        <a href="#" className="relative group">
          Descobrir
          <span className="absolute left-0 bottom-0 w-full h-0.5 bg-[#1EACE3] scale-x-0 group-hover:scale-x-100 origin-left transition-all duration-300"></span>
        </a>
        <a href="#" className="relative group">
          Anunciar
          <span className="absolute left-0 bottom-0 w-full h-0.5 bg-[#1EACE3] scale-x-0 group-hover:scale-x-100 origin-left transition-all duration-300"></span>
        </a>
        {/* Perfil Teste */}
        <a href="/Perfil" className="relative group">
          Perfil
          <span className="absolute left-0 bottom-0 w-full h-0.5 bg-[#1EACE3] scale-x-0 group-hover:scale-x-100 origin-left transition-all duration-300"></span>
        </a>
      </nav>

      {isLoggedIn ? (
        <>
          <div
            className="absolute right-5 md:right-10 lg:right-30 flex items-center gap-1 cursor-pointer"
            onClick={toggleMenu}
          >
            <CgProfile className="text-[#2F2F2F] w-6 h-auto" />
            <span className="text-sm text-[#2F2F2F] font-medium hidden sm:inline">
            {user?.name}
            </span>
          </div>

          {menuVisible && (
            <div
              ref={menuRef}
              className="absolute right-5 md:right-10 lg:right-30 mt-2 bg-white shadow-lg rounded-md w-40 z-10"
              style={{ top: "calc(50% + 10px)", right: "0.5rem" }}
            >
              <ul className="text-gray-700">
                <li className="px-4 py-2 hover:bg-gray-200 rounded-md cursor-pointer">
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
          <a href="/Cadastro" className="hover:text-blue-600">
            Cadastre-se
          </a>
        </div>
      )}
    </header>
  );
}
