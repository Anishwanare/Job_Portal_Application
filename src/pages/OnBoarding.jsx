import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { BarLoader } from 'react-spinners';

const OnBoarding = () => {
  const { user, isLoaded } = useUser();
  const [recruiterLoading, setRecruiterLoading] = useState(false);
  const [candidateLoading, setCandidateLoading] = useState(false);

  const navigate = useNavigate();
  
  useEffect(() => {
    if (user?.unsafeMetadata?.role) {
      navigate(user?.unsafeMetadata?.role === 'recruiter' ? '/post-jobs' : '/jobs');
    }
  }, [user, navigate]);


  if (!isLoaded) {
    return <BarLoader className='mb-4' width={'100%'} color='#d73636' />;
  }

  const handleRoleSelection = async (role) => {
    try {
      await user.update({
        unsafeMetadata: { role },
      });
      navigate(role === 'recruiter' ? '/post-jobs' : '/jobs');
    } catch (err) {
      console.error('Error updating role', err);
      setRecruiterLoading(false);
      setCandidateLoading(false);
    }
  };


  return (
    <div className='flex flex-col items-center justify-center mt-32'>
      <h2 className='gradient-title font-extrabold text-7xl sm:text-8xl tracking-tighter'>I am a ....</h2>
      <div className='mt-16 grid grid-cols-2 gap-4 w-full md:px-40'>
        <Button
          variant='blue'
          className='h-32 text-2xl'
          onClick={() => {
            handleRoleSelection('candidate');
            setCandidateLoading(true);
          }}
          disabled={candidateLoading || recruiterLoading}
        >
          {!candidateLoading ? 'Candidate' : 'Loading...'}
        </Button>
        <Button
          variant='destructive'
          className='h-32 text-2xl'
          onClick={() => {
            handleRoleSelection('recruiter');
            setRecruiterLoading(true);
          }}
          disabled={candidateLoading || recruiterLoading}
        >
          {!recruiterLoading ? 'Recruiter' : 'Loading...'}
        </Button>
      </div>
    </div>
  );
};

export default OnBoarding;
