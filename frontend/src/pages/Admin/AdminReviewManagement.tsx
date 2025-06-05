import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import PageLayout from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MessageSquare, 
  Search, 
  ThumbsUp, 
  ThumbsDown, 
  Edit, 
  Eye, 
  Trash2, 
  CheckCircle, 
  XCircle
} from 'lucide-react';

// Мок-дані відгуків
const mockReviews = [
  {
    id: 1,
    student: 'Емілі Джонсон',
    email: 'emily@example.com',
    rating: 5,
    date: '2023-06-09',
    comment: 'Чудові інструктори! Я склала іспит з першого разу завдяки їхнім детальним урокам.',
    published: true
  },
  {
    id: 2,
    student: 'Майкл Сміт',
    email: 'michael@example.com',
    rating: 4,
    date: '2023-06-08',
    comment: 'Гарні навчальні матеріали та привітний персонал. Рекомендую.',
    published: true
  },
  {
    id: 3,
    student: 'Софія Тернер',
    email: 'sophie@example.com',
    rating: 2,
    date: '2023-06-07',
    comment: 'Заняття були нормальні, але важко було записатися, іноді заняття скасовували в останній момент.',
    published: false
  },
  {
    id: 4,
    student: 'Давид Вілсон',
    email: 'david@example.com',
    rating: 5,
    date: '2023-06-06',
    comment: 'Інструктори терплячі та підтримують. Матеріали зрозумілі та доступні.',
    published: true
  },
  {
    id: 5,
    student: 'Лаура Мартінес',
    email: 'laura@example.com',
    rating: 1,
    date: '2023-06-05',
    comment: "Дуже розчарована. Інструктор постійно запізнювався і не цікавився моїм прогресом.",
    published: false
  },
  {
    id: 6,
    student: 'Олексій Браун',
    email: 'alex@example.com',
    rating: 4,
    date: '2023-06-04',
    comment: 'Теоретичні заняття чудові. Практичні можна організувати краще.',
    published: true
  },
  {
    id: 7,
    student: 'Джон Міллер',
    email: 'john@example.com',
    rating: 5,
    date: '2023-06-03',
    comment: 'Склав іспит на відмінно! Дякую DreamDrive!',
    published: true
  }
];

// Мок-дані FAQ
const mockFaqs = [
  {
    id: 1, 
    question: "Скільки часу потрібно, щоб отримати водійське посвідчення?",
    answer: "Тривалість навчання залежить від категорії та вашого темпу. Зазвичай на категорію B потрібно 1-3 місяці регулярних занять.",
    published: true
  },
  {
    id: 2, 
    question: "Які документи потрібні для початку навчання?",
    answer: "Потрібен дійсний паспорт, довідка про місце проживання та медична довідка про придатність до водіння. Для окремих категорій можуть бути додаткові вимоги.",
    published: true
  },
  {
    id: 3, 
    question: "Скільки потрібно пройти теоретичних і практичних занять?",
    answer: "Мінімум — 28 годин теорії та 29 годин практики для категорії B. Однак індивідуальні потреби можуть відрізнятися.",
    published: true
  },
  {
    id: 4, 
    question: "Чи можу я обрати інструктора?",
    answer: "Так, ви можете обрати інструктора за наявності вільних місць. Ми намагаємось враховувати всі побажання.",
    published: true
  },
  {
    id: 5, 
    question: "Що робити, якщо я не склав іспит?",
    answer: "Ви можете перескласти іспит через 2 тижні. Ми пропонуємо додаткові заняття для покращення результату.",
    published: false
  }
];

const AdminReviewManagement = () => {
  const  authState  = useAuthStore();  
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('reviews');
  
  // Перенаправлення, якщо не адміністратор
  React.useEffect(() => {
    if (!authState.isLoading && (!authState.user || authState.user.role !== 'admin')) {
      navigate('/login');
    }
  }, [authState.isLoading, authState.user, navigate]);

  // Фільтрація відгуків
  const filteredReviews = mockReviews.filter(review => 
    review.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.comment.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Фільтрація FAQ
  const filteredFaqs = mockFaqs.filter(faq => 
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (authState.isLoading) {
    return (
      <PageLayout>
        <div className="container-custom py-20 text-center">
          <h2 className="text-xl">Завантаження...</h2>
        </div>
      </PageLayout>
    );
  }

  // Відображення зірок рейтингу
  const RatingStars = ({ rating }: { rating: number }) => (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${i < rating ? 'text-yellow-500' : 'text-gray-600'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );

  return (
    <PageLayout>
      <div className="container-custom py-12">
        <Card className="bg-gradient-to-r from-secondary to-black border-gray-800 mb-8">
          <CardContent className="pt-6">
            <h1 className="text-3xl font-bold mb-2">
              Керування контентом
            </h1>
            <p className="text-gray-400">
              Керуйте відгуками та відповідями на часті питання
            </p>
          </CardContent>
        </Card>
        
        {/* Вкладки */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid grid-cols-2 w-full max-w-md mb-6">
            <TabsTrigger value="reviews" className="data-[state=active]:bg-lider-red">
              <MessageSquare className="mr-2 h-4 w-4" />
              Відгуки
            </TabsTrigger>
            <TabsTrigger value="faq" className="data-[state=active]:bg-lider-red">
              <MessageSquare className="mr-2 h-4 w-4" />
              FAQ
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="reviews">
            {/* Керування відгуками */}
            <Card className="bg-secondary border-gray-800">
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="flex items-center">
                      <MessageSquare size={18} className="mr-2 text-lider-red" />
                      Відгуки студентів
                    </CardTitle>
                    <CardDescription>
                      Керуйте та модеруйте відгуки студентів
                    </CardDescription>
                  </div>
                  <div className="relative w-full md:w-auto md:min-w-[300px]">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Пошук відгуків..."
                      className="pl-10 bg-gray-800 border-gray-700"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700">
                      <TableHead>Студент</TableHead>
                      <TableHead>Рейтинг</TableHead>
                      <TableHead>Відгук</TableHead>
                      <TableHead>Дата</TableHead>
                      <TableHead>Статус</TableHead>
                      <TableHead className="text-right">Дії</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReviews.map(review => (
                      <TableRow key={review.id} className="border-gray-700">
                        <TableCell>
                          <div>
                            <div className="font-medium">{review.student}</div>
                            <div className="text-xs text-gray-400">{review.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <RatingStars rating={review.rating} />
                        </TableCell>
                        <TableCell className="max-w-[250px] truncate">{review.comment}</TableCell>
                        <TableCell>{new Date(review.date).toLocaleDateString('uk-UA')}</TableCell>
                        <TableCell>
                          {review.published ? (
                            <Badge className="bg-green-600">Опубліковано</Badge>
                          ) : (
                            <Badge className="bg-yellow-600">Приховано</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-blue-400 hover:text-blue-300"
                          >
                            <Edit size={16} />
                          </Button>
                         
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                {filteredReviews.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-400">За вашим запитом відгуків не знайдено.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Статистика відгуків */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
              <Card className="bg-secondary border-gray-800">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Середній рейтинг</p>
                      <h3 className="text-3xl font-bold mt-1">4.3/5</h3>
                    </div>
                    <ThumbsUp size={24} className="text-lider-red" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-secondary border-gray-800">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Всього відгуків</p>
                      <h3 className="text-3xl font-bold mt-1">{mockReviews.length}</h3>
                    </div>
                    <MessageSquare size={24} className="text-lider-red" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-secondary border-gray-800">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Опубліковано</p>
                      <h3 className="text-3xl font-bold mt-1">
                        {mockReviews.filter(r => r.published).length}
                      </h3>
                    </div>
                    <CheckCircle size={24} className="text-lider-red" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-secondary border-gray-800">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Очікує модерації</p>
                      <h3 className="text-3xl font-bold mt-1">
                        {mockReviews.filter(r => !r.published).length}
                      </h3>
                    </div>
                    <XCircle size={24} className="text-lider-red" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="faq">
            {/* Керування FAQ */}
            <Card className="bg-secondary border-gray-800">
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="flex items-center">
                      <MessageSquare size={18} className="mr-2 text-lider-red" />
                      Часті питання
                    </CardTitle>
                    <CardDescription>
                      Керуйте та оновлюйте відповіді на часті питання
                    </CardDescription>
                  </div>
                  <div className="flex gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Пошук по FAQ..."
                        className="pl-10 bg-gray-800 border-gray-700"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <Button className="bg-lider-red hover:bg-red-700">
                      Додати нове FAQ
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700">
                      <TableHead>Питання</TableHead>
                      <TableHead>Відповідь</TableHead>
                      <TableHead>Статус</TableHead>
                      <TableHead className="text-right">Дії</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFaqs.map(faq => (
                      <TableRow key={faq.id} className="border-gray-700">
                        <TableCell className="font-medium max-w-[250px]">{faq.question}</TableCell>
                        <TableCell className="max-w-[350px] truncate">{faq.answer}</TableCell>
                        <TableCell>
                          {faq.published ? (
                            <Badge className="bg-green-600">Опубліковано</Badge>
                          ) : (
                            <Badge className="bg-yellow-600">Приховано</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-blue-400 hover:text-blue-300"
                          >
                            <Edit size={16} />
                          </Button>
                         
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                {filteredFaqs.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-400">За вашим запитом нічого не знайдено.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default AdminReviewManagement;
