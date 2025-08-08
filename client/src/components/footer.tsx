import { Star } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-800">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center">
              <div className="h-10 w-10 bg-white rounded flex items-center justify-center mr-3">
                <Star className="h-6 w-6 text-primary fill-current" />
              </div>
              <span className="text-2xl font-bold text-white">STAR Solutions</span>
            </div>
            <p className="mt-4 text-gray-300">
              Delivering premium software solutions since 2010.
            </p>
            <div className="mt-6 flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <i className="fab fa-linkedin-in"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <i className="fab fa-github"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Company</h3>
            <ul className="mt-4 space-y-4">
              <li><a href="#" className="text-base text-gray-300 hover:text-white">About</a></li>
              <li><a href="#" className="text-base text-gray-300 hover:text-white">Careers</a></li>
              <li><a href="#" className="text-base text-gray-300 hover:text-white">Blog</a></li>
              <li><a href="#" className="text-base text-gray-300 hover:text-white">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Services</h3>
            <ul className="mt-4 space-y-4">
              <li><a href="#" className="text-base text-gray-300 hover:text-white">Software Development</a></li>
              <li><a href="#" className="text-base text-gray-300 hover:text-white">Mobile Apps</a></li>
              <li><a href="#" className="text-base text-gray-300 hover:text-white">Cloud Solutions</a></li>
              <li><a href="#" className="text-base text-gray-300 hover:text-white">Consulting</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Legal</h3>
            <ul className="mt-4 space-y-4">
              <li><a href="#" className="text-base text-gray-300 hover:text-white">Privacy</a></li>
              <li><a href="#" className="text-base text-gray-300 hover:text-white">Terms</a></li>
              <li><a href="#" className="text-base text-gray-300 hover:text-white">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 border-t border-gray-700 pt-8">
          <p className="text-base text-gray-400 text-center">
            &copy; 2024 STAR Solutions. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
