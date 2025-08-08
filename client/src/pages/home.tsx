import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Users,
  Ticket,
  Shield,
  Settings,
  MessageSquare,
  BarChart,
  Star,
  MapPin,
  Phone,
  Mail
} from "lucide-react";

export default function Home() {
  const services = [
    {
      icon: Users,
      title: "Identity Management",
      description: "Seamless Active Directory integration with single sign-on capabilities."
    },
    {
      icon: Ticket,
      title: "Support Ticketing",
      description: "Advanced Zammad-based ticketing system for customer and internal support."
    },
    {
      icon: Shield,
      title: "Security Monitoring",
      description: "Comprehensive security monitoring with Wazuh and fleet management."
    },
    {
      icon: Settings,
      title: "DevOps Tools",
      description: "Git hosting, container management, and CI/CD pipeline solutions."
    },
    {
      icon: MessageSquare,
      title: "Communication",
      description: "Enterprise email and collaboration platforms for seamless teamwork."
    },
    {
      icon: BarChart,
      title: "Network Monitoring",
      description: "Real-time network monitoring and performance optimization tools."
    }
  ];

  const features = [
    {
      title: "Enterprise Security",
      description: "Active Directory integration with role-based access control and advanced security protocols."
    },
    {
      title: "Advanced Ticketing",
      description: "Seamless Zammad integration for comprehensive customer support and internal ticket management."
    },
    {
      title: "Custom Solutions",
      description: "Tailored software solutions designed to meet your specific business requirements and workflows."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary to-secondary min-h-[600px]">
        {/* Decorative circles */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-white opacity-10 rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-white opacity-10 rounded-full"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-white opacity-5 rounded-full"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight">
                Innovative<br />
                <span className="text-accent">Software Solutions</span><br />
                for Modern<br />
                Business
              </h1>
              <p className="mt-6 text-xl text-white opacity-90 leading-relaxed">
                Empowering organizations with cutting-edge technology, seamless integrations, and enterprise-grade security solutions.
              </p>
              <div className="mt-8">
                <Button className="bg-white text-primary px-8 py-3 text-lg font-semibold hover:bg-gray-100">
                  Get Started
                </Button>
              </div>
            </div>
            
            <div className="flex justify-center lg:justify-end">
              <Card className="max-w-md w-full shadow-2xl bg-white">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="bg-gradient-to-r from-primary to-secondary h-2 rounded mb-4"></div>
                  <div className="space-y-3">
                    <div className="bg-gray-200 h-4 rounded w-3/4"></div>
                    <div className="bg-gray-200 h-4 rounded w-1/2"></div>
                    <div className="bg-gray-200 h-4 rounded w-5/6"></div>
                    <div className="bg-gray-200 h-4 rounded w-2/3"></div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose STAR Solutions?</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-16">
            We deliver enterprise-grade software solutions with seamless Active Directory integration, advanced ticketing systems, and role-based access control.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    <div className="w-4 h-4 bg-gradient-to-br from-primary to-secondary rounded-full"></div>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
            <p className="text-xl text-gray-600">Comprehensive software solutions for enterprise environments</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <Card key={index} className="transition-all duration-300 hover:shadow-lg border-0 shadow-sm">
                  <CardContent className="p-8">
                    <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{service.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Get in Touch</h2>
            <p className="text-xl text-gray-600">Ready to transform your business with our solutions? Contact us today.</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-8">Contact Information</h3>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-primary rounded flex items-center justify-center mr-4 mt-1">
                    <MapPin className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Our Office</h4>
                    <p className="text-gray-600">123 Tech Avenue</p>
                    <p className="text-gray-600">Suite 450</p>
                    <p className="text-gray-600">Vancouver, BC V6B 4Y8</p>
                    <p className="text-gray-600">Canada</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-primary rounded flex items-center justify-center mr-4 mt-1">
                    <Phone className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Phone</h4>
                    <p className="text-gray-600">+1 (604) 555-1234</p>
                    <p className="text-gray-600 text-sm">Monday - Friday, 9am - 5pm PST</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-primary rounded flex items-center justify-center mr-4 mt-1">
                    <Mail className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Email</h4>
                    <p className="text-gray-600">info@starsolutions.ca</p>
                    <p className="text-gray-600">support@starsolutions.ca</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Contact Form */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-8">Send Us a Message</h3>
              
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      placeholder="John Doe"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john.doe@example.com"
                      className="mt-1"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      placeholder="+1 (555) 123-4567"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="company">Company Name</Label>
                    <Input
                      id="company"
                      placeholder="Acme Inc."
                      className="mt-1"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    placeholder="General Inquiry"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    rows={4}
                    placeholder="Please tell us about your project or inquiry..."
                    className="mt-1"
                  />
                </div>
                
                <Button className="w-full bg-gradient-to-r from-primary to-secondary text-white py-3 text-lg font-semibold hover:from-primary-dark hover:to-secondary/90">
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Star className="h-6 w-6 text-primary mr-2" />
              <h3 className="text-xl font-bold">STAR Solutions</h3>
            </div>
            <p className="text-gray-400 mb-6">Creating innovative software solutions that drive business success.</p>
            
            <div className="flex justify-center space-x-6 mb-8">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <div className="w-8 h-8 bg-gray-700 rounded flex items-center justify-center">
                  <div className="w-4 h-4 bg-current rounded-sm"></div>
                </div>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <div className="w-8 h-8 bg-gray-700 rounded flex items-center justify-center">
                  <div className="w-4 h-4 bg-current rounded-sm"></div>
                </div>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <div className="w-8 h-8 bg-gray-700 rounded flex items-center justify-center">
                  <div className="w-4 h-4 bg-current rounded-sm"></div>
                </div>
              </a>
            </div>
            
            <p className="text-sm text-gray-500">© 2024 STAR Solutions. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
