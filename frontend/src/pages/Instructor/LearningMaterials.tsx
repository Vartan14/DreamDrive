import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/pages/Auth/OLD_AuthContext';
import PageLayout from '@/components/layout/PageLayout';
import PageHeader from '@/components/ui/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, BookOpen, CheckCircle, AlertCircle } from 'lucide-react';

// Mock data for learning materials
const sections = [
  {
    id: 1,
    title: 'Introduction to Driving',
    description: 'Basic concepts and preparation for driving',
    materials: [
      { id: 101, title: 'Getting Started with Driving', completed: true },
      { id: 102, title: 'Understanding Your Vehicle', completed: true },
      { id: 103, title: 'Pre-Driving Checks', completed: false },
    ],
  },
  {
    id: 2,
    title: 'Road Signs and Markings',
    description: 'Learn all traffic signs and road markings',
    materials: [
      { id: 201, title: 'Warning Signs', completed: true },
      { id: 202, title: 'Regulatory Signs', completed: false },
      { id: 203, title: 'Informational Signs', completed: false },
      { id: 204, title: 'Road Markings and Lane Discipline', completed: false },
    ],
  },
  {
    id: 3,
    title: 'Traffic Rules',
    description: 'Understanding and following traffic regulations',
    materials: [
      { id: 301, title: 'Right of Way Rules', completed: true },
      { id: 302, title: 'Speed Limits and Control', completed: false },
      { id: 303, title: 'Intersection Navigation', completed: false },
      { id: 304, title: 'Highway Driving Rules', completed: false },
    ],
  },
  {
    id: 4,
    title: 'Vehicle Controls',
    description: 'Mastering vehicle operation and controls',
    isPremium: true,
    materials: [
      { id: 401, title: 'Basic Vehicle Controls', completed: false },
      { id: 402, title: 'Manual Transmission Techniques', completed: false },
      { id: 403, title: 'Advanced Steering Techniques', completed: false },
    ],
  },
  {
    id: 5,
    title: 'Defensive Driving',
    description: 'Techniques to anticipate and avoid accidents',
    isPremium: true,
    materials: [
      { id: 501, title: 'Hazard Awareness', completed: false },
      { id: 502, title: 'Space Management', completed: false },
      { id: 503, title: 'Emergency Maneuvers', completed: false },
      { id: 504, title: 'Weather Condition Driving', completed: false },
    ],
  }
];

// Mock data for a specific learning material
const materialContent = {
  101: {
    title: 'Getting Started with Driving',
    content: `
      <h2>Introduction to Driving</h2>
      <p>Learning to drive is an exciting journey that offers independence and opens up new opportunities. This guide will help you get started on the right foot.</p>
      
      <h3>Before You Start</h3>
      <p>Before getting behind the wheel, there are a few things you should understand:</p>
      <ul>
        <li>Driving is a privilege, not a right</li>
        <li>Safety should always be your top priority</li>
        <li>Learning requires patience and consistent practice</li>
      </ul>
      
      <h3>Mental Preparation</h3>
      <p>The right mindset is crucial for successful driving. Approach driving with:</p>
      <ul>
        <li>Focus and concentration</li>
        <li>Respect for other road users</li>
        <li>Commitment to following rules</li>
        <li>Awareness of your surroundings</li>
      </ul>
      
      <h3>Physical Requirements</h3>
      <p>Ensure you're physically ready to drive:</p>
      <ul>
        <li>Good vision (with correction if needed)</li>
        <li>Adequate hearing</li>
        <li>Physical coordination</li>
        <li>No impairing substances in your system</li>
      </ul>
      
      <h3>Getting Familiar with the Car</h3>
      <p>Before starting the engine, familiarize yourself with:</p>
      <ul>
        <li>Seating position and adjustments</li>
        <li>Mirror positioning</li>
        <li>Basic controls (steering wheel, pedals)</li>
        <li>Dashboard indicators</li>
      </ul>
    `,
    videoUrl: 'https://example.com/videos/getting-started',
    quiz: [
      {
        question: 'What should always be your top priority when driving?',
        options: ['Speed', 'Comfort', 'Safety', 'Style'],
        answer: 2 // Safety
      },
      {
        question: 'Which of the following should you check before driving?',
        options: ['Social media', 'Mirror positioning', 'Weather forecast only', 'Entertainment system'],
        answer: 1 // Mirror positioning
      }
    ]
  }
};

const LearningMaterials = () => {
  const { materialId } = useParams<{ materialId?: string }>();
  const { authState } = useAuth();
  const navigate = useNavigate();
  const user = authState.user;
  const isSubscribed = user?.role === 'student' && user.isSubscribed;

  const [activeTab, setActiveTab] = useState<'content' | 'quiz'>('content');

  // If not authenticated, redirect to login
  React.useEffect(() => {
    if (!authState.isLoading && !user) {
      navigate('/login', { state: { from: location.pathname } });
    }
  }, [authState.isLoading, user, navigate]);

  if (authState.isLoading) {
    return (
      <PageLayout>
        <div className="container-custom py-20 text-center">
          <h2 className="text-xl">Loading...</h2>
        </div>
      </PageLayout>
    );
  }

  // Show specific material content if materialId is provided
  if (materialId) {
    const id = parseInt(materialId);
    const material = materialContent[id as keyof typeof materialContent];
    
    if (!material) {
      return (
        <PageLayout>
          <div className="container-custom py-20 text-center">
            <h2 className="text-2xl font-bold mb-4">Material Not Found</h2>
            <p className="mb-6">The learning material you're looking for doesn't exist or has been moved.</p>
            <Button asChild className="bg-lider-red hover:bg-red-700">
              <Link to="/materials">Back to Materials</Link>
            </Button>
          </div>
        </PageLayout>
      );
    }

    return (
      <PageLayout>
        <div className="container-custom py-12">
          <div className="flex flex-col md:flex-row mb-8 items-center md:items-start">
            <Button 
              variant="outline" 
              className="mb-4 md:mb-0 md:mr-4"
              onClick={() => navigate('/materials')}
            >
              Back to Materials
            </Button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">{material.title}</h1>
              <p className="text-gray-400 mt-2">Learning Material</p>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex border-b border-gray-700">
              <button
                className={`px-4 py-2 font-medium text-sm ${activeTab === 'content' ? 'border-b-2 border-lider-red text-white' : 'text-gray-400'}`}
                onClick={() => setActiveTab('content')}
              >
                Content
              </button>
              <button
                className={`px-4 py-2 font-medium text-sm ${activeTab === 'quiz' ? 'border-b-2 border-lider-red text-white' : 'text-gray-400'}`}
                onClick={() => setActiveTab('quiz')}
              >
                Quiz
              </button>
            </div>
          </div>

          {activeTab === 'content' && (
            <Card className="bg-secondary border-gray-800 mb-8">
              <CardContent className="pt-6">
                <div dangerouslySetInnerHTML={{ __html: material.content }} className="prose prose-invert max-w-none prose-headings:font-bold prose-headings:mt-6 prose-headings:mb-4 prose-p:mb-4 prose-ul:mb-4"></div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'quiz' && (
            <Card className="bg-secondary border-gray-800 mb-8">
              <CardContent className="pt-6">
                <h2 className="text-xl font-bold mb-6">Knowledge Check</h2>
                {material.quiz.map((q, i) => (
                  <div key={i} className="mb-6 p-4 border border-gray-700 rounded-lg">
                    <p className="font-medium mb-3">Question {i+1}: {q.question}</p>
                    <div className="space-y-2">
                      {q.options.map((option, j) => (
                        <label key={j} className="flex items-center p-3 rounded-lg hover:bg-gray-800 cursor-pointer">
                          <input 
                            type="radio" 
                            name={`question-${i}`} 
                            value={j} 
                            className="mr-3"
                          />
                          <span>{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
                <div className="flex justify-end">
                  <Button className="bg-lider-red hover:bg-red-700">Submit Answers</Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-between">
            <Button variant="outline">Previous: Introduction</Button>
            <Button className="bg-lider-red hover:bg-red-700">Next: Understanding Your Vehicle</Button>
          </div>
        </div>
      </PageLayout>
    );
  }

  // Otherwise show the list of all materials
  return (
    <PageLayout>
      <PageHeader 
        title="Learning Materials" 
        subtitle="Study for your driver's license with our comprehensive learning materials"
      />
      
      <div className="container-custom py-12">
        {sections.map((section, index) => {
          const isPremiumLocked = section.isPremium && !isSubscribed;
          
          return (
            <div key={section.id} className="mb-10">
              <div className="flex items-center mb-4">
                <h2 className="text-xl font-bold">{section.title}</h2>
                {section.isPremium && (
                  <div className={`ml-3 px-2 py-1 text-xs rounded-full ${
                    isSubscribed 
                      ? 'bg-green-900/30 text-green-400' 
                      : 'bg-yellow-900/30 text-yellow-400'
                  }`}>
                    {isSubscribed ? 'Premium' : 'Premium Only'}
                  </div>
                )}
              </div>
              <p className="text-gray-400 mb-6">{section.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {section.materials.map((material) => (
                  <Card 
                    key={material.id}
                    className={`bg-secondary border-gray-800 ${
                      isPremiumLocked ? 'opacity-75' : 'hover:border-lider-red/50 transition-colors'
                    }`}
                  >
                    <CardContent className="pt-6 relative">
                      {isPremiumLocked && (
                        <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center z-10">
                          <div className="text-center p-4">
                            <Lock size={24} className="mx-auto mb-2 text-yellow-500" />
                            <p className="font-medium mb-2">Premium Content</p>
                            <Button 
                              size="sm" 
                              className="bg-lider-red hover:bg-red-700"
                              onClick={() => navigate('/payments')}
                            >
                              Subscribe to Unlock
                            </Button>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-start">
                        <div className="mr-4 flex-shrink-0">
                          {material.completed ? (
                            <CheckCircle size={24} className="text-green-500" />
                          ) : (
                            <BookOpen size={24} className="text-lider-red" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium mb-2">{material.title}</h3>
                          <div className="flex justify-between items-center">
                            <span className={`text-xs ${
                              material.completed ? 'text-green-500' : 'text-gray-400'
                            }`}>
                              {material.completed ? 'Completed' : 'Not started'}
                            </span>
                            
                            {!isPremiumLocked && (
                              <Button 
                                size="sm" 
                                variant={material.completed ? "outline" : "default"}
                                className={material.completed 
                                  ? "border-green-500/50 text-green-500 hover:text-green-400" 
                                  : "bg-lider-red hover:bg-red-700"}
                                asChild
                              >
                                <Link to={`/materials/${material.id}`}>
                                  {material.completed ? "Review" : "Start"}
                                </Link>
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {section.isPremium && !isSubscribed && index > 0 && (
                <div className="mt-6 p-4 border border-dashed border-yellow-600/40 rounded-lg bg-yellow-900/10 text-center">
                  <div className="flex items-center justify-center mb-3">
                    <AlertCircle size={18} className="text-yellow-500 mr-2" />
                    <span className="font-medium">Premium content requires a subscription</span>
                  </div>
                  <p className="text-gray-300 mb-4 max-w-2xl mx-auto">
                    Subscribe to unlock all learning materials and accelerate your progress toward getting your license.
                  </p>
                  <Button 
                    className="bg-lider-red hover:bg-red-700"
                    onClick={() => navigate('/payments')}
                  >
                    Subscribe Now
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </PageLayout>
  );
};

export default LearningMaterials;
