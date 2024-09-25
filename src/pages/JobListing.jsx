import React, { useEffect, useState } from "react";
import { getJobs } from "@/api/apiJobs";
import useFetch from "@/hooks/useFetch";
import { useUser } from "@clerk/clerk-react";
import { BarLoader } from "react-spinners";
import JobCard from "@/components/JobCard";
import { getCompanies } from "@/api/apiCompanies";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { State } from "country-state-city";

const JobListing = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [company_id, setCompany_id] = useState("");
  const { isLoaded } = useUser();

  const {
    fn: fnJobs,
    data: Jobs,
    loading: loadingJobs,
  } = useFetch(getJobs, { location, company_id, searchQuery });

  // console.log(loadingJobs);

  useEffect(() => {
    if (isLoaded) fnJobs();
  }, [isLoaded, location, company_id, searchQuery]);

  const {
    fn: fnCompanies,
    data: companies,
    loading: loadingCompanies,
  } = useFetch(getCompanies);

  // console.log(companies);

  useEffect(() => {
    if (isLoaded) fnCompanies();
  }, [isLoaded]);

  // filter for companies
  const handleSearch = (e) => {
    e.preventDefault();
    let formData = new FormData(e.target);
    // console.log('====================================');
    // console.log(formData);
    // console.log('====================================');

    const query = formData.get("search-query");
    if (query) setSearchQuery(query);
  };

  // clear filters
  const clearFilters = () => {
    setSearchQuery("");
    setLocation("");
    setCompany_id("");
  };

  if (!isLoaded) {
    return <BarLoader className="mb-4" width={"100%"} color="#d73636" />;
  }

  return (
    <div>
      <div className="gradient-title font-extrabold text-6xl sm:text-7xl text-center pb-8">
        Latest Jobs
      </div>

      {/* add filters here */}
      <form
        onSubmit={handleSearch}
        className="flex items-center gap-5 w-full flex-col sm:flex-row"
      >
        <Input
          type="text"
          placeholder="Search jobs by title..."
          name="search-query"
          className="h-full flex-1 px-4 text-md"
        />
        <Button varient="blue" type="submit" className="h-full sm:w-28">
          Search
        </Button>
      </form>

      {loadingJobs && (
        <BarLoader className="mt-4" width={"100%"} color="#d73636" />
      )}

      <div className="flex flex-col sm:flex-row gap-5 my-5 items-center">
        <Select value={location} onValueChange={(value) => setLocation(value)}>
          <SelectTrigger>
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

        <Select
          value={company_id}
          onValueChange={(value) => setCompany_id(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter By Company" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {companies?.map((company, index) => (
                <SelectItem key={index} value={company.id}>
                  {company.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Button
          variant="destructive"
          className="h-full sm:w-1/2"
          onClick={clearFilters}
        >
          Clear Filters
        </Button>
      </div>

      {loadingJobs === false && (
        <div className="mt-8 grid md:grid-cols-2 gap-4">
          {Jobs?.length
            ? Jobs.map((job, index) => (
                <JobCard
                  key={index}
                  job={job}
                  savedInit={job?.saved?.length > 0}
                />
              ))
            : "No jobs found"}
        </div>
      )}
    </div>
  );
};

export default JobListing;
