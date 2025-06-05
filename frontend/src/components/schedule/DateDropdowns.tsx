import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const YEARS = [2025, 2026, 2027, 2028, 2029, 2030];
const MONTHS = [
  { value: '1', label: '01' },
  { value: '2', label: '02' },
  { value: '3', label: '03' },
  { value: '4', label: '04' },
  { value: '5', label: '05' },
  { value: '6', label: '06' },
  { value: '7', label: '07' },
  { value: '8', label: '08' },
  { value: '9', label: '09' },
  { value: '10', label: '10' },
  { value: '11', label: '11' },
  { value: '12', label: '12' }
];

export const DateDropdowns = ({ 
  year, 
  month, 
  day, 
  onYearChange, 
  onMonthChange, 
  onDayChange 
}) => {
  // Get max days in the selected month
  const getMaxDays = (year, month) => {
    return new Date(year, month, 0).getDate();
  };
  
  const maxDays = month ? getMaxDays(year || new Date().getFullYear(), parseInt(month)) : 31;
  const days = Array.from({ length: maxDays }, (_, i) => i + 1);
  
  return (
    <div className="flex gap-2">
      <div className="w-1/3">
        <Select value={day?.toString()} onValueChange={onDayChange}>
          <SelectTrigger className="bg-gray-800 border-gray-700">
            <SelectValue placeholder="Day" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700 max-h-60">
            {days.map(d => (
              <SelectItem key={d} value={d.toString()}>
                {d.toString().padStart(2, '0')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="w-1/3">
        <Select value={month?.toString()} onValueChange={onMonthChange}>
          <SelectTrigger className="bg-gray-800 border-gray-700">
            <SelectValue placeholder="Month" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700">
            {MONTHS.map(m => (
              <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="w-1/3">
        <Select value={year?.toString()} onValueChange={onYearChange}>
          <SelectTrigger className="bg-gray-800 border-gray-700">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700">
            {YEARS.map(y => (
              <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
