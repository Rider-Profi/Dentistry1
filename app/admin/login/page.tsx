import { LoginForm } from "@/components/admin/login-form";
import { Logo } from "@/components/logo";

export default function LoginPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-mint/50 p-5">
      <div className="w-full max-w-md">
        <div className="mb-7 flex justify-center"><Logo /></div>
        <LoginForm />
      </div>
    </main>
  );
}
