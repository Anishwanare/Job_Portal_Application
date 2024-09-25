import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Link } from "react-router-dom";
import companies from "../data/companies.json"
import faqs from "../data/faq.json"
import Autoplay from "embla-carousel-autoplay"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const LandingPage = () => {
  return (
    <main className="flex flex-col gap-10 sm:gap-20 py-10 sm:py-20">
      <section className="text-center">
        <h1 className="flex flex-col items-center justify-center gradient-title text-4xl font-extrabold sm:text-6xl lg:text-7xl tracking-tighter py-4">
          Discover Your Next Career Move{" "}
          <span className="flex items-center gap-2 lg:gap-6">
            Opportunities Await at{" "}
            <img
              src="logo.png"
              className="h-14 sm:h-24 lg:h-32 "
              alt="careercove"
            />
          </span>
        </h1>
        <p className="text-gray-300 sm:mt-4 text-xs sm:text-xl">Explore thousands of job listings or find the perfect candidate</p>
      </section>
      <div className="flex gap-6 justify-center">
        {/* buttons */}
        <Link to={"/jobs"}><Button variant="blue" size="xl" >Explore Jobs</Button></Link>
        <Link to={"/post-jobs"}><Button variant="destructive" size="xl" >Post a Jobs</Button></Link>
      </div>
      {/* carousel */}
      <Carousel
        plugins={[Autoplay({ delay: 2000 })]}
        className="w-full py-10"
      >
        <CarouselContent className="flex gap-5 sm:gap-20 items-center">
          {companies.map((item, index) => (
            <CarouselItem key={index} className="basis-1/3 lg:basis-1/6">
              <img src={item.path} alt={item.name} className="h-9 sm:h-14 object-contain " />
            </CarouselItem>
          ))}
        </CarouselContent>
        {/* <CarouselPrevious />
        <CarouselNext /> */}
      </Carousel>


      {/* banner */}
      <img src="/banner.jpeg" alt="banner" className="w-full" />

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className=" text-3xl font-extrabold">For Job Seekers</CardTitle>
            <CardDescription>Your Career Starts Here</CardDescription>
          </CardHeader>
          <CardContent>
            Explore job opportunities, apply with ease, and track your application status in real-time.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className=" text-3xl font-extrabold">For Employers</CardTitle>
            <CardDescription>Find the Right Talent</CardDescription>
          </CardHeader>
          <CardContent>
            Post job openings, review applications, and connect with the best candidates efficiently.
          </CardContent>
        </Card>
      </section>


      {/* accordion */}

      <Accordion type="single" collapsible>
        {faqs.map((item, index) => (
          <>
            <AccordionItem value={`item-${index + 1}`} key={index}>
              <AccordionTrigger key={index}>{item.question}</AccordionTrigger>
              <AccordionContent key={index}>{item.answer}</AccordionContent>
            </AccordionItem>
          </>
        ))}
      </Accordion>
    </main>
  );
};

export default LandingPage;

