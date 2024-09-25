import { getSingleJob, updateHiringStatus } from "@/api/apiJobs";
import useFetch from "@/hooks/useFetch";
import { useUser } from "@clerk/clerk-react";
import MDEditor from "@uiw/react-md-editor";
import { BriefcaseIcon, DoorClosed, DoorOpen, MapPinIcon } from "lucide-react";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { BarLoader } from "react-spinners";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ApplyJobDrawer from "@/components/applyjob";
import ApplicationCard from "@/components/ApplicationCard";

const JobPage = () => {
  const { user, isLoaded } = useUser();
  const { id } = useParams();

  const {
    fn: fnJobData,
    loading: loadingJobData,
    data: jobsData,
  } = useFetch(getSingleJob, { job_id: id });

  // update
  const {
    fn: fnHiringStatus,
    loading: loadingHiringStatus,
    data: hiringStatus,
  } = useFetch(updateHiringStatus, { job_id: id });

  const statusChange = (value) => {
    const isOpen = value === "open";
    fnHiringStatus(isOpen).then(() => fnJobData());
  };

  // console.log('====================================');
  // console.log(jobsData);
  // console.log('====================================');

  useEffect(() => {
    if (isLoaded) fnJobData();
  }, [isLoaded]);

  if (!isLoaded || loadingJobData) {
    return <BarLoader className="mt-4" width={"100%"} color="#d73636" />;
  }

  return (
    <div className="flex flex-col gap-8 mt-5 bg-transparent text-white p-5 rounded-lg shadow-lg">
      <div className="flex flex-col-reverse gap-6 md:flex-row justify-between items-center">
        <h1 className="gradient-title font-extrabold pb-3 text-4xl sm:text-6xl text-center">
          {jobsData?.title}
        </h1>
        <img
          src={jobsData?.company?.logo_url}
          alt={jobsData?.title}
          className="h-12"
        />
      </div>
      <hr className="border-gray-600" />
      <div className="flex justify-between">
        <div className="flex items-center gap-2">
          <MapPinIcon className="text-gray-400" />
          {jobsData?.location}
        </div>
        <div className="flex items-center gap-2">
          <BriefcaseIcon className="text-gray-400" />
          {jobsData?.applications?.length} Applicants
        </div>
        <div className="flex items-center gap-2">
          {jobsData?.isOpen ? (
            <>
              <DoorOpen className="text-green-400" />
              Open
            </>
          ) : (
            <>
              <DoorClosed className="text-red-400" />
              Closed
            </>
          )}
        </div>
      </div>
      <hr />

      {/* hiring status */}
      {loadingHiringStatus && (
        <BarLoader className="mt-4" width={"100%"} color="#d73636" />
      )}

      {jobsData?.recruiter_id === user?.id && (
        <Select onValueChange={statusChange}>
          <SelectTrigger
            className={`w-full ${jobsData?.isOpen ? "bg-green-950" : "bg-red-950"
              }`}
          >
            <SelectValue
              placeholder={
                "Hiring Status" + (jobsData?.isOpen ? " - Open" : " - Closed")
              }
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={"open"}> Open </SelectItem>
            <SelectItem value={"closed"}>Closed </SelectItem>
          </SelectContent>
        </Select>
      )}

      <div className="flex flex-col gap-8 md:flex-row bg-transparent md:p-5">
        <div className="flex-1 md:p-4 bg-black bg-opacity-50 rounded-lg shadow-md">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            About the Job
          </h2>
          <p className="mt-2 text-lg text-gray-300">{jobsData?.description}</p>
        </div>

        <div className="flex-1 p-4 bg-black bg-opacity-50 rounded-lg shadow-md">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            What We Are Looking For!
          </h2>
          <ul className="list-disc pl-5 mt-2 text-gray-300">
            {jobsData?.requirements
              ?.split("\n")
              .slice(1)
              .map((requirement, index) => (
                <li key={index} className="mb-1">
                  {requirement}
                </li>
              ))}
          </ul>
        </div>
      </div>
      {/* render application */}
      {jobsData?.recruiter_id !== user?.id && (
        <ApplyJobDrawer
          job={jobsData}
          user={user}
          fetchJob={fnJobData}
          applied={jobsData?.applications?.find(
            (ap) => ap?.candidate_id === user?.id
          )}
        />
      )}

      {jobsData?.applications?.length > 0 &&
        jobsData?.recruiter_id === user?.id && (
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl sm:text-3xl font-bold">Applications</h2>
            {jobsData?.applications.map((application) => (
              <ApplicationCard key={application.id} application={application} />
            ))}
          </div>
        )}
    </div>
  );
};

export default JobPage;
