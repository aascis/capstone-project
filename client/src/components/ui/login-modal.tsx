import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { UserCog, User, X } from "lucide-react";

const employeeLoginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

const customerLoginSchema = z.object({
  email: z.string().email("Valid email is required"),
  password: z.string().min(1, "Password is required"),
});

type EmployeeLoginForm = z.infer<typeof employeeLoginSchema>;
type CustomerLoginForm = z.infer<typeof customerLoginSchema>;

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [activeTab, setActiveTab] = useState("employee");
  const { loginEmployee, loginCustomer, isLoggingIn } = useAuth();
  const { toast } = useToast();

  const employeeForm = useForm<EmployeeLoginForm>({
    resolver: zodResolver(employeeLoginSchema),
    defaultValues: { username: "", password: "" },
  });

  const customerForm = useForm<CustomerLoginForm>({
    resolver: zodResolver(customerLoginSchema),
    defaultValues: { email: "", password: "" },
  });

  const handleEmployeeLogin = async (data: EmployeeLoginForm) => {
    try {
      await loginEmployee(data);
      toast({
        title: "Login successful!",
        description: "Welcome to STAR Solutions Employee Dashboard.",
      });
      onClose();
      window.location.href = "/employee-dashboard";
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Invalid credentials",
        variant: "destructive",
      });
    }
  };

  const handleCustomerLogin = async (data: CustomerLoginForm) => {
    try {
      await loginCustomer(data);
      toast({
        title: "Login successful!",
        description: "Welcome to STAR Solutions Customer Portal.",
      });
      onClose();
      window.location.href = "/customer-dashboard";
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Invalid credentials",
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    employeeForm.reset();
    customerForm.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle>Login to STAR Solutions</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-gray-600">Access your account or register for a new one.</p>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="employee" className="flex items-center gap-2">
              <UserCog className="h-4 w-4" />
              Employee Login
            </TabsTrigger>
            <TabsTrigger value="customer" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Customer Login
            </TabsTrigger>
          </TabsList>

          <TabsContent value="employee" className="space-y-4">
            <form onSubmit={employeeForm.handleSubmit(handleEmployeeLogin)} className="space-y-4">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="Enter your AD username"
                  {...employeeForm.register("username")}
                />
                <div className="text-sm text-gray-500 mt-1">Active Directory</div>
                {employeeForm.formState.errors.username && (
                  <p className="text-sm text-destructive mt-1">
                    {employeeForm.formState.errors.username.message}
                  </p>
                )}
              </div>
              
              <div>
                <Label htmlFor="employee-password">Password</Label>
                <Input
                  id="employee-password"
                  type="password"
                  placeholder="Enter your password"
                  {...employeeForm.register("password")}
                />
                {employeeForm.formState.errors.password && (
                  <p className="text-sm text-destructive mt-1">
                    {employeeForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-3 font-medium text-white bg-gradient-to-r from-primary to-secondary hover:from-primary-dark hover:to-secondary/90"
              >
                {isLoggingIn ? "Logging in..." : "Login as Employee"}
              </Button>

              <div className="text-center">
                <a href="#" className="text-sm text-primary hover:underline">
                  Need help? Contact Support
                </a>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="customer" className="space-y-4">
            <form onSubmit={customerForm.handleSubmit(handleCustomerLogin)} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  {...customerForm.register("email")}
                />
                
                {customerForm.formState.errors.email && (
                  <p className="text-sm text-destructive mt-1">
                    {customerForm.formState.errors.email.message}
                  </p>
                )}
              </div>
              
              <div>
                <Label htmlFor="customer-password">Password</Label>
                <Input
                  id="customer-password"
                  type="password"
                  placeholder="Enter your password"
                  {...customerForm.register("password")}
                />
                {customerForm.formState.errors.password && (
                  <p className="text-sm text-destructive mt-1">
                    {customerForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="ml-2 text-sm text-gray-700">Remember me</span>
                </label>
                <a href="#" className="text-sm text-primary hover:underline">
                  Forgot password?
                </a>
              </div>

              <Button
                type="submit"
                disabled={isLoggingIn}
                className="w-full bg-primary text-white hover:bg-primary-dark"
              >
                {isLoggingIn ? "Signing in..." : "Sign In"}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => {
                  toast({
                    title: "Registration",
                    description: "Contact support to register a new customer account.",
                  });
                }}
              >
                Register Account
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
