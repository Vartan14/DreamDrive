import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { forgotPassword } from '@/utils/auth';
import { useAuthStore } from '@/store/authStore';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    const result = await forgotPassword(email);

    if (result.success) {
      setSuccessMsg('Інструкції для скидання пароля надіслано на вашу пошту.');
    } else {
      setErrorMsg(result.error || 'Виникла помилка. Спробуйте ще раз.');
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="py-32">
        <div className="container-custom max-w-md">
          <Card className="bg-secondary border-gray-700">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Відновлення пароля</CardTitle>
              <CardDescription className="text-gray-300">
                Введіть свою електронну пошту, щоб отримати посилання для скидання пароля
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
                    type="email"
                    placeholder="name@example.com"
                    className="bg-black border-gray-700 focus:border-lider-red"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </div>
                <Button className="w-full btn-primary" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Відправка...' : 'Відновити пароль'}
                </Button>
                {successMsg && (
                  <div className="text-green-500 text-center text-sm mt-2">{successMsg}</div>
                )}
                {errorMsg && (
                  <div className="text-red-500 text-center text-sm mt-2">{errorMsg}</div>
                )}
              </form>
            </CardContent>
            <CardFooter className="text-center">
              <p className="text-sm text-gray-400 w-full">
                Пам’ятаєте пароль?{' '}
                <Link to="/login" className="text-lider-red hover:underline">
                  Повернутися до входу
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

export default ForgotPassword;
