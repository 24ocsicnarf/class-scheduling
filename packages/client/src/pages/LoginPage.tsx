import { LoginForm } from "../features/auth/components/LoginForm";

const LoginPage = () => {
  return (
    <div className="p-4 flex justify-center">
      <div className="min-w-max w-1/3 max-w-[480px]">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
