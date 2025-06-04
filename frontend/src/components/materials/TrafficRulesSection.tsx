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

import { toast } from '@/hooks/use-toast';
import type { Rule } from '@/types/ruleInterface';
import { fetchRuleSections, fetchRules, fetchSignSections, fetchSigns } from '@/utils/requests/materials';

import {SectionRules} from './RuleSections';
import {SignSection} from './SignSection';


const TrafficRulesSection: React.FC = () => {
  const authState  = useAuthStore();
  const [activeTab, setActiveTab] = useState('rules');
  const [sections, setSections] = useState<any[]>([]);
  const [rulesBySection, setRulesBySection] = useState<Record<string, Rule[]>>({});
  const [openSections, setOpenSections] = useState<string[]>([]);
  const [loadingSections, setLoadingSections] = useState<string[]>([]);

  const [signSections, setSignSections] = useState<any[]>([]);
  const [markingSections, setMarkingSections] = useState<any[]>([]);
  const [signs, setSigns] = useState<any[]>([]);
  const [markings, setMarkings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const isAdmin = authState.user?.role === 'admin';

  React.useEffect(() => {
    setLoading(true);
    (async () => {
      try {
        const [sectionsData, signSectionsData] = await Promise.all([
          fetchRuleSections(),
          fetchSignSections()
        ]);

        setSections(sectionsData.slice(0, 32));

        const signSectionsOnly = signSectionsData.filter((section: any) => section.type === 'sign');
        const markingSectionsOnly = signSectionsData.filter((section: any) => section.type === 'marking');

        setSignSections(signSectionsOnly);
        setMarkingSections(markingSectionsOnly); 

      } catch {
        toast({
          title: "Помилка",
          description: "Не вдалося завантажити правила або секції",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    })();
  }, []);


  const handleAccordionChange = async (values: string[]) => {
    setOpenSections(values);
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


  const handleAccordionChangeSignsAndMarkings = async (values: string[]) => {
    for (const groupNumber of values) {
      if (!loadingSections.includes(groupNumber)) {
        setLoadingSections(prev => [...prev, groupNumber]);
        try {
          const groupSigns = await fetchSigns(groupNumber);
          if (activeTab === 'signs') {
            setSigns(prev => [
              ...prev.filter(sign => String(sign.section_number) !== String(groupNumber)),
              ...groupSigns
            ]);
          } else if (activeTab === 'markings') {
            setMarkings(prev => [
              ...prev.filter(sign => String(sign.section_number) !== String(groupNumber)),
              ...groupSigns
            ]);
          }
        } catch {
          toast({
            title: "Помилка",
            description: `Не вдалося завантажити знаки для групи ${groupNumber}`,
            variant: "destructive"
          });
        } finally {
          setLoadingSections(prev => prev.filter(n => n !== groupNumber));
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
              Правила дорожнього руху
            </Button>
            <Button 
              onClick={() => setActiveTab('signs')} 
              variant={activeTab === 'signs' ? 'default' : 'outline'}
              className={activeTab === 'signs' ? 'bg-lider-red' : ''}
            >
              Дорожні знаки
            </Button>
             <Button 
              onClick={() => setActiveTab('markings')} 
              variant={activeTab === 'markings' ? 'default' : 'outline'}
              className={activeTab === 'markings' ? 'bg-lider-red' : ''}
            >
              Дорожня розмітка
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
        <Accordion
          type="multiple"
          className="mb-8"
          onValueChange={handleAccordionChangeSignsAndMarkings}
        >
          {signSections.map((group) => (
            <AccordionItem 
              key={group.id} 
              value={group.id} 
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

      {!loading && activeTab === 'markings' && (
        <Accordion
          type="multiple"
          className="mb-8"
          onValueChange={handleAccordionChangeSignsAndMarkings}
        >
          {markingSections.map((group) => (
            <AccordionItem 
              key={group.id} 
              value={group.id} 
              className="border-gray-700"
            >
              <AccordionTrigger className="text-xl py-4 hover:no-underline">
                {group.title}
              </AccordionTrigger>
              <AccordionContent>
                <SignSection 
                  group_number={group.number} 
                  signs={markings}
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