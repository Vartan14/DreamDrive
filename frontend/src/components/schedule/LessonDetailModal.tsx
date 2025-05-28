
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
import { Calendar, Clock, MapPin, Users, Car, Video } from "lucide-react";
import { LessonEvent } from '@/types/schedule';
import { format } from 'date-fns';

interface LessonDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  lesson: LessonEvent | null;
  canEdit?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const LessonDetailModal: React.FC<LessonDetailModalProps> = ({
  isOpen,
  onClose,
  lesson,
  canEdit = false,
  onEdit,
  onDelete,
}) => {
  if (!lesson) return null;
  
  const formatTime = (dateString: string) => {
    return format(new Date(dateString), 'HH:mm');
  };
  
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'EEEE, MMMM d, yyyy');
  };

  const getDuration = () => {
    const start = new Date(lesson.start);
    const end = new Date(lesson.end);
    const durationMs = end.getTime() - start.getTime();
    const durationMin = Math.floor(durationMs / 60000);
    
    if (durationMin >= 60) {
      const hours = Math.floor(durationMin / 60);
      const minutes = durationMin % 60;
      return `${hours} hour${hours !== 1 ? 's' : ''}${minutes > 0 ? ` ${minutes} minutes` : ''}`;
    }
    
    return `${durationMin} minutes`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-secondary border-gray-700 text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {lesson.type === 'theory' ? 'Theory Lesson' : 'Practical Lesson'}
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Lesson details
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex items-start">
            <Calendar className="h-5 w-5 mr-3 text-gray-400 mt-0.5" />
            <div>
              <p className="font-medium">{formatDate(lesson.start)}</p>
              <p className="text-sm text-gray-400">
                {formatTime(lesson.start)} - {formatTime(lesson.end)} ({getDuration()})
              </p>
            </div>
          </div>
          
          {lesson.type === 'theory' ? (
            <>
              <div className="flex items-start">
                <Users className="h-5 w-5 mr-3 text-gray-400 mt-0.5" />
                <div>
                  <p className="font-medium">Group</p>
                  <p className="text-sm text-gray-400">{lesson.group}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Video className="h-5 w-5 mr-3 text-gray-400 mt-0.5" />
                <div>
                  <p className="font-medium">Format</p>
                  <p className="text-sm text-gray-400">
                    {lesson.is_online ? 'Online' : 'In Person'}
                  </p>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-start">
                <Users className="h-5 w-5 mr-3 text-gray-400 mt-0.5" />
                <div>
                  <p className="font-medium">Student</p>
                  <p className="text-sm text-gray-400">
                    {lesson.student || 'Available (No student assigned)'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Car className="h-5 w-5 mr-3 text-gray-400 mt-0.5" />
                <div>
                  <p className="font-medium">Vehicle</p>
                  <p className="text-sm text-gray-400">{lesson.car}</p>
                </div>
              </div>
            </>
          )}
          
          <div className="flex items-start">
            <MapPin className="h-5 w-5 mr-3 text-gray-400 mt-0.5" />
            <div>
              <p className="font-medium">Location</p>
              <p className="text-sm text-gray-400">{lesson.location}</p>
            </div>
          </div>
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
                  Delete
                </Button>
                <Button
                  variant="outline"
                  className="border-blue-500/30 text-blue-500 hover:bg-blue-950/20"
                  onClick={onEdit}
                >
                  Edit
                </Button>
              </div>
            )}
            <Button 
              className="ml-auto"
              onClick={onClose}
            >
              Close
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
