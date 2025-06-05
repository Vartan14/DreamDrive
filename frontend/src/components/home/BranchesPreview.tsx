
import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Simplified map placeholder
const MapPlaceholder = () => (
  <div className="relative h-64 md:h-96 bg-gray-900 rounded-xl overflow-hidden border border-gray-700">
    {/* Map background image */}
    <div 
      className="absolute inset-0 bg-cover bg-center opacity-70"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?q=80&w=2069&auto=format&fit=crop')" }}
    ></div>
    
    {/* Map overlay */}
    <div className="absolute inset-0 bg-black/50"></div>
    
    {/* Location markers */}
    <div className="absolute top-1/4 left-1/4 w-4 h-4 rounded-full bg-lider-red animate-pulse"></div>
    <div className="absolute top-1/3 right-1/3 w-4 h-4 rounded-full bg-lider-red animate-pulse"></div>
    <div className="absolute bottom-1/4 left-1/3 w-4 h-4 rounded-full bg-lider-red animate-pulse"></div>
    <div className="absolute bottom-1/3 right-1/4 w-4 h-4 rounded-full bg-lider-red animate-pulse"></div>
    
    {/* View detailed map overlay */}
    <div className="absolute inset-0 flex items-center justify-center">
      <Link to="/branches">
        <Button className="btn-primary">
          <span>View Detailed Map</span>
          <ArrowRight size={18} className="ml-2" />
        </Button>
      </Link>
    </div>
  </div>
);

const branches = [
  { id: 1, city: 'Kyiv', address: '123 Main Street', phone: '+380 44 123 4567' },
  { id: 2, city: 'Sloviansk', address: '45 Central Avenue', phone: '+380 62 345 6789' },
  { id: 3, city: 'Kramatorsk', address: '78 Liberty Street', phone: '+380 62 567 8901' },
  { id: 4, city: 'Dnipro', address: '90 River Road', phone: '+380 56 234 5678' }
];

const BranchesPreview = () => {
  return (
    <section className="section-padding bg-black">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="heading-lg">Our Branches</h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Find a LIDER Driving School location near you
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Map placeholder */}
          <div className="md:col-span-2">
            <MapPlaceholder />
          </div>
          
          {/* Branch list */}
          <div className="space-y-4">
            {branches.map(branch => (
              <div 
                key={branch.id} 
                className="bg-secondary p-4 rounded-lg border border-gray-700 hover:border-lider-red/50 transition-all duration-300 hover-scale"
              >
                <h3 className="text-xl font-bold flex items-center">
                  <MapPin size={18} className="text-lider-red mr-2" />
                  {branch.city}
                </h3>
                <p className="text-gray-300 mt-1">{branch.address}</p>
                <p className="text-lider-red mt-2">{branch.phone}</p>
              </div>
            ))}
            
            <Link to="/branches" className="inline-block mt-4">
              <Button variant="outline" className="btn-outline">
                <span>See All Locations</span>
                <ArrowRight size={18} className="ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BranchesPreview;
