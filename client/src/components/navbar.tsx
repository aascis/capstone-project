import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { LoginModal } from "@/components/ui/login-modal";
import { useAuth } from "@/hooks/use-auth";
import { Star, Menu, X } from "lucide-react";

export function Navbar() {
  const [location] = useLocation();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/services", label: "Services" },
    { href: "/contact", label: "Contact" },
  ];

  const handleLoginClick = () => {
    if (isAuthenticated) {
      if (user?.userType === "employee") {
        window.location.href = "/employee-dashboard";
      } else {
        window.location.href = "/customer-dashboard";
      }
    } else {
      setIsLoginModalOpen(true);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <>
      <nav className="bg-white shadow-md relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex-shrink-0 flex items-center cursor-pointer">
                <div className="h-8 w-8 bg-primary rounded flex items-center justify-center mr-2">
                  <Star className="h-5 w-5 text-white fill-current" />
                </div>
                <span className="text-xl font-bold text-primary">STAR Solutions</span>
              </Link>
              
              <div className="hidden sm:flex sm:space-x-8 sm:ml-10">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`${
                      location === link.href
                        ? "border-primary text-gray-900"
                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-700">
                    Welcome, {user?.fullName || user?.username}
                  </span>
                  <Button
                    variant="outline"
                    onClick={handleLogout}
                    className="text-sm"
                  >
                    Logout
                  </Button>
                  <Button
                    onClick={handleLoginClick}
                    className="bg-secondary text-white hover:bg-secondary/90"
                  >
                    Dashboard
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={handleLoginClick}
                  className="bg-secondary text-white hover:bg-secondary/90"
                >
                  Login
                </Button>
              )}
            </div>

            <div className="-mr-2 flex items-center sm:hidden">
              <Button
                variant="ghost"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="sm:hidden">
            <div className="pt-2 pb-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`${
                    location === link.href
                      ? "bg-primary-light border-primary text-white"
                      : "border-transparent text-gray-600 hover:bg-gray-50"
                  } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="pt-4 pb-3 border-t border-gray-200 px-3">
              {isAuthenticated ? (
                <div className="space-y-2">
                  <div className="text-sm text-gray-700 px-3">
                    Welcome, {user?.fullName || user?.username}
                  </div>
                  <Button
                    onClick={handleLoginClick}
                    className="w-full bg-secondary text-white"
                  >
                    Dashboard
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleLogout}
                    className="w-full"
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsLoginModalOpen(true);
                  }}
                  className="w-full bg-secondary text-white"
                >
                  Login
                </Button>
              )}
            </div>
          </div>
        )}
      </nav>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </>
  );
}
