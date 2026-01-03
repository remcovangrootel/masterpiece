import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  // ============================
  //   TOKEN → USER LADEN
  // ============================
  useEffect(() => {
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    async function fetchUser() {
      try {
        const res = await fetch("http://localhost:4000/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        });

        const data = await res.json();

        if (res.ok && data.success) {
          setUser(data.user);
        } else {
          // Token ongeldig → uitloggen
          setUser(null);
          setToken(null);
          localStorage.removeItem("token");
        }
      } catch (err) {
        console.error("Fout bij ophalen gebruiker:", err);
        setUser(null);
        setToken(null);
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    }

    fetchUser();

    return () => controller.abort();
  }, [token]);

  // ============================
  //         LOGIN
  // ============================
  const login = async (email, password) => {
    try {
      const res = await fetch("http://localhost:4000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem("token", data.token);
        setToken(data.token);
        setUser(data.user);
      }

      return data;
    } catch (err) {
      console.error("Login fout:", err);
      return { success: false, message: "Serverfout bij inloggen" };
    }
  };

  // ============================
  //         LOGOUT
  // ============================
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}



