import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/textarea'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Schema, z } from 'zod'
import { State } from "country-state-city";
import useFetch from '@/hooks/useFetch'
import { useUser } from '@clerk/clerk-react'
import { BarLoader } from 'react-spinners'
import { getCompanies } from '@/api/apiCompanies'
import { Navigate, useNavigate } from 'react-router-dom'
import MDEditor from '@uiw/react-md-editor'
import { Button } from '@/components/ui/button'
import { addNewJobs } from '@/api/apiJobs'
import AddCompanyDrawer from '@/components/AddCompanyDrawer'



const schema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  location: z.string().min(1, { message: "Location is required" }),
  company_id: z.string().min(1, { message: "Select or add a company" }),
  requirements: z.string().min(1, { message: "Requirements are required" }),
})

const PostJobs = () => {

  const { isLoaded, user } = useUser()
  const navigate = useNavigate();

  const { register, control, handleSubmit, formState: { errors }, } = useForm({
    defaultValues: {
      location: "",
      company_id: "",
      requirements: "",
    },
    resolver: zodResolver(schema)
  })


  const {
    fn: fnCompanies,
    data: companies,
    loading: loadingCompanies,
  } = useFetch(getCompanies);

  // console.log(companies);


  useEffect(() => {
    if (isLoaded) fnCompanies();
  }, [isLoaded]);


  const { loading: loadingCreateJob, errors: errorCreateJob, data: dataCreateJob, fn: fnCreateJob } = useFetch(addNewJobs)

  const onSubmit = (data) => {
    fnCreateJob({
      ...data,
      recruiter_id: user.id,
      isOpen: true
    })
  }

  useEffect(()=>{
    if(dataCreateJob?.length > 0 ) navigate("/jobs")
  },[loadingCreateJob])


  if (!isLoaded || loadingCompanies) {
    return <BarLoader className='mt-4' width={'100%'} color='#d73636' />
  }

  if (user?.unsafeMetadata?.role !== "recruiter") {
    return <Navigate to="/jobs" />
  }


  return (
    <div>
      <h1 className='gradient-title font-extrabold text-5xl sm:text-7xl text-center pb-8'>Post a job</h1>
      <form className='flex flex-col gap-4 p-4 pb-0' onSubmit={handleSubmit(onSubmit)}>
        <Input placeholder='Job Title' {...register("title")} />
        {errors.title && <p className='text-red-500'>{errors.title.message}</p>}

        <Textarea placeholder='Job Description' {...register("description")} />
        {errors.description && <p className='text-red-500'>{errors.description.message}</p>}

        <div className='flex gap-4 items-center'>
          <Controller
            name="location"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={field.onChange}
              >
                <SelectTrigger >
                  <SelectValue placeholder="Filter By Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {State.getStatesOfCountry("IN")?.map((state, index) => (
                      <div key={index}>
                        <SelectItem value={state.name}>{state.name}</SelectItem>
                      </div>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />

          <Controller
            name="company_id"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={field.onChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter By Company" >
                    {field.value ? companies?.find((comp) => comp.id === Number(field.value))?.name : "Company"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {companies?.map((company, index) => (
                      <SelectItem key={index} value={company.id}>{company.name}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )} />

          {/* add company drawer */}
          <AddCompanyDrawer fetchCompany={fnCompanies}/>
        </div>
        {errors.location && (
          <p className='text-red-500'>{errors.location.message}</p>
        )}
        {errors.company_id && (
          <p className='text-red-500'>{errors.company_id.message}</p>
        )}

        <Controller
          name="requirements"
          control={control}
          render={({ field }) => (
            <MDEditor value={field.value} onChange={field.onChange} />
          )} />
        {
          errors.requirements && <p className='text-red-500'>{errors.requirements.message}</p>
        }
        {
          errorCreateJob?.message && <p className='text-red-500'>{errorCreateJob?.message}</p>
        }
        {loadingCreateJob && <BarLoader width={"100%"} color='#d73636' />}
        <Button type="submit" variant="blue" size="lg" className="mt-2"> Submit</Button>
      </form >
    </div >
  )
}

export default PostJobs
