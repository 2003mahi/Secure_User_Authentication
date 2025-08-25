import { Link, useLocation } from "wouter";
import { Shield } from "lucide-react";

interface NavigationProps {
  currentPage?: string;
}

export default function Navigation({ currentPage }: NavigationProps) {
  const [location] = useLocation();

  const navItems = [
    { path: "/", label: "Authentication", key: "auth" },
    { path: "/dashboard", label: "Dashboard", key: "dashboard" },
    { path: "/docs", label: "API Docs", key: "docs" },
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Shield className="text-primary text-2xl mr-3" />
            <h1 className="text-xl font-semibold text-gray-900">SecureAuth API</h1>
          </div>
          <div className="flex space-x-4">
            {navItems.map((item) => {
              const isActive = location === item.path;
              return (
                <Link
                  key={item.key}
                  href={item.path}
                  className={`px-4 py-2 text-sm font-medium ${
                    isActive
                      ? "text-primary border-b-2 border-primary"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                  data-testid={`nav-${item.key}`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
