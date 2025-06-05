
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';


export interface PricingFeature {
  text: string;
  included: boolean;
}

interface PricingCardProps {
  title: string;
  price: string;
  period?: string;
  description?: string;
  features: PricingFeature[];
  popular?: boolean;
  ctaText?: string;
  ctaLink?: string;
}

const PricingCard = ({
  title,
  price,
  period = "повний курс",
  description,
  features,
  popular = false,
  ctaText = "Придбати курс",
  ctaLink = "#"
}: PricingCardProps) => {
  return (
    <Card 
      className={`border transition-all duration-300 hover:border-lider-red/50 ${
        popular 
          ? 'border-lider-red/50 shadow-[0_0_15px_rgba(224,0,0,0.2)]' 
          : 'border-gray-800'
      } bg-secondary h-full`}
    >
      {popular && (
        <div className="bg-lider-red text-white text-center py-1 text-sm font-medium">
          <span>Найпопулярніший</span>
        </div>
      )}
      
      <CardContent className="pt-6 pb-0">
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <div className="mt-4 mb-3">
          <span className="text-3xl font-bold">{price}</span>
          {period && <span className="text-gray-400 ml-1">/ {period}</span>}
        </div>
        
        {description && (
          <p className="text-gray-300 text-sm mb-6">{description}</p>
        )}
        
        <div className="space-y-3 mt-6">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className={`flex items-start ${!feature.included ? 'text-gray-500' : ''}`}
            >
              <Check 
                size={18} 
                className={`mr-2 mt-0.5 flex-shrink-0 ${
                  feature.included ? 'text-lider-red' : 'text-gray-600'
                }`}
              />
              <span className="text-sm">{feature.text}</span>
            </div>
          ))}
        </div>
      </CardContent>
      
      <CardFooter className="pt-6 pb-6 mt-6">
        <Button 
          asChild
          className={`w-full ${
            popular ? 'btn-primary' : 'btn-outline'
          }`}
        >
          <a href={ctaLink}>{ctaText}</a>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PricingCard;
