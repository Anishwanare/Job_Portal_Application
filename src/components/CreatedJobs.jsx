import { getMyJobs } from '@/api/apiJobs'
import useFetch from '@/hooks/useFetch'
import { useUser } from '@clerk/clerk-react'
import React, { useEffect } from 'react'
import { BarLoader } from 'react-spinners'
import JobCard from './JobCard'

const CreatedJobs = () => {
    const { user } = useUser()

    const { loading: loadingCreatedJobs, data: createdJobs, fn: fnCreatedJobs } = useFetch(getMyJobs, { recruiter_id: user.id, })

    useEffect(() => {
        fnCreatedJobs()
    }, [])

    if (loadingCreatedJobs) {
        return <BarLoader className="mb-4" width={"100%"} color="#d73636" />;
    }
    return (
        <div>
            <div className="mt-8 grid md:grid-cols-2 gap-4">
          {createdJobs?.length
            ? createdJobs.map((job, index) => (
                <JobCard
                  key={index}
                  job={job}
                  onJobSaved={fnCreatedJobs}
                  isMyJob
                />
              ))
            : "No jobs found"}
        </div>
        </div>
    )
}

export default CreatedJobs
