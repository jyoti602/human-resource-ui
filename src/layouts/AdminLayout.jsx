import { Outlet } from "react-router-dom";
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import Footer from "../components/Footer";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">

      {/* Full Width Topbar */}
      <div className="sticky top-0 z-40">
        <Topbar onMenuToggle={toggleSidebar} />
      </div>

      {/* Sidebar + Content */}
      <div className="flex flex-1 relative">

        {/* Sidebar */}
        <Sidebar 
          role="admin" 
          isOpen={sidebarOpen} 
          onClose={closeSidebar} 
        />

        {/* Page Content */}
        <main className="flex-1 p-3 sm:p-4 lg:p-6 overflow-y-auto lg:ml-0">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>

      </div>

      {/* Full Width Footer */}
      <Footer />

    </div>
  );
}