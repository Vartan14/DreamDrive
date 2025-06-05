import { UserData } from '@/types/userInterface';
import {RuleCard} from './RuleCard';


interface SignSectionProps {
  group_number: string;
  signs: any[];
  user: UserData | null;
  onEditRule?: (ruleId: string) => void;
  onDeleteRule?: (ruleId: string) => void;
}

export const SignSection: React.FC<SignSectionProps> = ({ 
  group_number, 
  signs,
  user,
  onEditRule,
  onDeleteRule
}) => {
  const filteredSigns = signs.filter(sign => String(sign.section_number) === String(group_number));
  console.log('Filtered signs:', filteredSigns);

  return (
    <div className="space-y-4">
      {filteredSigns.map((sign) => (
        <RuleCard 
          key={sign.id + 'sign'} 
          rule={{
            id: sign.id,
            rule_id: sign.rule_id,
            text: sign.text.split(" ").slice(1, -1).join(" "),
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