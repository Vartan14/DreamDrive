
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Phone, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface BranchDetails {
  id: string;
  name: string;
  address: string;
  phone: string;
  workingHours: string;
  mapUrl: string;
}

const BranchCard = ({ branch }: { branch: BranchDetails }) => {
  return (
    <Card className="bg-secondary border-gray-800 hover:border-lider-red/30 transition-all duration-300">
      <CardContent className="p-6">
        <h3 className="text-xl font-bold mb-3">{branch.name}</h3>
        
        <div className="space-y-3 mb-4">
          <div className="flex items-start">
            <MapPin size={18} className="text-lider-red mr-2 mt-1 flex-shrink-0" />
            <span>{branch.address}</span>
          </div>
          
          <div className="flex items-center">
            <Phone size={18} className="text-lider-red mr-2 flex-shrink-0" />
            <a href={`tel:${branch.phone}`} className="hover:text-lider-red transition-colors">
              {branch.phone}
            </a>
          </div>
          
          <div className="flex items-start">
            <Clock size={18} className="text-lider-red mr-2 mt-1 flex-shrink-0" />
            <span>{branch.workingHours}</span>
          </div>
        </div>
        
        <div className="mt-5">
          <Button asChild className="btn-outline w-full">
            <a href={branch.mapUrl} target="_blank" rel="noopener noreferrer">
              View on Map
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BranchCard;
