
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

export interface ReviewDetails {
  id: string;
  name: string;
  date: string;
  rating: number;
  text: string;
  photoUrl?: string;
  licenseCategory?: string;
}

const ReviewCard = ({ review }: { review: ReviewDetails }) => {
  return (
    <Card className="bg-secondary border-gray-800 hover:border-gray-700 transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            {review.photoUrl ? (
              <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                <img 
                  src={review.photoUrl} 
                  alt={review.name} 
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center mr-3">
                <span className="text-gray-300 font-medium">
                  {review.name.charAt(0)}
                </span>
              </div>
            )}
            
            <div>
              <h4 className="font-medium">{review.name}</h4>
              <div className="text-xs text-gray-400">{review.date}</div>
            </div>
          </div>
          
          {review.licenseCategory && (
            <div className="bg-gray-800 px-2 py-1 rounded text-xs">
              {review.licenseCategory}
            </div>
          )}
        </div>
        
        <div className="flex mb-3">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={16}
              className={i < review.rating ? "text-lider-red fill-lider-red" : "text-gray-600"}
            />
          ))}
        </div>
        
        <p className="text-gray-300">{review.text}</p>
      </CardContent>
    </Card>
  );
};

export default ReviewCard;
