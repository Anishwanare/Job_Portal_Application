import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Heart, MapPinIcon, Trash2Icon } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { deleteMyJobs, saveJobs } from "@/api/apiJobs";
import useFetch from "@/hooks/useFetch";
import { BarLoader } from "react-spinners";

const JobCard = ({
    job,
    isMyJob = false,
    savedInit = false,
    onJobSaved = () => { },
}) => {

    const [saved, setSaved] = useState(savedInit)

    const {
        fn: fnSavedJobs,
        data: savedJobs,
        loading: loadingSavedJobs,
    } = useFetch(saveJobs, {
        alredySave: saved
    })

    console.log("saved Data", savedJobs);


    const { user } = useUser();

    const handleSaveJob = async () => {
        await fnSavedJobs({
            user_id: user.id,
            job_id: job.id,
        });
        onJobSaved();
    }

    const { loading: loadingDeleteJob,fn: fnDeleteJob } = useFetch(deleteMyJobs, { job_id: job.id })



    const handleDeleteJob = async () => {
        await fnDeleteJob()
        onJobSaved();
    }

    

    useEffect(() => {
        if (savedJobs !== undefined) setSaved(savedJobs?.length > 0)
    }, [savedJobs])



    return (
        <Card>
            {loadingDeleteJob && <BarLoader className="mb-4" width={"100%"} color="#d73636" />}
            <CardHeader>
                <CardTitle className="flex justify-between font-bold">
                    {job.title}
                    {isMyJob && (
                        <Trash2Icon
                            fill="red"
                            size={18}
                            className="text-red-300 cursor-pointer"
                            onClick={handleDeleteJob}
                        />
                    )}
                </CardTitle>
            </CardHeader>

            <CardContent className="flex flex-col gap-4 flex-1">
                <div className="flex justify-between ">
                    {job.company && job.company.logo_url && (
                        <img
                            src={job.company.logo_url}
                            alt={`${job.company.name} logo`}
                            className="h-6"
                        />
                    )}
                    <div className="flex items-center gap-2">
                        <MapPinIcon size={15} />
                        {job.location}
                    </div>
                </div>
                <hr />
                {/* {job.description.substring(0, job?.description?.indexOf("."))} */}
                {job.description}
            </CardContent>

            <CardFooter className="flex gap-2">
                <Link to={`/job/${job.id}`} className="flex-1">
                    <Button varient="secondary" classname="w-full">
                        More Details
                    </Button>
                </Link>


                {!isMyJob && (
                    <Button varient="outline" className="w-15" onClick={handleSaveJob} disabled={loadingSavedJobs}>
                        {saved ? < Heart size={20} str="red" fill="red" /> : < Heart size={20} />}
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
};

export default JobCard;
