import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from 'jwt-decode';

// Criação do contexto do usuário
const UserContext = createContext(undefined);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        console.log(decodedToken)
        setUser({ id: decodedToken.id, name: decodedToken.name, surname: decodedToken.surname, email: decodedToken.email, telephone: decodedToken.telephone, role: decodedToken.role });
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
        role: decodedToken.role
      });
      setIsLoggedIn(true);
      localStorage.setItem("token", token); // Salvar token no localStorage
      window.location.href = "/Descobrir" // Redireciona o usuário após o login
    } catch (error) {
      console.error("Erro ao decodificar o token", error);
      setIsLoggedIn(false);
      setUser(null);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
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
