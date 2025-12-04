import { Outlet } from "react-router";

import Sidebar from "@/components/Sidebar";

export default function Layout() {
  return (
    <main className="mt-16 lg:mt-0 lg:ml-16">
      <Sidebar />
      <div className="bg-gray-50">
        <div className="mx-auto min-h-[calc(100vh-var(--spacing)*16)] w-full max-w-7xl p-6 lg:min-h-screen">
          <Outlet />
        </div>
      </div>
    </main>
  );
}
