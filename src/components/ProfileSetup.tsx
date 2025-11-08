import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ArrowLeft, ArrowRight, Upload, X, AlertCircle } from 'lucide-react';
import { ProfileFormData } from '../types';
import { authAPI } from '../services/api';
import { commonSkills, interests } from '../utils/mockData';
import CrewlyXLogo from './CrewlyXLogo';

interface Props {
  onComplete: (userData: any) => void;
}

type Step = 'basic' | 'photo' | 'skills' | 'preferences' | 'bio';

const ProfileSetup = ({ onComplete }: Props) => {
  const [currentStep, setCurrentStep] = useState<Step>('basic');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<ProfileFormData>({
    defaultValues: {
      skills: [],
      interests: [],
      lookingFor: 'any',
      availability: 'flexible'
    }
  });

  const steps: { key: Step; title: string; description: string }[] = [
    { key: 'basic', title: 'Basic Info', description: 'Tell us about yourself' },
    { key: 'photo', title: 'Profile Photo', description: 'Add your profile picture' },
    { key: 'skills', title: 'Skills', description: 'What are you good at?' },
    { key: 'preferences', title: 'Preferences', description: 'What are you looking for?' },
    { key: 'bio', title: 'About You', description: 'Tell your story' },
  ];

  const currentStepIndex = steps.findIndex(step => step.key === currentStep);
  const isLastStep = currentStepIndex === steps.length - 1;

  const handleNext = () => {
    if (isLastStep) return;
    setCurrentStep(steps[currentStepIndex + 1].key);
  };

  const handlePrevious = () => {
    if (currentStepIndex === 0) return;
    setCurrentStep(steps[currentStepIndex - 1].key);
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64 = await fileToBase64(file);
        setPhotoPreview(base64);
        setValue('profilePhoto', file);
      } catch (error) {
        console.error('Error converting file to base64:', error);
      }
    }
  };

  const toggleSkill = (skill: string) => {
    const updated = selectedSkills.includes(skill) 
      ? selectedSkills.filter(s => s !== skill)
      : [...selectedSkills, skill];
    setSelectedSkills(updated);
    setValue('skills', updated);
  };

  const toggleInterest = (interest: string) => {
    const updated = selectedInterests.includes(interest) 
      ? selectedInterests.filter(i => i !== interest)
      : [...selectedInterests, interest];
    setSelectedInterests(updated);
    setValue('interests', updated);
  };

  const onSubmit = async (data: ProfileFormData) => {
    try {
      setError('');
      setLoading(true);
      
      const userData = {
        name: data.name,
        email: data.email || '',
        age: Number(data.age),
        bio: data.bio || '',
        skills: selectedSkills,
        location: data.location || '',
        interests: selectedInterests,
        lookingFor: data.lookingFor || 'any',
        availability: data.availability || 'flexible',
        experience: data.experience || '',
        profilePhoto: photoPreview || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face'
      };

      // Call the onComplete with user data
      await onComplete(userData);
    } catch (error: any) {
      setError(error.message || 'Error creating profile. Please try again.');
      console.error('Error creating user:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'basic':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
              <input
                {...register('name', { required: 'Name is required' })}
                type="text"
                className="w-full px-4 py-3 bg-navy-800/80 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                placeholder="Enter your full name"
              />
              {errors.name && <p className="text-accent-400 text-sm mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email (Optional)</label>
              <input
                {...register('email', { 
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
                type="email"
                className="w-full px-4 py-3 bg-navy-800/80 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                placeholder="your@email.com (optional)"
              />
              {errors.email && <p className="text-accent-400 text-sm mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Age</label>
              <input
                {...register('age', { 
                  required: 'Age is required',
                  min: { value: 16, message: 'Must be at least 16 years old' },
                  max: { value: 100, message: 'Must be less than 100 years old' }
                })}
                type="number"
                className="w-full px-4 py-3 bg-navy-800/80 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                placeholder="25"
              />
              {errors.age && <p className="text-accent-400 text-sm mt-1">{errors.age.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
              <input
                {...register('location')}
                type="text"
                className="w-full px-4 py-3 bg-navy-800/80 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                placeholder="San Francisco, CA"
              />
            </div>
          </div>
        );

      case 'photo':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="relative inline-block">
                {photoPreview ? (
                  <div className="relative">
                    <img
                      src={photoPreview}
                      alt="Profile preview"
                      className="w-32 h-32 rounded-full object-cover border-4 border-primary-500"
                    />
                    <button
                      onClick={() => {
                        setPhotoPreview('');
                        setValue('profilePhoto', null);
                      }}
                      className="absolute -top-2 -right-2 w-8 h-8 bg-accent-500 rounded-full flex items-center justify-center text-white hover:bg-accent-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="w-32 h-32 rounded-full bg-navy-800/80 border-2 border-dashed border-gray-600/50 flex items-center justify-center">
                    <Upload className="w-8 h-8 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="mt-4">
                <label className="btn-primary cursor-pointer inline-flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  {photoPreview ? 'Change Photo' : 'Upload Photo'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                </label>
              </div>
              <p className="text-gray-400 text-sm mt-2">
                Choose a clear photo that shows your face. This helps others connect with you.
              </p>
            </div>
          </div>
        );

      case 'skills':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Select your skills</h3>
              <p className="text-gray-400 mb-6">Choose the skills that best represent your expertise</p>
              <div className="flex flex-wrap gap-2 max-h-80 overflow-y-auto">
                {commonSkills.map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    className={`px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      selectedSkills.includes(skill)
                        ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white'
                        : 'bg-navy-800/80 border border-gray-600/50 text-gray-300 hover:bg-navy-700/80 hover:border-gray-500/50'
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
              <p className="text-gray-400 text-sm mt-4">
                Selected: {selectedSkills.length} skills
              </p>
            </div>
          </div>
        );

      case 'preferences':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">What are you looking for?</label>
              <select
                {...register('lookingFor')}
                className="w-full px-4 py-3 bg-navy-800/80 border border-gray-600/50 rounded-xl text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
              >
                <option value="any">Open to anything</option>
                <option value="co-founder">Co-founder</option>
                <option value="hackathon-partner">Hackathon partner</option>
                <option value="project-collaborator">Project collaborator</option>
                <option value="mentor">Mentor</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Availability</label>
              <select
                {...register('availability')}
                className="w-full px-4 py-3 bg-navy-800/80 border border-gray-600/50 rounded-xl text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
              >
                <option value="flexible">Flexible</option>
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="weekends">Weekends only</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Experience Level</label>
              <input
                {...register('experience')}
                type="text"
                className="w-full px-4 py-3 bg-navy-800/80 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                placeholder="e.g., 3 years, Beginner, Expert"
              />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Interests</h3>
              <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto">
                {interests.map((interest) => (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={`px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      selectedInterests.includes(interest)
                        ? 'bg-accent-500 text-white'
                        : 'bg-navy-800/80 border border-gray-600/50 text-gray-300 hover:bg-navy-700/80 hover:border-gray-500/50'
                    }`}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 'bio':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Tell us about yourself</label>
              <textarea
                {...register('bio')}
                rows={6}
                className="w-full px-4 py-3 bg-navy-800/80 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none transition-all duration-200"
                placeholder="Share your background, what you're passionate about, and what kind of projects you'd like to work on..."
              />
              <p className="text-gray-400 text-sm mt-2">
                This helps others understand who you are and what you're looking to build.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen py-12 px-6 relative">
      <div className="absolute top-6 left-6 z-50">
        <CrewlyXLogo size="md" />
      </div>

      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 pt-16">
          <h1 className="text-3xl font-bold text-white mb-2">Create Your Profile</h1>
          <p className="text-gray-400">Let's get you set up to find amazing collaborators</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-400">Step {currentStepIndex + 1} of {steps.length}</span>
            <span className="text-sm text-gray-400">{Math.round(((currentStepIndex + 1) / steps.length) * 100)}%</span>
          </div>
          <div className="w-full bg-navy-800/50 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-primary-500 to-accent-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="card-glow rounded-2xl p-8 mb-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">{steps[currentStepIndex].title}</h2>
            <p className="text-gray-400">{steps[currentStepIndex].description}</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-300 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-200">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            {renderStepContent()}

            {/* Navigation */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-700/50">
              <button
                type="button"
                onClick={handlePrevious}
                disabled={currentStepIndex === 0}
                className="btn-secondary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </button>

              {isLastStep ? (
                <button
                  type="submit"
                  className="btn-primary flex items-center gap-2"
                  disabled={loading}
                >
                  {loading ? 'Creating...' : 'Complete Profile'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNext}
                  className="btn-primary flex items-center gap-2"
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;