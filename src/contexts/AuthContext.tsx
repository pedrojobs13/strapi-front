import { api } from "@/services/api";
import { ReactNode, createContext, useEffect, useState } from "react";
import { setCookie, parseCookies, destroyCookie } from "nookies";
import Router from "next/router";

interface ErrorResponse {
  message: string;
}
type SignInData = {
  identifier: string;
  password: string;
};
interface AuthChildrenProps {
  children: ReactNode;
}
type User = {
  username: string;
  email: string;
  id: number;
};

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  signIn: (data: SignInData) => Promise<void>;
  signOut: () => void;
  errorString: string;
}
export const AuthContext = createContext({} as AuthContextType);

export function signOut() {
  destroyCookie(undefined, "nextauth.token");
  if (typeof window === "undefined") return null;
  Router.push("/");
  Router.reload();
}

export function AuthProvider({ children }: AuthChildrenProps) {
  const [errorString, setErrorString] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const isAuthenticated = !!user;

  useEffect(() => {
    const { "nextauth.token": jwt } = parseCookies();
    if (jwt) {
      api
        .get("/users/me?populate=*")
        .then((response) => {
          const { username, email, id } = response.data;
          setUser({ username, email, id });
        })
        .catch(() => signOut());
    }
  }, []);

  async function signIn({ identifier, password }: SignInData) {
    try {
      const response = await api.post("/auth/local", { identifier, password });
      const { jwt, user } = response.data;
      setCookie(undefined, "nextauth.token", jwt, {
        maxAge: 60, // 1 minuto
      });
      api.defaults.headers["Authorization"] = `Bearer ${jwt}`;
      setUser(user);
      Router.push("./dashboard");
    } catch (error: ErrorResponse | any) {
      if (error?.message == "Request failed with status code 400") {
        setErrorString("A senha ou usuario estão errados");
      }
    }
  }

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, signIn, user, signOut, errorString }}
    >
      {children}
    </AuthContext.Provider>
  );
}
