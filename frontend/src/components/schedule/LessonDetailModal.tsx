import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Users, Car, Video, BadgeCheck, Landmark } from "lucide-react";
import { LessonEvent } from '@/types/scheduleInterface';
import { format } from 'date-fns';
import { uk } from 'date-fns/locale';
import {filials} from '@/types/filials';


interface LessonDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  lesson: LessonEvent | null;
  canEdit: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

const formatDuration = (duration: string) => {
  // "HH:mm:ss"
  const [hours, minutes] = duration.split(':');
  let result = '';
  if (hours && parseInt(hours) > 0) result += `${parseInt(hours)} год `;
  if (minutes && parseInt(minutes) > 0) result += `${parseInt(minutes)} хв`;
  return result.trim();
};

export const LessonDetailModal: React.FC<LessonDetailModalProps> = ({
  isOpen,
  onClose,
  lesson,
  canEdit = false,
  onEdit,
  onDelete,
}) => {
  if (!lesson) return null;

  // Функція для отримання назви філії
  const getFilialName = (filial_id: string | number) => {
    const filial = filials.find(f => f.id.toString() === filial_id?.toString());
    return filial ? filial.name : '';
  };

  const formatTime = (dateString: string, zeroShift: boolean = false) => {
    let hourShift = 3;
    if (zeroShift) {hourShift = 0;}
    
    const date = new Date(dateString);
    const hours= (date.getHours() - hourShift).toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    const timeStr = `${hours}:${minutes}`;

    return timeStr;
  };
  
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'EEEE, d MMMM yyyy');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-secondary border-gray-700 text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {lesson.type === 'theory' ? 'Теоретичне заняття' : 'Практичне заняття'}
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            {lesson.lesson_title || 'Деталі заняття'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex items-start">
            <Calendar className="h-5 w-5 mr-3 text-gray-400 mt-0.5" />
            <div>
              <p className="font-medium">{formatDate(lesson.start)}</p>
              <p className="text-sm text-gray-400">
                {formatTime(lesson.start, lesson.isEdited)} - {formatTime(lesson.end, lesson.isEdited)} ({formatDuration(lesson.duration)})
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <MapPin className="h-5 w-5 mr-3 text-gray-400 mt-0.5" />
            <div>
              <p className="font-medium">Філія</p>
              <p className="text-sm text-gray-400">{getFilialName(lesson.filial_id)}</p>
            </div>
          </div>

          {lesson.type === 'theory' ? (
            <>
              <div className="flex items-start">
                <Users className="h-5 w-5 mr-3 text-gray-400 mt-0.5" />
                <div>
                  <p className="font-medium">Група</p>
                  <p className="text-sm text-gray-400">{lesson.group}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Video className="h-5 w-5 mr-3 text-gray-400 mt-0.5" />
                <div>
                  <p className="font-medium">Формат</p>
                  <p className="text-sm text-gray-400">
                    {lesson.is_online ? 'Онлайн' : 'Офлайн'}
                  </p>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-start">
                <BadgeCheck className="h-5 w-5 mr-3 text-gray-400 mt-0.5" />
                <div>
                  <p className="font-medium">Статус</p>
                  <p className="text-sm text-gray-400">
                    {lesson.status === 'available'
                      ? 'Доступно до бронювання'
                      : lesson.status === 'booked'
                        ? 'Заброньовано'
                        : lesson.status === 'completed'
                          ? 'Завершено'
                          : lesson.status === 'cancelled'
                            ? 'Скасовано'
                            : '—'}
                    {lesson.student && (
                      <> ({lesson.student})</>
                    )}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Car className="h-5 w-5 mr-3 text-gray-400 mt-0.5" />
                <div>
                  <p className="font-medium">Автомобіль</p>
                  <p className="text-sm text-gray-400">{lesson.car}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Landmark className="h-5 w-5 mr-3 text-gray-400 mt-0.5" />
                <div>
                  <p className="font-medium">Локація</p>
                  <p className="text-sm text-gray-400">{lesson.location}</p>
                </div>
              </div>
            </>
          )}
        </div>
        
        <DialogFooter>
          <div className="flex justify-between w-full">
            {canEdit && (
              <div className="space-x-2">
                <Button
                  variant="outline"
                  className="border-red-500/30 text-red-500 hover:bg-red-950/20"
                  onClick={onDelete}
                >
                  Видалити
                </Button>
                <Button
                  variant="outline"
                  className="border-blue-500/30 text-blue-500 hover:bg-blue-950/20"
                  onClick={onEdit}
                >
                  Редагувати
                </Button>
              </div>
            )}
            <Button 
              className="ml-auto"
              onClick={onClose}
            >
              Закрити
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
