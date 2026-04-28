import LogoutButton from "./LogoutButton";

export default function DashboardPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <header className="flex items-center justify-between border-b border-gray-200 pb-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-gold-500">Korporex</p>
          <h1 className="mt-1 font-serif text-3xl text-navy-900">Dashboard</h1>
        </div>
        <LogoutButton />
      </header>

      <section className="mt-10 rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
        <h2 className="font-serif text-xl text-navy-900">Welcome back</h2>
        <p className="mt-2 text-sm text-gray-600">
          You are signed in. Tools and reports will appear here as they are added.
        </p>
      </section>
    </main>
  );
}
