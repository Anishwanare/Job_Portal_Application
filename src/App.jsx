import React, { Suspense, lazy } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "./Layout/AppLayout";
import "./App.css";
import { ThemeProvider } from "./components/theme-provider";
import JobPage from "./pages/JobPage";
import ProtectedRoute from "./Layout/ProtectedRoute";
import { BarLoader } from "react-spinners";

// Lazy load components
const LandingPage = lazy(() => import("./pages/LandingPage"));
const OnBoarding = lazy(() => import("./pages/OnBoarding"));
const JobListing = lazy(() => import("./pages/JobListing"));
const Jobs = lazy(() => import("./pages/Jobs"));
const MyJobs = lazy(() => import("./pages/MyJobs"));
const PostJobs = lazy(() => import("./pages/PostJobs"));
const SavedJobs = lazy(() => import("./pages/SavedJobs"));
const NotFound = lazy(() => import("./pages/NotFound"));

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: (
          <Suspense fallback={<BarLoader/>}>
            <LandingPage />
          </Suspense>
        ),
      },
      {
        path: "/on-boarding",
        element: (
          <ProtectedRoute>
            <Suspense fallback={<BarLoader/>}>
              <OnBoarding />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "/jobs",
        element: (
          <ProtectedRoute>
            <Suspense fallback={<BarLoader/>}>
              <JobListing />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "/myjobs/:id",
        element: (
          <ProtectedRoute>
            <Suspense fallback={<BarLoader/>}>
              <Jobs />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "/my-jobs",
        element: (
          <ProtectedRoute>
            <Suspense fallback={<BarLoader/>}>
              <MyJobs />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "/job/:id",
        element: (
          <ProtectedRoute>
            <Suspense fallback={<BarLoader/>}>
              <JobPage />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "/post-jobs",
        element: (
          <ProtectedRoute>
            <Suspense fallback={<BarLoader/>}>
              <PostJobs />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "/saved-jobs",
        element: (
          <ProtectedRoute>
            <Suspense fallback={<BarLoader/>}>
              <SavedJobs />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "*",
        element: (
          <Suspense fallback={<BarLoader/>}>
            <NotFound />
          </Suspense>
        ),
      },
    ],
  },
]);

const App = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  );
};

export default App;
