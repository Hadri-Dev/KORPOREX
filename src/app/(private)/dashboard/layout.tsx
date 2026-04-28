import Sidebar from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/TopBar";

// Dashboard shell — left sidebar (lg+) + top bar + scrollable main.
// Auth is enforced by the middleware on /dashboard/* — no profile fetch here.
// Inherits the (private) root layout for <html>, <body>, fonts, robots noindex.

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <TopBar />
        <main className="flex-1 overflow-auto bg-gray-50 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
