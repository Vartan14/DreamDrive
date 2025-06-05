import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { UserData } from '@/types/userInterface';


interface RuleCardProps {
  rule: {
    id: string;
    rule_id: string;
    text: string;
    img_url?: string;
    sign_name?: string;
  };
  user: UserData | null;
  onEditRule?: (ruleId: string) => void;
  onDeleteRule?: (ruleId: string) => void;
}

export const RuleCard: React.FC<RuleCardProps> = ({ 
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
            <span className="text-lider-red mr-2">{rule.rule_id}</span>
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
