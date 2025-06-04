export const formatEventDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('uk-UA', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  });
};

export const formatEventTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('uk-UA', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

export const formatTime = (isoString: string) => {
  isoString = isoString.replace('Z', '');
  const [date, time] = isoString.split('T');
  const [hours, minutes] = time.split(':');
  const formattedTime = `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
  return formattedTime;
};

export const formatDuration = (duration: string) => {
  const [hours, minutes] = duration.split(':').map(Number);
  if (hours > 0 && minutes === 0) {
    return hours === 1 ? '1 година' : `${hours} години`;
  }
  if (hours > 0 && minutes > 0) {
    return `${hours},${minutes / 60 * 10} години`.replace('.0', '');
  }
  if (minutes > 0) {
    return `${minutes} хвилин`;
  }
  return '';
};
