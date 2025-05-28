
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Youtube, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-secondary pt-16 pb-8 border-t border-gray-800">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Column 1 - About */}
          <div>
            <h3 className="text-xl font-bold mb-4">
              <span className="text-lider-red">DREAM</span> Drive School
            </h3>
            <p className="text-gray-300 mb-4">
              {/* We help you get your driver's license with confidence. Professional instruction, modern vehicles, and flexible schedules. */}
              Ми допоможемо вам отримати водійські права з упевненістю. Професійне навчання, сучасні автомобілі та гнучкий графік.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" className="text-gray-300 hover:text-lider-red transition-colors" title="Facebook">
                <Facebook size={20} />
              </a>
              <a href="https://instagram.com" className="text-gray-300 hover:text-lider-red transition-colors" title="Instagram">
                <Instagram size={20} />
              </a>
              <a href="https://youtube.com" className="text-gray-300 hover:text-lider-red transition-colors" title="YouTube">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Column 2 - Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/pricing" className="text-gray-300 hover:text-lider-red transition-colors">Pricing</Link>
              </li>
              <li>
                <Link to="/branches" className="text-gray-300 hover:text-lider-red transition-colors">Our Branches</Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-300 hover:text-lider-red transition-colors">FAQ</Link>
              </li>
              <li>
                <Link to="/reviews" className="text-gray-300 hover:text-lider-red transition-colors">Reviews</Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-lider-red transition-colors">About Us</Link>
              </li>
            </ul>
          </div>

          {/* Column 3 - License Categories */}
          <div>
            <h3 className="text-xl font-bold mb-4">License Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/pricing#a" className="text-gray-300 hover:text-lider-red transition-colors">Category A (Motorcycle)</Link>
              </li>
              <li>
                <Link to="/pricing#b" className="text-gray-300 hover:text-lider-red transition-colors">Category B (Car)</Link>
              </li>
              <li>
                <Link to="/pricing#c" className="text-gray-300 hover:text-lider-red transition-colors">Category C (Truck)</Link>
              </li>
              <li>
                <Link to="/pricing#d" className="text-gray-300 hover:text-lider-red transition-colors">Category D (Bus)</Link>
              </li>
            </ul>
          </div>

          {/* Column 4 - Contact */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2">
                <MapPin size={20} className="text-lider-red mt-1" />
                <span className="text-gray-300">Main Office: 123 Main Street, Kyiv, Ukraine</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-lider-red">☎</span>
                <a href="tel:+380123456789" className="text-gray-300 hover:text-lider-red transition-colors">
                  +38 (012) 345-6789
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-lider-red">✉</span>
                <a href="mailto:info@liderdriving.com" className="text-gray-300 hover:text-lider-red transition-colors">
                  info@liderdriving.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom - Copyright */}
        <div className="pt-8 border-t border-gray-800 text-center text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} LIDER Driving School. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
