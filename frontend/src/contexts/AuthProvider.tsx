import { createContext, useContext, useState } from "react";
import { RedirectResult, User } from "../types";

// @ts-expect-error - later
const AuthContext = createContext<AuthContextData | undefined>();

interface AuthProviderProps {
  children: React.ReactNode;
}

export interface AuthContextData {
  user: User | undefined;
  setUser: (user: User) => void;
  redirectResult: RedirectResult | undefined;
  setRedirectResult: (redirectResult: RedirectResult) => void;
}

function AuthProvider({ children }: AuthProviderProps) {
  const [redirectResult, setRedirectResult] = useState<
    RedirectResult | undefined
  >();
  const [user, setUser] = useState<User | undefined>();

  return (
    <AuthContext.Provider
      value={{
        redirectResult,
        setRedirectResult,
        user,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useAuth(): AuthContextData | undefined {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export { AuthProvider, useAuth };
