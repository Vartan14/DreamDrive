import {useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

import { login } from '../../utils/requests/auth';


const Login = () => {
  
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="py-32">
        <div className="container-custom max-w-md">
          <Card className="bg-secondary border-gray-700">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Вхід до акаунта</CardTitle>
              <CardDescription className="text-gray-300">Введіть свої дані для входу</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Електронна пошта
                  </label>
                  <Input 
                    id="email"
                    type="email" 
                    placeholder="name@example.com" 
                    className="bg-black border-gray-700 focus:border-lider-red" 
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="text-sm font-medium">
                      Пароль
                    </label>
                    <Link to="/forgot-password" className="text-sm text-lider-red hover:underline">
                      Забули пароль?
                    </Link>
                  </div>
                  <Input 
                    id="password"
                    type="password" 
                    className="bg-black border-gray-700 focus:border-lider-red" 
                  />
                </div>
                <Button className="w-full btn-primary" type="submit">
                  Увійти
                </Button>
              </form>
              
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-700"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-secondary px-2 text-gray-400">Або продовжити через</span>
                  </div>
                </div>
                
                <div className="mt-4">
                  <Button variant="outline" className="w-full bg-black/50 border border-gray-700 hover:bg-black">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="mr-2 h-4 w-4">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Google
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="text-center">
              <p className="text-sm text-gray-400 w-full">
                Не маєте акаунта?{" "}
                <Link to="/register" className="text-lider-red hover:underline">
                  Зареєструватися
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Login;