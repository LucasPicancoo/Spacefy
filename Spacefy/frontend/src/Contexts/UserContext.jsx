import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie"; // Biblioteca para manipular cookies

// Criação do contexto do usuário
const UserContext = createContext(undefined);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = Cookies.get("token");

        if (token) {
          const decodedToken = jwtDecode(token);
          const currentTime = Date.now() / 1000;

          if (decodedToken.exp < currentTime) {
            Cookies.remove("token");
            setIsLoggedIn(false);
            setUser(null);
          } else {
            setUser({
              id: decodedToken.id,
              name: decodedToken.name,
              surname: decodedToken.surname,
              email: decodedToken.email,
              telephone: decodedToken.telephone,
              role: decodedToken.role,
              profilePhoto: decodedToken.profilePhoto,
            });
            setIsLoggedIn(true);
          }
        } else {
          setIsLoggedIn(false);
          setUser(null);
        }
      } catch (error) {
        console.error("Erro ao inicializar autenticação:", error);
        setIsLoggedIn(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
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
        profilePhoto: decodedToken.profilePhoto,
      });
      setIsLoggedIn(true);

      // Armazena o token no cookie
      Cookies.set("token", token, {
        secure: import.meta.env.VITE_NODE_ENV === "production", // Apenas HTTPS em produção
        sameSite: "strict", // Protege contra CSRF
        expires: 1, // Expira em 1 dia
      });
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

  const updateUser = (newUserData) => {
    setUser(prevUser => ({
      ...prevUser,
      ...newUserData
    }));
  };

  return (
    <UserContext.Provider value={{ user, isLoggedIn, login, logout, updateUser, isLoading }}>
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
