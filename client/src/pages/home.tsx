import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Code,
  Smartphone,
  Cloud,
  Database,
  Settings,
  Shield,
  Star
} from "lucide-react";

export default function Home() {
  const services = [
    {
      icon: Code,
      title: "Software Development",
      description: "Custom software solutions tailored to your business needs with modern technologies."
    },
    {
      icon: Smartphone,
      title: "Mobile Applications",
      description: "Native and cross-platform mobile apps that deliver exceptional user experiences."
    },
    {
      icon: Cloud,
      title: "Cloud Solutions",
      description: "Scalable cloud infrastructure and migration services for enterprise growth."
    },
    {
      icon: Database,
      title: "Database Management",
      description: "Robust database design and optimization for maximum performance and security."
    },
    {
      icon: Settings,
      title: "System Integration",
      description: "Seamless integration between existing systems and new technologies."
    },
    {
      icon: Shield,
      title: "Security Solutions",
      description: "Enterprise-grade security measures to protect your valuable data and assets."
    }
  ];

  const testimonials = [
    {
      name: "John Smith",
      role: "CEO, Tech Corp",
      initials: "JS",
      content: "STAR Solutions transformed our business operations with their innovative software solutions. Highly recommended!"
    },
    {
      name: "Maria Davis",
      role: "CTO, Innovation Inc",
      initials: "MD",
      content: "Outstanding support and cutting-edge technology. Our productivity has increased significantly."
    },
    {
      name: "Robert Johnson",
      role: "Director, Global Systems",
      initials: "RJ",
      content: "Professional, reliable, and innovative. STAR Solutions exceeded our expectations."
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
              <Button className="mt-8 bg-white text-primary px-8 py-3 text-lg font-semibold hover:bg-gray-100">
                Get Started
              </Button>
            </div>
            
            <div className="flex justify-center lg:justify-end">
              <Card className="max-w-md w-full shadow-2xl">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="bg-secondary h-2 rounded mb-4"></div>
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
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We deliver enterprise-grade software solutions with seamless Active Directory integration, advanced ticketing systems, and role-based access control.
          </p>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
            <p className="text-xl text-gray-600">Comprehensive software solutions for modern enterprises</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <Card key={index} className="transition-all duration-300 hover:shadow-lg">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
                    <p className="text-gray-600">{service.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Clients Say</h2>
            <p className="text-xl text-gray-600">Trusted by organizations worldwide</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-gray-50">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="text-accent flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 italic mb-4">"{testimonial.content}"</p>
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                      <span className="text-gray-600 font-bold text-sm">{testimonial.initials}</span>
                    </div>
                    <div className="ml-3">
                      <h4 className="text-sm font-bold text-gray-900">{testimonial.name}</h4>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
