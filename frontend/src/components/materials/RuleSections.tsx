import { UserData } from '@/types/userInterface';
import type { Rule } from '@/types/ruleInterface';
import {RuleCard} from './RuleCard';


interface SectionRulesProps {
  sectionNumber: string;
  rules: Rule[];
  user: UserData | null;
  onEditRule?: (ruleId: string) => void;
  onDeleteRule?: (ruleId: string) => void;
}

export const SectionRules: React.FC<SectionRulesProps> = ({ 
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
          key={rule.id}
          rule={{
            id: rule.id,
            rule_id: rule.rule_id,
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