import React, { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Send, Download, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { UserData } from '@/types/userInterface';
import type { Rule } from '@/types/ruleInterface';
import { fetchRuleSections, fetchRules, fetchSignSections, fetchSigns } from '@/utils/requests/materials';



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



interface RuleCardProps {
  rule: {
    id: string;
    text: string;
    img_url?: string;
    sign_name?: string;
  };
  user: UserData | null;
  onEditRule?: (ruleId: string) => void;
  onDeleteRule?: (ruleId: string) => void;
}

const RuleCard: React.FC<RuleCardProps> = ({ 
  rule, 
  user, 
  onEditRule,
  onDeleteRule
}) => {
  const isAdmin = user?.role === 'admin';
  
  return (
    <Card className="bg-secondary border-gray-800 mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <CardTitle className="text-lg flex items-center">
            <span className="text-lider-red mr-2">{rule.id}</span>
          </CardTitle>
          
          {isAdmin && (
            <div className="flex gap-2">
              {onEditRule && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 text-green-400 hover:text-green-300"
                  onClick={() => onEditRule(rule.id)}
                >
                  <Edit size={16} />
                </Button>
              )}
              
              {onDeleteRule && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 text-red-400 hover:text-red-300"
                  onClick={() => onDeleteRule(rule.id)}
                >
                  <Trash2 size={16} />
                </Button>
              )}
            </div>
          )}
        </div>
      </CardHeader>
      
          <CardContent>
        {rule.img_url && (
          <div className="mb-4 flex justify-center">
            <img 
              src={rule.img_url} 
              alt={rule.sign_name || 'Дорожній знак'} 
              className="h-32 w-auto"
            />
          </div>
        )}

        
        <p className="text-gray-300 whitespace-pre-line">{rule.text}</p>
        
      </CardContent>
    </Card>
  );
};

interface SectionRulesProps {
  sectionNumber: string;
  rules: Rule[];
  user: UserData | null;
  onEditRule?: (ruleId: string) => void;
  onDeleteRule?: (ruleId: string) => void;
}

const SectionRules: React.FC<SectionRulesProps> = ({ 
  sectionNumber, 
  rules,
  user,
  onEditRule,
  onDeleteRule
}) => {
  const filteredRules = rules.filter(
    rule => String(rule.section_number).trim() === String(sectionNumber).trim()
  );

  return (
    <div className="space-y-4">
      {filteredRules.map((rule) => (
        <RuleCard 
          key={rule.rule_id}
          rule={{
            id: rule.rule_id,
            text: rule.text,
            img_url: rule.img_url,
            sign_name: rule.sign_name
          }}
          user={user}
          onEditRule={onEditRule}
          onDeleteRule={onDeleteRule}
        />
      ))}
    </div>
  );
};

interface SignSectionProps {
  group_number: string;
  signs: any[];
  user: UserData | null;
  onEditRule?: (ruleId: string) => void;
  onDeleteRule?: (ruleId: string) => void;
}

const SignSection: React.FC<SignSectionProps> = ({ 
  group_number, 
  signs,
  user,
  onEditRule,
  onDeleteRule
}) => {
  const filteredSigns = signs.filter(sign => String(sign.section_number) === String(group_number));
  
  return (
    <div className="space-y-4">
      {filteredSigns.map((sign) => (
        <RuleCard 
          key={sign.id} 
          rule={{
            id: sign.rule_id,
            text: sign.text,
            img_url: sign.img_url,
            sign_name: sign.sign_name
          }} 
          user={user}
          onEditRule={onEditRule}
          onDeleteRule={onDeleteRule}
        />
      ))}
    </div>
  );
};

const TrafficRulesSection: React.FC = () => {
  const authState  = useAuthStore();
  const [activeTab, setActiveTab] = useState('rules');
  const [sections, setSections] = useState<any[]>([]);
  const [rulesBySection, setRulesBySection] = useState<Record<string, Rule[]>>({});
  const [openSections, setOpenSections] = useState<string[]>([]);
  const [loadingSections, setLoadingSections] = useState<string[]>([]);
  const [signSections, setSignSections] = useState<any[]>([]);
  const [signs, setSigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const isAdmin = authState.user?.role === 'admin';

  React.useEffect(() => {
    setLoading(true);
    Promise.all([fetchRuleSections(), fetchSignSections(), fetchSigns()])
      .then(([sectionsData, signSectionsData, signsData]) => {
        setSections(sectionsData.slice(0, 32));
        setSignSections(signSectionsData);
        setSigns(signsData);
      })
      .catch(() => {
        toast({
          title: "Помилка",
          description: "Не вдалося завантажити правила або секції",
          variant: "destructive"
        });
      })
      .finally(() => setLoading(false));
  }, []);

  // Завантаження правил для секції при відкритті
  const handleAccordionChange = async (values: string[]) => {
    setOpenSections(values);
    // Завантажуємо правила лише для нових секцій
    for (const sectionNumber of values) {
      if (!rulesBySection[sectionNumber] && !loadingSections.includes(sectionNumber)) {
        setLoadingSections(prev => [...prev, sectionNumber]);
        try {
          const rules = await fetchRules(sectionNumber);
          setRulesBySection(prev => ({ ...prev, [sectionNumber]: rules }));
        } catch {
          toast({
            title: "Помилка",
            description: `Не вдалося завантажити правила для секції ${sectionNumber}`,
            variant: "destructive"
          });
        } finally {
          setLoadingSections(prev => prev.filter(n => n !== sectionNumber));
        }
      }
    }
  };

  const handleEditRule = (ruleId: string) => {
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

  return (
    <div>
      <Card className="bg-gradient-to-r from-secondary to-black border-gray-800 mb-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl">Правила дорожнього руху</CardTitle>

            {isAdmin && (
              <div className="flex gap-2">
                <Button 
                  onClick={handleAddRule}
                  className=""
                >
                  Додати правило
                </Button>
                {/* <Button 
                  onClick={handleDownloadRules}
                  className="flex items-center gap-2"
                >
                  <Download size={16} />
                  Оновити правила
                </Button> */}
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="pb-4">
          <div className="flex gap-4 mb-2">
            <Button 
              onClick={() => setActiveTab('rules')} 
              variant={activeTab === 'rules' ? 'default' : 'outline'} 
              className={activeTab === 'rules' ? 'bg-lider-red' : ''}
            >
              Правила руху
            </Button>
            <Button 
              onClick={() => setActiveTab('signs')} 
              variant={activeTab === 'signs' ? 'default' : 'outline'}
              className={activeTab === 'signs' ? 'bg-lider-red' : ''}
            >
              Дорожні знаки
            </Button>
          </div>
        </CardContent>
      </Card>

      {loading && (
        <div className="text-center text-gray-400 mb-8">Завантаження...</div>
      )}

      {!loading && activeTab === 'rules' && (
        <Accordion
          type="multiple"
          className="mb-8"
          value={openSections}
          onValueChange={handleAccordionChange}
        >
          {sections.map((section) => (
            <AccordionItem
              key={section.number}
              value={section.number}
              className="border-gray-700"
            >
              <AccordionTrigger className="text-xl py-4 hover:no-underline">
                <div className="flex items-center">
                  <span className="text-lider-red mr-2">{section.number}.</span>
                  {section.title}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                {loadingSections.includes(section.number) ? (
                  <div className="text-gray-400">Завантаження правил...</div>
                ) : (
                  <SectionRules
                    sectionNumber={section.number}
                    rules={rulesBySection[section.number] || []}
                    user={authState.user}
                    onEditRule={isAdmin ? handleEditRule : undefined}
                    onDeleteRule={isAdmin ? handleDeleteRule : undefined}
                  />
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}

      {!loading && activeTab === 'signs' && (
        <Accordion type="multiple" className="mb-8">
          {signSections.map((group) => (
            <AccordionItem 
              key={group.number + group.type} 
              value={group.number} 
              className="border-gray-700"
            >
              <AccordionTrigger className="text-xl py-4 hover:no-underline">
                {group.title}
              </AccordionTrigger>
              <AccordionContent>
                <SignSection 
                  group_number={group.number} 
                  signs={signs}
                  user={authState.user}
                  onEditRule={isAdmin ? handleEditRule : undefined}
                  onDeleteRule={isAdmin ? handleDeleteRule : undefined}
                />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
};

export default TrafficRulesSection;