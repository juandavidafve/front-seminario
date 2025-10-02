import { Outlet } from "react-router";

import Sidebar from "@/components/Sidebar";

export default function Layout() {
  return (
    <main className="mt-16 lg:mt-0 lg:ml-16">
      <Sidebar />
      <div className="flex min-h-screen flex-col bg-gray-50 p-6">
        <div className="mx-auto w-full max-w-4xl">
          <Outlet />
        </div>
      </div>
    </main>
  );
}
