import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import PageLayout from '@/components/layout/PageLayout';
import { login as loginApi } from '@/utils/auth';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/components/ui/use-toast';
import { Eye, EyeOff } from 'lucide-react';


const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setUser = useAuthStore((state) => state.setUser);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast({
        title: "Помилка",
        description: "Будь ласка, заповніть всі поля",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setError(null);

    const result = await loginApi(formData.email, formData.password);

    if (result.data) {
      toast({
        title: "Успішний вхід",
        description: "Ви успішно увійшли до акаунта",
      });
      // setUser вже викликається у setAuthUser, але можна оновити стан вручну, якщо потрібно
      navigate('/dashboard');
    } else {
      setError(result.error || 'Виникла помилка');
      toast({
        title: "Вхід не виконано",
        description: result.error || 'Виникла помилка',
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  return (
    <PageLayout>
      <div className="py-20">
        <div className="container-custom max-w-md">
          <Card className="bg-secondary border-gray-800">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Вхід до акаунта</CardTitle>
              <CardDescription className="text-gray-300">
                Введіть свої дані для входу
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Електронна пошта
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="name@example.com"
                    className="bg-black border-gray-700 focus:border-lider-red"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isLoading}
                    autoComplete="email" 
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
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      className="bg-black border-gray-700 focus:border-lider-red pr-10"
                      value={formData.password}
                      onChange={handleChange}
                      disabled={isLoading}
                      autoComplete="current-password" 
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div className="pt-2">
                  <Button
                    className="w-full bg-lider-red hover:bg-red-700"
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Вхід...' : 'Увійти'}
                  </Button>
                </div>
                {error && (
                  <div className="text-red-500 text-sm text-center pt-2">{error}</div>
                )}
              </form>
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
      </div>
    </PageLayout>
  );
};

export default LoginPage;