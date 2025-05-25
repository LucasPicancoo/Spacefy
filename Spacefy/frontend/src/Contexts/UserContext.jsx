import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie"; // Biblioteca para manipular cookies

// Criação do contexto do usuário
const UserContext = createContext(undefined);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = Cookies.get("token"); // Lê o token do cookie

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        
        // Verifica se o token expirou
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp < currentTime) {
          Cookies.remove("token");
          setIsLoggedIn(false);
          setUser(null);
          return;
        }

        setUser({
          id: decodedToken.id,
          name: decodedToken.name,
          surname: decodedToken.surname,
          email: decodedToken.email,
          telephone: decodedToken.telephone,
          role: decodedToken.role,
        });
        setIsLoggedIn(true);
      } catch (error) {
        console.error("Erro ao decodificar o token", error);
        setIsLoggedIn(false);
        setUser(null);
      }
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }
  }, []);

  const login = (token) => {
    try {
      const decodedToken = jwtDecode(token);
      setUser({
        id: decodedToken.id,
        name: decodedToken.name,
        surname: decodedToken.surname,
        email: decodedToken.email,
        telephone: decodedToken.telephone,
        role: decodedToken.role,
      });
      setIsLoggedIn(true);

      // Armazena o token no cookie
      Cookies.set("token", token, {
        secure: import.meta.env.VITE_NODE_ENV === "production", // Apenas HTTPS em produção
        sameSite: "strict", // Protege contra CSRF
        expires: 1, // Expira em 1 dia
      });

      window.location.href = "/Descobrir"; // Redireciona o usuário após o login
    } catch (error) {
      console.error("Erro ao decodificar o token", error);
      setIsLoggedIn(false);
      setUser(null);
    }
  };

  const logout = () => {
    Cookies.remove("token"); // Remove o token do cookie
    setIsLoggedIn(false);
    setUser(null);
    window.location.href = "/"; // Redirecionamento após logout
  };

  return (
    <UserContext.Provider value={{ user, isLoggedIn, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

// Hook personalizado para usar o contexto
export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser precisa estar dentro de um UserProvider");
  }
  return context;
}
