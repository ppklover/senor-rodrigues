import React, { createContext, useContext, useState, useEffect } from "react";

// Criação do contexto
const AuthContext = createContext();

// Provedor do contexto
export const AuthProvider = ({ children }) => {
  const [usuarioLogado, setUsuarioLogado] = useState(null);

  useEffect(() => {
    // Simulação de login
    const userStorage = localStorage.getItem("usuarioLogado");
    if (userStorage) {
      setUsuarioLogado(JSON.parse(userStorage));
    }
  }, []);

  const login = (usuario) => {
    setUsuarioLogado(usuario);
    localStorage.setItem("usuarioLogado", JSON.stringify(usuario));
  };

  const logout = () => {
    setUsuarioLogado(null);
    localStorage.removeItem("usuarioLogado");
  };

  return (
    <AuthContext.Provider value={{ usuarioLogado, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para acessar o contexto
export const useAuth = () => useContext(AuthContext);
