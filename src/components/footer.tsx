import { Link } from 'react-router-dom';
import '../index.css';
import { Clock, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-gradient-to-br from-background to-muted/20">
      <div className="container py-12 md:py-16">

        {/* Centered Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto text-center md:text-left">

          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2 justify-center md:justify-start">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-purple-600">
                <Clock className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold gradient-text">DigiQueue</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Skip the line, save your time. The smart way to book service slots online.
            </p>
           <div className="flex justify-center md:justify-start space-x-4">
  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 hover:bg-purple-200 transition-colors cursor-pointer">
    <Facebook className="h-5 w-5 text-purple-600" />
  </div>
  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 hover:bg-purple-200 transition-colors cursor-pointer">
    <Twitter className="h-5 w-5 text-purple-600" />
  </div>
  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 hover:bg-purple-200 transition-colors cursor-pointer">
    <Instagram className="h-5 w-5 text-purple-600" />
  </div>
  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 hover:bg-purple-200 transition-colors cursor-pointer">
    <Linkedin className="h-5 w-5 text-purple-600" />
  </div>
</div>

          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">About</Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Services</h3>
            <ul className="space-y-2 text-sm">
              <li><span className="text-muted-foreground">Temple Visits</span></li>
              <li><span className="text-muted-foreground">Hospital Appointments</span></li>
              <li><span className="text-muted-foreground">Salon Services</span></li>
              <li><span className="text-muted-foreground">Government Offices</span></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center justify-center md:justify-start space-x-2">
                <Mail className="h-4 w-4 text-purple-500" />
                <span className="text-muted-foreground">support@digiqueue.com</span>
              </li>
              <li className="flex items-center justify-center md:justify-start space-x-2">
                <Phone className="h-4 w-4 text-purple-500" />
                <span className="text-muted-foreground">+91 1234567890</span>
              </li>
              <li className="flex items-center justify-center md:justify-start space-x-2">
                <MapPin className="h-4 w-4 text-purple-500" />
                <span className="text-muted-foreground">India</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright */}
       <div className="w-full mt-12"></div>
  <div className="border-t border-gray-900 w-screen" />
  <div className="container pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 DigiQueue. All rights reserved. | Privacy Policy | Terms of Service</p>
        </div>
      </div>
    </footer>
  );
}
