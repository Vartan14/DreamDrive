import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, ChevronDown, User } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { logout } from '@/utils/requests/auth';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();


  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-black/90 backdrop-blur-sm shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="container-custom py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <span className="text-2xl font-bold">
            <span className="text-lider-red">DREAM</span> Drive
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-white hover:text-lider-red transition-colors whitespace-nowrap">Головна</Link>
          

          <Link to="/pricing" className="text-white hover:text-lider-red transition-colors whitespace-nowrap">Ціни</Link>
          <Link to="/branches" className="text-white hover:text-lider-red transition-colors whitespace-nowrap">Філії</Link>
          <Link to="/about" className="text-white hover:text-lider-red transition-colors whitespace-nowrap">Про нас</Link>
          <Link to="/reviews" className="text-white hover:text-lider-red transition-colors whitespace-nowrap">Відгуки</Link>
          <Link to="/faq" className="text-white hover:text-lider-red transition-colors whitespace-nowrap">Питання</Link>
          <Link to="/contact" className="text-white hover:text-lider-red transition-colors whitespace-nowrap">Контакти</Link>
          
          {!user ? (
            <Link to="/login">
              <Button className="btn-primary">Увійти</Button>
            </Link>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="rounded-full w-10 h-10 p-0 bg-gray-800">
                  {user.profilePicture ? (
                    <Avatar>
                      <AvatarImage src={user.profilePicture} alt={user.first_name} />
                      <AvatarFallback>{user.first_name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  ) : (
                    <User size={18} />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-black/95 border-gray-800 text-white" align="end">
                <div className="p-2 text-center border-b border-gray-800">
                  <p className="font-medium">{user.first_name} {user.last_name}</p>
                  <p className="text-xs text-gray-400">{user.email}</p>
                </div>
                <DropdownMenuItem asChild className="hover:bg-gray-800 focus:bg-gray-800">
                  <Link to="/dashboard">Панель керування</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="hover:bg-gray-800 focus:bg-gray-800">
                  <Link to="/profile">Налаштування профілю</Link>
                </DropdownMenuItem>
                
                {user.role === 'student' && user.is_paid === false  && (
                  <>
                    <DropdownMenuSeparator className="bg-gray-800" />

                    <DropdownMenuItem asChild className="hover:bg-gray-800 focus:bg-gray-800">
                      <Link to="/payments">Платежі</Link>
                    </DropdownMenuItem>
                  </>  
                )}    

                {user.role === 'student'&& user.is_paid === true  && (
                  <>
                    <DropdownMenuSeparator className="bg-gray-800" />
                    <DropdownMenuItem asChild className="hover:bg-gray-800 focus:bg-gray-800">
                      <Link to="/payments">Платежі</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="hover:bg-gray-800 focus:bg-gray-800">
                      <Link to="/schedule">Мої заняття</Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild className="hover:bg-gray-800 focus:bg-gray-800">
                      <Link to="/materials">Навчальні матеріали</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="hover:bg-gray-800 focus:bg-gray-800">
                      <Link to="/tests">Інтерактивні тести</Link>
                    </DropdownMenuItem>



                  </>
                )}
                
                {user.role === 'teacher' && (
                  <>
                    <DropdownMenuSeparator className="bg-gray-800" />
                    <DropdownMenuItem asChild className="hover:bg-gray-800 focus:bg-gray-800">
                      <Link to="/instructor/groups">Мої групи</Link>
                    </DropdownMenuItem>
                   
                    <DropdownMenuItem asChild className="hover:bg-gray-800 focus:bg-gray-800">
                      <Link to="/instructor/schedule">Управління розкладом</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="hover:bg-gray-800 focus:bg-gray-800">
                      <Link to="/materials">Навчальні матеріали</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="hover:bg-gray-800 focus:bg-gray-800">
                      <Link to="/instructor/tests">Управління тестами</Link>
                    </DropdownMenuItem>
                  </>
                )}
                
                {user.role === 'admin' && (
                  <>
                    <DropdownMenuSeparator className="bg-gray-800" />
                    <DropdownMenuItem asChild className="hover:bg-gray-800 focus:bg-gray-800">
                      <Link to="/admin/users">Управління користувачами</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="hover:bg-gray-800 focus:bg-gray-800">
                      <Link to="/admin/payments">Огляд платежів</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="hover:bg-gray-800 focus:bg-gray-800">
                      <Link to="/admin/schedule">Огляд розкладу</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="hover:bg-gray-800 focus:bg-gray-800">
                      <Link to="/admin/branches">Управління філіями</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="hover:bg-gray-800 focus:bg-gray-800">
                      <Link to="/materials">Управління матеріалами</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="hover:bg-gray-800 focus:bg-gray-800">
                      <Link to="/admin/reviews">Управління відгуками</Link>
                    </DropdownMenuItem>
                  </>
                )}
                
                <DropdownMenuSeparator className="bg-gray-800" />
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="text-red-500 hover:text-red-400 hover:bg-gray-800 focus:bg-gray-800 cursor-pointer"
                >
                  Вийти
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </nav>

        {/* Mobile Menu Trigger */}
        <div className="md:hidden flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu size={24} />
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-sm border-t border-gray-800 animate-fade-in">
          <div className="container-custom py-4 flex flex-col space-y-4">
            <Link to="/" className="text-white hover:text-lider-red transition-colors py-2">Головна</Link>
            
            {/* Mobile Pricing Links */}
           
            <Link to="/pricing" className="text-white hover:text-lider-red transition-colors py-2">Ціни</Link>
            <Link to="/branches" className="text-white hover:text-lider-red transition-colors py-2">Філії</Link>
            <Link to="/about" className="text-white hover:text-lider-red transition-colors py-2">Про нас</Link>
            <Link to="/reviews" className="text-white hover:text-lider-red transition-colors py-2">Відгуки</Link>
            <Link to="/faq" className="text-white hover:text-lider-red transition-colors py-2">Питання</Link>
            <Link to="/contact" className="text-white hover:text-lider-red transition-colors py-2">Контакти</Link>
            
            {!user ? (
              <Link to="/login">
                <Button className="btn-primary w-full">Увійти</Button>
              </Link>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center space-x-3 p-2 bg-gray-800/50 rounded-lg">
                  {user.profilePicture ? (
                    <Avatar>
                      <AvatarImage src={user.profilePicture} alt={user.first_name} />
                      <AvatarFallback>{user.first_name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                      <User size={18} />
                    </div>
                  )}
                  <div>
                    <p className="font-medium">{user.first_name}</p>
                    <p className="text-xs text-gray-400">{user.email}</p>
                  </div>
                </div>
                
                <Link to="/dashboard" className="block py-2 px-3 hover:bg-gray-800 rounded">
                  Панель керування
                </Link>
                <Link to="/profile" className="block py-2 px-3 hover:bg-gray-800 rounded">
                  Налаштування профілю
                </Link>
                
                {user.role === 'student' && user.is_paid === false && (
                  <>
                    <hr className="border-gray-800 my-2" />
                    <Link to="/payments" className="block py-2 px-3 hover:bg-gray-800 rounded">
                      Платежі
                    </Link>
                  </>
                )}    

                {user.role === 'student' &&   user.is_paid === true && (
                  <>
                    <hr className="border-gray-800 my-2" />
                    <Link to="/materials" className="block py-2 px-3 hover:bg-gray-800 rounded">
                      Навчальні матеріали
                    </Link>
                    <Link to="/tests" className="block py-2 px-3 hover:bg-gray-800 rounded">
                      Інтерактивні тести
                    </Link>
                    <Link to="/payments" className="block py-2 px-3 hover:bg-gray-800 rounded">
                      Платежі
                    </Link>
                    <Link to="/schedule" className="block py-2 px-3 hover:bg-gray-800 rounded">
                      Розклад
                    </Link>
                    <Link to="/lessons" className="block py-2 px-3 hover:bg-gray-800 rounded">
                      Забронювати уроки
                    </Link>
                  </>
                )}
                
                {user.role === 'teacher' && (
                  <>
                    <hr className="border-gray-800 my-2" />
                    <Link to="/schedule" className="block py-2 px-3 hover:bg-gray-800 rounded">
                      Управління розкладом
                    </Link>
                    <Link to="/instructor/groups" className="block py-2 px-3 hover:bg-gray-800 rounded">
                      Групи студентів
                    </Link>
                    <Link to="/instructor/materials" className="block py-2 px-3 hover:bg-gray-800 rounded">
                      Навчальні матеріали
                    </Link>
                    <Link to="/instructor/tests" className="block py-2 px-3 hover:bg-gray-800 rounded">
                      Управління тестами
                    </Link>
                    <Link to="/lessons" className="block py-2 px-3 hover:bg-gray-800 rounded">
                      Керування уроками
                    </Link>
                  </>
                )}
                
                {user.role === 'admin' && (
                  <>
                    <Link to="/admin/payments" className="block py-2 px-3 hover:bg-gray-800 rounded">
                      Огляд платежів
                    </Link>
                    <Link to="/admin/schedule" className="block py-2 px-3 hover:bg-gray-800 rounded">
                      Управління розкладом
                    </Link>
                    <hr className="border-gray-800 my-2" />
                    <Link to="/admin/users" className="block py-2 px-3 hover:bg-gray-800 rounded">
                      Управління користувачами
                    </Link>
                    <Link to="/materials" className="block py-2 px-3 hover:bg-gray-800 rounded">
                      Управління матеріалами
                    </Link>                   
                    <Link to="/admin/branches" className="block py-2 px-3 hover:bg-gray-800 rounded">
                      Управління філіями
                    </Link>
                    <Link to="/admin/reviews" className="block py-2 px-3 hover:bg-gray-800 rounded">
                      Управління відгуками
                    </Link>
                  </>
                )}
                
                <hr className="border-gray-800 my-2" />
                <button 
                  onClick={handleLogout}
                  className="w-full text-left py-2 px-3 text-red-500 hover:bg-gray-800 rounded"
                >
                  Вийти
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
