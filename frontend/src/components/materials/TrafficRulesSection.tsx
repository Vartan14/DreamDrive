import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { fetchRuleSections, fetchRules } from '@/utils/materials';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';
import { Send, Download, Edit, Trash2 } from 'lucide-react';
import { UserData } from '@/types/user';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

// Mock data for sign groups
const mockSignGroups = [
  {
    "group": "Попереджувальні знаки",
    "signs": ["1.1", "1.2"]
  },
  {
    "group": "Знаки пріоритету",
    "signs": ["2.1", "2.2"]
  }
];

// Mock data for signs
const mockSigns = [
  {
    "sign_group": "Попереджувальні знаки",
    "sign_code": "1.1",
    "sign_name": "Небезпечний поворот праворуч",
    "sign_text": "1.1 Знак попереджає про заокруглення дороги радіусом менше 500 м поза населеними пунктами і менше 150 м — у населених пунктах або про заокруглення з обмеженою оглядовістю.\nПопереджувальний знак установлюється поза населеними пунктами на відстані 150–300 м, у населених пунктах — на відстані 50–100 м до початку небезпечної ділянки. У разі потреби знак встановлюється і на іншій відстані, яка зазначається на табличці 7.1.1.",
    "img_url": "https://web.testpdr.com/storage/road-signs/original/RSS_1_1.png"
  },
  {
    "sign_group": "Попереджувальні знаки",
    "sign_code": "1.2",
    "sign_name": "Небезпечний поворот ліворуч",
    "sign_text": "1.2 Знак попереджає про заокруглення дороги радіусом менше 500 м поза населеними пунктами і менше 150 м — у населених пунктах або про заокруглення з обмеженою оглядовістю.\nПопереджувальний знак установлюється поза населеними пунктами на відстані 150–300 м, у населених пунктах — на відстан 50–100 м до початку небезпечної ділянки. У разі потреби знак встановлюється і на іншій відстані, яка зазначається на табличці 7.1.1.",
    "img_url": "https://web.testpdr.com/storage/road-signs/original/RSS_1_2.png"
  },
  {
    "sign_group": "Знаки пріоритету",
    "sign_code": "2.1",
    "sign_name": "Дати дорогу",
    "sign_text": "2.1 «Дати дорогу». Водій повинен дати дорогу транспортним засобам, що під'їжджають до нерегульованого перехрестя по головній дорозі, а за наявності таблички 7.8 — транспортним засобам, що рухаються по головній дорозі.",
    "img_url": "https://web.testpdr.com/storage/road-signs/original/RSS_2_1.png"
  },
  {
    "sign_group": "Знаки пріоритету",
    "sign_code": "2.2",
    "sign_name": "Проїзд без зупинки заборонено",
    "sign_text": "2.2 «Проїзд без зупинки заборонено». Забороняється проїзд без зупинки перед розміткою 1.12 (стоп-лінія), а якщо вона відсутня — перед знаком. Необхідно дати дорогу транспортним засобам, що рухаються дорогою, яка перетинається, а за наявності таблички 7.8 — транспортним засобам, що рухаються головною дорогою, а також праворуч рівнозначною.",
    "img_url": "https://web.testpdr.com/storage/road-signs/original/RSS_2_2.png"
  }
];

// Mock comments data structure
interface Comment {
  id: string;
  ruleId: string;
  text: string;
  author: {
    id: string;
    name: string;
    role: string;
  };
  timestamp: string;
}

const mockComments: Comment[] = [
  {
    id: "1",
    ruleId: "1.1",
    text: "Важливо пам'ятати, що ці правила застосовуються до всіх ситуацій на дорозі.",
    author: {
      id: "1",
      name: "Іван Петренко",
      role: "student"
    },
    timestamp: "2025-05-10T14:22:00Z"
  },
  {
    id: "2",
    ruleId: "2.1",
    text: "Завжди майте при собі всі необхідні документи, коли сідаєте за кермо.",
    author: {
      id: "3",
      name: "Олександр Іваненко",
      role: "instructor"
    },
    timestamp: "2025-05-11T10:15:00Z"
  },
  {
    id: "3",
    ruleId: "1.2",
    text: "Правосторонній рух - одне з базових правил, яке завжди потрібно пам'ятати.",
    author: {
      id: "4",
      name: "Марія Ковальчук",
      role: "instructor"
    },
    timestamp: "2025-05-11T15:30:00Z"
  },
  {
    id: "4",
    ruleId: "2.2",
    text: "Цей пункт особливо важливий для початківців. Переконайтеся, що ви розумієте коли і кому можна передавати керування.",
    author: {
      id: "5",
      name: "Андрій Шевченко",
      role: "admin"
    },
    timestamp: "2025-05-12T09:45:00Z"
  }
];

interface CommentSectionProps {
  ruleId: string;
  comments: Comment[];
  user: UserData | null;
  onAddComment: (ruleId: string, text: string) => void;
  onDeleteComment?: (commentId: string) => void;
}

const CommentSection: React.FC<CommentSectionProps> = ({ 
  ruleId, 
  comments, 
  user, 
  onAddComment,
  onDeleteComment
}) => {
  const [comment, setComment] = useState('');
  const filteredComments = comments.filter(c => c.ruleId === ruleId);
  
  const handleAddComment = () => {
    if (comment.trim()) {
      onAddComment(ruleId, comment);
      setComment('');
    }
  };

  const isAdmin = user?.role === 'admin';

  return (
    <div className="mt-4 border-t border-gray-700 pt-4">
      <h4 className="text-sm font-semibold text-gray-300 mb-2">Коментарі</h4>
      
      {filteredComments.length > 0 ? (
        <div className="space-y-3 mb-4">
          {filteredComments.map((comment) => (
            <div key={comment.id} className="bg-gray-800 rounded-md p-3 relative">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="text-sm font-medium">{comment.author.name}</span>
                  <Badge className="ml-2 bg-gray-600">{
                    comment.author.role === 'student' ? 'Студент' : 
                    comment.author.role === 'instructor' ? 'Інструктор' : 'Адмін'
                  }</Badge>
                </div>
                <span className="text-xs text-gray-400 pr-8">
                  {new Date(comment.timestamp).toLocaleString('uk-UA')}
                </span>
              </div>
              <p className="text-sm text-gray-300">{comment.text}</p>
              
              {isAdmin && onDeleteComment && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="absolute bottom-2 right-2 h-6 w-6 p-0 text-red-400 hover:text-red-300"
                  onClick={() => onDeleteComment(comment.id)}
                >
                  <Trash2 size={14} />
                </Button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-sm text-gray-400 mb-4">Ще немає коментарів</div>
      )}
      
      {user && (
        <div className="flex gap-2">
          <Input 
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Додати коментар..."
            className="flex-1 bg-secondary border-gray-700"
          />
          <Button 
            onClick={handleAddComment} 
            className="bg-lider-red hover:bg-red-700"
          >
            <Send size={16} />
          </Button>
        </div>
      )}
    </div>
  );
};

interface RuleCardProps {
  rule: {
    sectio?: string;
    rule_id: string;
    text: string;
  };
  comments: Comment[];
  user: UserData | null;
  onAddComment: (ruleId: string, text: string) => void;
  onDeleteComment?: (commentId: string) => void;
  onEditRule?: (ruleId: string) => void;
  onDeleteRule?: (ruleId: string) => void;
}

const RuleCard: React.FC<RuleCardProps> = ({ 
  rule, 
  comments, 
  user, 
  onAddComment, 
  onDeleteComment,
  onEditRule,
  onDeleteRule
}) => {
  const isAdmin = user?.role === 'admin';
  
  return (
    <Card className="bg-secondary border-gray-800 mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          {/* <CardTitle className="text-lg flex items-center">
            <span className="text-lider-red mr-2">{rule.rule_id}</span>
            {rule.text.substring(10) && <span></span>}
          </CardTitle> */}
          
          {isAdmin && (
            <div className="flex gap-2">
              {onEditRule && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 text-green-400 hover:text-green-300"
                  onClick={() => onEditRule(rule.rule_id)}
                >
                  <Edit size={16} />
                </Button>
              )}
              
              {onDeleteRule && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 text-red-400 hover:text-red-300"
                  onClick={() => onDeleteRule(rule.rule_id)}
                >
                  <Trash2 size={16} />
                </Button>
              )}
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="flex items-start gap-2">
          <span className="text-lider-red">{rule.rule_id}</span>
          <p className="text-gray-300 whitespace-pre-line m-0">{rule.text}</p>
        </div>
       
        <CommentSection 
          ruleId={rule.rule_id} 
          comments={comments} 
          user={user} 
          onAddComment={onAddComment} 
          onDeleteComment={onDeleteComment}
        />

      </CardContent>
    </Card>
  );
};

interface SectionRulesProps {
  sectionNumber: string;
  rules: any[];
  comments: Comment[];
  user: UserData | null;
  onAddComment: (ruleId: string, text: string) => void;
  onDeleteComment?: (commentId: string) => void;
  onEditRule?: (ruleId: string) => void;
  onDeleteRule?: (ruleId: string) => void;
}

const SectionRules: React.FC<SectionRulesProps> = ({ 
  sectionNumber, 
  rules,
  comments,
  user,
  onAddComment,
  onDeleteComment,
  onEditRule,
  onDeleteRule
}) => {
  const filteredRules = rules.filter(rule => rule.rule_id.split('.')[0] === String(sectionNumber));
  console.log("Filtered rules for section", sectionNumber, filteredRules);

  return (
    <div className="space-y-4">
      {filteredRules.map((rule) => (
        <RuleCard 
          key={rule.rule_id} 
          rule={rule} 
          comments={comments}
          user={user}
          onAddComment={onAddComment}
          onDeleteComment={onDeleteComment}
          onEditRule={onEditRule}
          onDeleteRule={onDeleteRule}
        />
      ))}
    </div>
  );
};

interface SignSectionProps {
  group: string;
  signs: any[];
  comments: Comment[];
  user: UserData| null;
  onAddComment: (ruleId: string, text: string) => void;
  onDeleteComment?: (commentId: string) => void;
  onEditRule?: (ruleId: string) => void;
  onDeleteRule?: (ruleId: string) => void;
}

const SignSection: React.FC<SignSectionProps> = ({ 
  group, 
  signs,
  comments,
  user,
  onAddComment,
  onDeleteComment,
  onEditRule,
  onDeleteRule
}) => {
  const filteredSigns = signs.filter(sign => sign.sign_group === group);
  
  return (
    <div className="space-y-4">
      {filteredSigns.map((sign) => (
        <RuleCard 
          key={sign.sign_code} 
          rule={{
            rule_id: sign.sign_code,
            text: sign.sign_text
          }} 
          comments={comments}
          user={user}
          onAddComment={onAddComment}
          onDeleteComment={onDeleteComment}
          onEditRule={onEditRule}
          onDeleteRule={onDeleteRule}
        />
      ))}
    </div>
  );
};

const TrafficRulesSection: React.FC = () => {
  const authState = useAuthStore();
  const navigate = useNavigate();
  const { sectionNumber } = useParams<{ sectionNumber?: string }>();
  const [comments, setComments] = useState<Comment[]>([]);
  const [sections, setSections] = useState<any[]>([]);
  const [rules, setRules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [sectionsData, rulesData] = await Promise.all([
          fetchRuleSections(),
          fetchRules()
        ]);
        setSections(sectionsData);
        setRules(rulesData);
      } catch (error) {
        toast({
          title: "Помилка",
          description: "Не вдалося завантажити правила або секції ПДР"
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Визначаємо поточну секцію
  const currentSectionNumber = sectionNumber || (sections.length > 0 ? String(sections[0].number) : '1');
  const currentSectionIdx = sections.findIndex(s => String(s.number) === String(currentSectionNumber));
  const currentSection = sections[currentSectionIdx];

  // Для пагінації сусідніх секцій
  const getNeighborSections = () => {
    if (sections.length === 0) return [];
    const idx = currentSectionIdx;
    const start = Math.max(0, idx - 2);
    const end = Math.min(sections.length, idx + 3);
    return sections.slice(start, end);
  };

  const handleAddComment = (ruleId: string, text: string) => {
    if (!authState.user) return;
    const newComment: Comment = {
      id: Date.now().toString(),
      ruleId,
      text,
      author: {
        id: authState.user.user_id,
        name: authState.user.first_name,
        role: authState.user.role
      },
      timestamp: new Date().toISOString()
    };
    setComments(prev => [...prev, newComment]);
    toast({
      title: "Коментар додано",
      description: "Ваш коментар було успішно додано"
    });
  };

  const handleDeleteComment = (commentId: string) => {
    setComments(prev => prev.filter(comment => comment.id !== commentId));
    toast({
      title: "Коментар видалено",
      description: "Коментар було успішно видалено"
    });
  };
  
  const handleEditRule = (ruleId: string) => {
    // In a real app, this would open an edit modal or redirect to an edit page
    toast({
      title: "Редагування правила",
      description: `Відкрито редагування правила ${ruleId}`
    });
  };
  
  const handleDeleteRule = (ruleId: string) => {
    toast({
      title: "Видалення правила",
      description: `Правило ${ruleId} було б видалено`
    });
  };
  
  const handleDownloadRules = () => {
    toast({
      title: "Оновлення правил дорожнього руху",
      description: "Завантаження останньої версії правил дорожнього руху..."
    });
    
    // Simulate download
    setTimeout(() => {
      toast({
        title: "Оновлення завершено",
        description: "Правила дорожнього руху успішно оновлено"
      });
    }, 2000);
  };
  
  const handleAddRule = () => {
    toast({
      title: "Додавання правила",
      description: "Відкрито форму для додавання нового правила"
    });
  };
  
  const isAdmin = authState.user?.role === 'admin';

  if (loading || !currentSection) {
    return (
      <div className="text-center py-12 text-gray-400">Завантаження...</div>
    );
  }

  // Фільтруємо правила для поточної секції
  const filteredRules = rules.filter(rule => rule.rule_id.split('.')[0] === String(currentSection.number));

  // Кнопки навігації
  const prevSection = sections[currentSectionIdx - 1];
  const nextSection = sections[currentSectionIdx + 1];
  const neighborSections = getNeighborSections();

  return (
    <div>
      <Card className="bg-gradient-to-r from-secondary to-black border-gray-800 mb-6">
        <CardHeader>
          <CardTitle className="text-2xl">
            Розділ {currentSection.number}. {currentSection.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4 justify-between">
            <div>
              {prevSection && (
                <Button
                  variant="outline"
                  onClick={() => navigate(`/materials/rules/${prevSection.number}`)}
                >
                  ← Попередня секція
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              {neighborSections.map(section => (
                <Button
                  key={section.number}
                  variant={String(section.number) === String(currentSection.number) ? 'default' : 'outline'}
                  className={String(section.number) === String(currentSection.number) ? 'bg-lider-red' : ''}
                  onClick={() => navigate(`/materials/rules/${section.number}`)}
                >
                  {section.number}
                </Button>
              ))}
            </div>
            <div>
              {nextSection && (
                <Button
                  variant="outline"
                  onClick={() => navigate(`/materials/rules/${nextSection.number}`)}
                >
                  Наступна секція →
                </Button>
              )}
            </div>
          </div>
          <SectionRules
            sectionNumber={String(currentSection.number)}
            rules={rules}
            comments={comments}
            user={authState.user}
            onAddComment={handleAddComment}
            onDeleteComment={authState.user?.role === 'admin' ? handleDeleteComment : undefined}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default TrafficRulesSection;
