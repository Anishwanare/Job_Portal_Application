import supabaseClient, { supabaseUrl } from "@/utils/supabase";

export const applyToJob = async (token, _, jobData) => {
    const supabase = await supabaseClient(token);

    const random = Math.floor(Math.random() * 90000)
    const fileName = `resume-${random}-${jobData.candidate_id}`

    const { error: storageError } = await supabase.storage.from("resumes").upload(fileName, jobData.resume)

    if (storageError) {
        console.error("Error uploading resumes ", storageError);
        return null;
    }


    const resume = `${supabaseUrl}/storage/v1/object/public/resumes/${fileName}`


    const { data, error } = await supabase
        .from("applications")
        .insert([{
            ...jobData, resume
        }])
        .select()

    if (error) {
        console.error("Error submitting applications ", error);
        return null;
    }

    return data;
}


export const upadateApplicationStatus = async (token, { job_id }, status) => {

    const supabase = await supabaseClient(token)

    const { data, error } = await supabase
        .from("applications")
        .update({ status })
        .eq("jobs_id", job_id)
        .select()


    console.log("Data:", data);
    console.log("Error:", error);

    if (error || data.length === 0) {
        console.error("Error updating application status ", error)
        return null
    }

    return data
}


export const getApplications = async (token, user_id) => {

    const supabase = await supabaseClient(token)

    const { data, error } = await supabase
        .from("applications")
        .select("*,job:jobs(title,company:companies(name))")
        .eq("candidate_id", user_id)


    if (error) {
        console.error("Error fetching applications", error)
        return null
    }

    return data
}

