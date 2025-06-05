
import React from 'react';
import PageLayout from '@/components/layout/PageLayout';
import PageHeader from '@/components/ui/PageHeader';
import BranchCard from '@/components/branches/BranchCard';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';


// Sample branches data
const branches_eng = [
  {
    id: '1',
    name: 'LIDER Main Office',
    address: '123 Main Street, Kyiv, Ukraine',
    phone: '+380 44 123 4567',
    workingHours: 'Monday-Friday: 9:00 - 18:00, Saturday: 10:00 - 15:00',
    mapUrl: 'https://maps.google.com/?q=123+Main+Street+Kyiv+Ukraine',
  },
  {
    id: '2',
    name: 'LIDER West Branch',
    address: '456 West Avenue, Lviv, Ukraine',
    phone: '+380 32 234 5678',
    workingHours: 'Monday-Friday: 9:00 - 18:00, Saturday: 10:00 - 15:00',
    mapUrl: 'https://maps.google.com/?q=456+West+Avenue+Lviv+Ukraine',
  },
  {
    id: '3',
    name: 'LIDER South Office',
    address: '789 South Boulevard, Odesa, Ukraine',
    phone: '+380 48 345 6789',
    workingHours: 'Monday-Friday: 9:00 - 18:00, Saturday: 10:00 - 15:00',
    mapUrl: 'https://maps.google.com/?q=789+South+Boulevard+Odesa+Ukraine',
  },
  {
    id: '4',
    name: 'LIDER East Center',
    address: '101 East Road, Kharkiv, Ukraine',
    phone: '+380 57 456 7890',
    workingHours: 'Monday-Friday: 9:00 - 18:00, Saturday: 10:00 - 15:00',
    mapUrl: 'https://maps.google.com/?q=101+East+Road+Kharkiv+Ukraine',
  },
  {
    id: '5',
    name: 'LIDER North Branch',
    address: '202 North Street, Chernihiv, Ukraine',
    phone: '+380 46 567 8901',
    workingHours: 'Monday-Friday: 9:00 - 18:00, Saturday: 10:00 - 15:00',
    mapUrl: 'https://maps.google.com/?q=202+North+Street+Chernihiv+Ukraine',
  },
  {
    id: '6',
    name: 'LIDER Central Office',
    address: '303 Central Avenue, Dnipro, Ukraine',
    phone: '+380 56 678 9012',
    workingHours: 'Monday-Friday: 9:00 - 18:00, Saturday: 10:00 - 15:00',
    mapUrl: 'https://maps.google.com/?q=303+Central+Avenue+Dnipro+Ukraine',
  },
];

const branches = [
  {
    id: '1',
    name: 'Київ, м Позняки ',
    address: 'вул. Тараса Шевченка, 123, Київ, Україна',
    phone: '+380 44 123 4567',
    workingHours: 'Понеділок–П’ятниця: 9:00 – 18:00, Субота: 10:00 – 15:00',
    mapUrl: 'https://maps.google.com/?q=123+Main+Street+Kyiv+Ukraine',
  },
  {
    id: '2',
    name: 'Львів, проспект Західний',
    address: 'просп. Західний, 456, Львів, Україна',
    phone: '+380 32 234 5678',
    workingHours: 'Понеділок–П’ятниця: 9:00 – 18:00, Субота: 10:00 – 15:00',
    mapUrl: 'https://maps.google.com/?q=456+West+Avenue+Lviv+Ukraine',
  },
  {
    id: '3',
    name: 'Одеса, бульвар Південний',
    address: 'бульв. Південний, 789, Одеса, Україна',
    phone: '+380 48 345 6789',
    workingHours: 'Понеділок–П’ятниця: 9:00 – 18:00, Субота: 10:00 – 15:00',
    mapUrl: 'https://maps.google.com/?q=789+South+Boulevard+Odesa+Ukraine',
  },
  {
    id: '4',
    name: 'Харків, вул. Київська',
    address: 'вул. Київська, 101/34а, Харків, Україна',
    phone: '+380 57 456 7890',
    workingHours: 'Понеділок–П’ятниця: 9:00 – 18:00, Субота: 10:00 – 15:00',
    mapUrl: 'https://maps.google.com/?q=101+East+Road+Kharkiv+Ukraine',
  },
  {
    id: '5',
    name: 'Чернігів, вул. Північна',
    address: 'вул. Північна, 202, Чернігів, Україна',
    phone: '+380 46 567 8901',
    workingHours: 'Понеділок–П’ятниця: 9:00 – 18:00, Субота: 10:00 – 15:00',
    mapUrl: 'https://maps.google.com/?q=202+North+Street+Chernihiv+Ukraine',
  },
  {
    id: '6',
    name: 'Київ, м. Шулявка',
    address: 'просп. Центральний, 303, Київ, Україна',
    phone: '+380 56 678 9012',
    workingHours: 'Понеділок–П’ятниця: 9:00 – 18:00, Субота: 10:00 – 15:00',
    mapUrl: 'https://maps.google.com/?q=303+Central+Avenue+Dnipro+Ukraine',
  },
];


const Branches = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  
  const filteredBranches = branches.filter(branch =>
    branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    branch.address.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <PageLayout>
      <PageHeader 
        title="Наші філії" 
        // subtitle="Find a DREAM Driving School location near you"
        subtitle="Знайдіть найближчу до вас філію автошколи DREAM"
      />
      
      {/* Search Bar */}
      <section className="container-custom mb-12">
        <div className="max-w-md mx-auto relative">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input 
            type="text"
            placeholder="Search by city or branch name..."
            className="pl-10 bg-secondary border-gray-700 text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </section>
      
      {/* Branches Grid */}
      <section className="container-custom mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBranches.map(branch => (
            <BranchCard key={branch.id} branch={branch} />
          ))}
        </div>
        
        {filteredBranches.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium mb-2">No branches found</h3>
            <p className="text-gray-400">Try a different search term</p>
          </div>
        )}
      </section>
      
      {/* Map Preview */}
      <section className="container-custom mb-16">
        <h2 className="text-2xl font-bold mb-6 text-center">Знайдіть локацію</h2>
        <div className="bg-secondary border border-gray-700 rounded-lg p-2 h-[400px] overflow-hidden">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d325518.68780316407!2d30.252511957059154!3d50.4016990487754!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40d4cf4ee15a4505%3A0x764931d2170146fe!2sKyiv%2C%20Ukraine!5e0!3m2!1sen!2sus!4v1650984481659!5m2!1sen!2sus"
            width="100%"
            height="100%"
            style={{ border: 0, borderRadius: '0.5rem' }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="LIDER Driving School Locations"
          ></iframe>
        </div>
      </section>
      
      {/* Contact Info */}
      <section className="bg-secondary py-16">
        <div className="container-custom text-center">
          <h2 className="text-2xl font-bold mb-4">
            {/* Need Help Finding a Branch? */}
            Потрібна допомога у виборі філії?
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto mb-8">
            {/* Our customer support team is ready to help you find the most convenient location for your driving lessons. */}
            Наша команда підтримки клієнтів готова допомогти вам знайти найбільш зручну локацію для ваших уроків водіння.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {/* <a href="tel:+380123456789" className="btn-outline inline-flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              +380 12 345 6789
            </a> */}
            {/* <a href="mailto:info@liderdriving.com" className="btn-primary inline-flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              Зв'язатися з нами
            </a> */}
              <Link to="/contact" className="btn-primary inline-block">
                Зв'язатися з нами
              </Link>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Branches;
