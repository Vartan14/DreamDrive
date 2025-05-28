import React, { useState } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import PageHeader from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Camera, Save, UserCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuthStore } from '@/store/authStore';

const Profile = () => {
  const { toast } = useToast();
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser)

  const [formData, setFormData] = useState({
    name: user?.first_name || '',
    bio: user?.last_name || '',
    trainingType: user?.role === 'instructor' ? (user.profile.trainingType || 'Practice') : 'Practice' as 'Theory' | 'Practice',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [isEditing, setIsEditing] = useState(false);

  if (!user) {
    return (
      <PageLayout>
        <div className="container-custom py-20 text-center">
          <h2 className="text-2xl font-bold mb-4">Увійдіть, щоб переглянути свій профіль</h2>
        </div>
      </PageLayout>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    if (name === 'trainingType') {
      setFormData(prev => ({ 
        ...prev, 
        [name]: value as 'Theory' | 'Practice' 
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = () => {
    if (formData.newPassword) {
      if (formData.newPassword !== formData.confirmPassword) {
        toast({
          title: "Помилка",
          description: "Нові паролі не співпадають",
          variant: "destructive"
        });
        return;
      }
      
      if (formData.currentPassword !== '123456') { // Демонстраційна перевірка пароля
        toast({
          title: "Помилка",
          description: "Поточний пароль невірний",
          variant: "destructive"
        });
        return;
      }
    }

    if (user?.role === 'instructor') {
      updateUser({
        first_name: formData.name,
        profile: {
          ...user.profile,
          trainingType: formData.trainingType as 'Theory' | 'Practice'
        }
      });
    } else {
      updateUser({
        first_name: formData.name,
      });
    }
    
    toast({
      title: "Профіль оновлено",
      description: "Ваш профіль успішно оновлено"
    });
    
    setIsEditing(false);
  };
  
  const handleUploadClick = () => {
    toast({
      description: "Тут буде реалізовано завантаження фото профілю"
    });
  };

  return (
    <PageLayout>
      <PageHeader 
        title="Ваш профіль" 
        subtitle="Переглядайте та керуйте своєю особистою інформацією"
      />
      
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Ліва колонка - Фото профілю */}
          <div className="md:col-span-1">
            <Card className="bg-secondary border-gray-800">
              <CardContent className="pt-6 flex flex-col items-center">
                <div className="relative mb-4">
                 <div className="w-40 h-40 rounded-full bg-gray-800 flex items-center justify-center border-2 border-lider-red">
                   <UserCircle size={80} className="text-gray-400" />
                  </div>
                  
                  <button 
                    className="absolute bottom-2 right-2 bg-lider-red rounded-full p-2 hover:bg-red-700 transition-colors"
                    onClick={handleUploadClick}
                  >
                    <Camera size={20} />
                  </button>
                </div>

                <div className="text-center mt-4">
                  <h2 className="text-xl font-bold">{user.first_name}</h2>
                  <p className="text-gray-400 mb-2">{user.email}</p>
                  <div className="inline-block bg-gray-800 px-3 py-1 rounded-full text-sm text-lider-red font-medium capitalize">
                    {user.role === 'instructor' ? 'Інструктор' : user.role === 'student' ? 'Студент' : user.role}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Права колонка - Інформація профілю */}
          <div className="md:col-span-2">
            <Card className="bg-secondary border-gray-800">
              <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Особиста інформація</h2>
                  {!isEditing && (
                    <Button 
                      variant="outline" 
                      onClick={() => setIsEditing(true)}
                      className="border-lider-red text-lider-red hover:bg-lider-red/10"
                    >
                      Редагувати профіль
                    </Button>
                  )}
                </div>

                <div className="space-y-6">
                  <div>
                    <Label htmlFor="name">ПІБ</Label>
                    <Input 
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="bg-black border-gray-700 focus:border-lider-red mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email"
                      value={user.email}
                      disabled
                      className="bg-black border-gray-700 mt-2"
                    />
                    <p className="text-xs text-gray-400 mt-1">Email не можна змінити</p>
                  </div>

                  {/* Тип навчання для інструкторів */}
                  {user.role === 'instructor' && (
                    <div>
                      <Label htmlFor="trainingType">Тип навчання</Label>
                      {isEditing ? (
                        <Select
                          value={formData.trainingType}
                          onValueChange={(value) => handleSelectChange('trainingType', value)}
                          disabled={!isEditing}
                        >
                          <SelectTrigger 
                            id="trainingType" 
                            className="bg-black border-gray-700 focus:border-lider-red mt-2"
                          >
                            <SelectValue placeholder="Оберіть тип навчання" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-700">
                            <SelectItem value="Theory">Теорія</SelectItem>
                            <SelectItem value="Practice">Практика</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input 
                          id="trainingType"
                          value={formData.trainingType === 'Theory' ? 'Теорія' : 'Практика'}
                          disabled
                          className="bg-black border-gray-700 mt-2"
                        />
                      )}
                    </div>
                  )}

                  <div>
                    <Label htmlFor="bio">Про себе</Label>
                    <Input
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="bg-black border-gray-700 focus:border-lider-red mt-2 h-24"
                    />
                  </div>

                  {isEditing && (
                    <div className="space-y-4 border-t border-gray-700 pt-4 mt-6">
                      <h3 className="font-semibold mb-2">Змінити пароль</h3>
                      <div>
                        <Label htmlFor="currentPassword">Поточний пароль</Label>
                        <Input 
                          id="currentPassword"
                          name="currentPassword"
                          type="password"
                          value={formData.currentPassword}
                          onChange={handleChange}
                          className="bg-black border-gray-700 focus:border-lider-red mt-2"
                        />
                      </div>

                      <div>
                        <Label htmlFor="newPassword">Новий пароль</Label>
                        <Input 
                          id="newPassword"
                          name="newPassword"
                          type="password"
                          value={formData.newPassword}
                          onChange={handleChange}
                          className="bg-black border-gray-700 focus:border-lider-red mt-2"
                        />
                      </div>

                      <div>
                        <Label htmlFor="confirmPassword">Підтвердіть новий пароль</Label>
                        <Input 
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className="bg-black border-gray-700 focus:border-lider-red mt-2"
                        />
                      </div>
                    </div>
                  )}

                  {isEditing && (
                    <div className="flex justify-end space-x-4 mt-6">
                      <Button 
                        variant="outline" 
                        onClick={() => setIsEditing(false)}
                      >
                        Скасувати
                      </Button>
                      <Button 
                        onClick={handleSave} 
                        className="bg-lider-red hover:bg-red-700"
                      >
                        <Save size={16} className="mr-2" />
                        Зберегти зміни
                      </Button>
                    </div>
                  )}

                  {user.role === 'student' && (
                    <div className="border-t border-gray-700 pt-6 mt-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold">Статус підписки</h3>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${user.is_paid ? 'bg-green-900/30 text-green-400' : 'bg-yellow-900/30 text-yellow-400'}`}>
                          {user.is_paid ? 'Активна' : 'Неактивна'}
                        </span>
                      </div>
                      {!user.is_paid && (
                        <Button 
                          className="w-full bg-lider-red hover:bg-red-700"
                          onClick={() => {
                            toast({
                              title: "Оплата",
                              description: "Тут буде реалізовано функціонал оплати"
                            });
                          }}
                        >
                          Оформити підписку
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Profile;
