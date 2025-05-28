import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { resetPassword } from '@/utils/auth';

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const navigate = useNavigate();
  const { uidb64, token } = useParams();

  const handleCreatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    if (confirmPassword !== password) {
      setErrorMsg("Паролі не співпадають");
      setIsLoading(false);
      return;
    }

    const result = await resetPassword(uidb64, token, password, confirmPassword);

    if (result.success) {
      setSuccessMsg("Пароль успішно змінено!");
      setTimeout(() => navigate("/login"), 2000);
    } else {
      setErrorMsg(result.error || "Не вдалося скинути пароль");
    }
    setIsLoading(false);
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
                Введіть новий пароль для вашого акаунта
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleCreatePassword}>
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium">
                    Новий пароль
                  </label>
                  <Input
                    id="password"
                    type="password"
                    className="bg-black border-gray-700 focus:border-lider-red"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-sm font-medium">
                    Підтвердіть новий пароль
                  </label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    className="bg-black border-gray-700 focus:border-lider-red"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                <Button className="w-full btn-primary" type="submit" disabled={isLoading}>
                  {isLoading ? "Збереження..." : "Змінити пароль"}
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
                Пам’ятаєте пароль?{" "}
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

export default ResetPassword;
