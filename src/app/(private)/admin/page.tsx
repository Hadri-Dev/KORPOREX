import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-gold-500">Korporex</p>
          <h1 className="mt-1 font-serif text-2xl text-navy-900">Sign in</h1>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
