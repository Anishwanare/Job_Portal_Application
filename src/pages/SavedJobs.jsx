import { getSavedJobs } from '@/api/apiJobs'
import JobCard from '@/components/JobCard'
import useFetch from '@/hooks/useFetch'
import { useUser } from '@clerk/clerk-react'
import React, { useEffect } from 'react'
import { BarLoader } from 'react-spinners'

const SavedJobs = () => {
  const {isLoaded} = useUser()

  const { loading: loadingSavedJobs, data: savedJobs, fn: fnSavedJobs } = useFetch(getSavedJobs)

  useEffect(()=>{
    if (isLoaded) fnSavedJobs()
  },[isLoaded])

  if (!isLoaded || loadingSavedJobs) {
    return <BarLoader className='mb-4' width={'100%'} color='#d73636' />;
  }

  return (
    <div>
      <h1 className='gradient-title font-extrabold text-6xl sm:text-7xl text-center pb-8'>Saved Jobs</h1>

      {loadingSavedJobs === false && (
        <div className="mt-8 grid md:grid-cols-2 gap-4">
          {savedJobs?.length ? savedJobs.map((saved, index) => (
            <JobCard key={index} job={saved?.job} savedInit={true} onJobSaved={fnSavedJobs} />
          )) : ("No saved Jobs found")}
        </div>
      )}
    </div>
  )
}

export default SavedJobs
