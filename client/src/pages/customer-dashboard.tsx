import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import {
  Star,
  Home,
  Ticket,
  CreditCard,
  User,
  Bell,
  LogOut,
  Plus,
  Clock,
  CheckCircle,
  AlertTriangle
} from "lucide-react";

export default function CustomerDashboard() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Zammad iframe URL for the customer portal
  const zammadUrl = `http://10.171.132.90:5432/user/login?email=${encodeURIComponent(user?.email || '')}`;

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b">
          <div className="flex items-center">
            <div className="h-8 w-8 bg-primary rounded flex items-center justify-center mr-2">
              <Star className="h-5 w-5 text-white fill-current" />
            </div>
            <span className="text-xl font-bold text-primary">STAR Solutions</span>
          </div>
          <p className="text-sm text-gray-500 mt-1">Customer Portal</p>
        </div>
        
        <nav className="mt-6">
          <Link
            href="/customer-dashboard"
            className="flex items-center px-6 py-3 text-primary bg-primary-light border-r-4 border-primary"
          >
            <Home className="h-5 w-5 mr-3" />
            Dashboard
          </Link>
          <a href="#" className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50">
            <Ticket className="h-5 w-5 mr-3" />
            Support Tickets
          </a>
          <a href="#" className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50">
            <CreditCard className="h-5 w-5 mr-3" />
            Billing
          </a>
          <a href="#" className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50">
            <User className="h-5 w-5 mr-3" />
            Profile
          </a>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between h-16 px-6">
            <h1 className="text-2xl font-bold text-gray-900">Customer Dashboard</h1>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-600">
                <Bell className="h-5 w-5" />
              </Button>
              <div className="flex items-center">
                <span className="mr-3 text-sm font-medium text-gray-700">
                  {user?.fullName || "Customer Portal"}
                </span>
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-white font-medium text-sm">
                    {user?.fullName?.[0] || "C"}
                  </span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="text-gray-500 hover:text-gray-700"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-6 border-b pb-5">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Customer Dashboard</h1>
              </div>
              <Button className="bg-primary text-white hover:bg-primary-dark">
                <Plus className="h-4 w-4 mr-2" />
                New Support Ticket
              </Button>
            </div>
          </div>

          {/* Subscription management removed - not needed for this website */}

          {/* Support Tickets Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Ticket className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Tickets</p>
                    <p className="text-2xl font-bold text-gray-900">24</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Clock className="h-4 w-4 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Pending</p>
                    <p className="text-2xl font-bold text-gray-900">3</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Resolved</p>
                    <p className="text-2xl font-bold text-gray-900">21</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">High Priority</p>
                    <p className="text-2xl font-bold text-gray-900">1</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Zammad Integration */}
          <Card>
            <CardHeader>
              <CardTitle>Support Tickets - Zammad Portal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full h-[600px] border rounded-lg overflow-hidden">
                <iframe
                  src={zammadUrl}
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  title="Zammad Support Portal"
                  className="w-full h-full"
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Direct access to your support tickets through our integrated Zammad portal.
              </p>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
