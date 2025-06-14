
import { useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { login, signup } = useAuth();

  const handleLogin = async (email: string, password: string) => {
    // The role will be fetched from the user's profile in the database
    await login(email, password, "tenant"); // Role parameter is ignored now
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {isLogin ? (
          <LoginForm
            onLogin={handleLogin}
            onSwitchToSignup={() => setIsLogin(false)}
          />
        ) : (
          <SignupForm
            onSignup={signup}
            onSwitchToLogin={() => setIsLogin(true)}
          />
        )}
      </div>
    </div>
  );
};

export default AuthPage;
