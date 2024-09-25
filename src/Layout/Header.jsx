import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useSearchParams } from "react-router-dom";
import {
    SignedIn,
    SignedOut,
    SignIn,
    SignInButton,
    UserButton,
    useUser,
} from "@clerk/clerk-react";
import { BriefcaseBusiness, Heart, PenBox } from "lucide-react";

const Header = () => {
    const [showSignIn, setShowSignIn] = useState(false);
    const { user, isLoaded } = useUser()

    // when user go on any page automatically sigin page will appear
    const [search, setSearch] = useSearchParams();
    useEffect(() => {
        if (search.get("sign-in")) {
            setShowSignIn(true);
        }
    }, [search])
    // 

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            setShowSignIn(false);
            setSearch({})
        }
    }

    // this disable scroll effect when click on login
    useEffect(() => {
        if (showSignIn) {
            document.body.style.overflow = 'hidden';
        }
        else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        }
    }, [showSignIn])
    return (
        <>
            <nav className="py-4 flex justify-between items-center">
                <Link to={"/"}>
                    <img src="/logo.png" alt="careercove" className="h-20" />
                </Link>

                <div className="flex gap-8">
                    <SignedOut>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setShowSignIn(true);
                            }}
                        >
                            Login
                        </Button>
                    </SignedOut>
                    <SignedIn>
                        {/* add a condition here only recruter can post job */}
                        {user?.unsafeMetadata?.role === "recruiter" && <Link to={"/post-jobs"}>
                            <Button variant="destructive" className="rounded-full">
                                {" "}
                                <PenBox size={20} className="mr-2" /> Post Jobs
                            </Button>
                        </Link>}
                        <UserButton appearance={{
                            elements: {
                                avatarBox: "w-10 h-10"
                            }
                        }} >

                            <UserButton.MenuItems>
                                <UserButton.Link
                                    label="My Jobs"
                                    labelIcon={<BriefcaseBusiness size={15} />}
                                    href="my-jobs"
                                />
                            </UserButton.MenuItems>
                            <UserButton.MenuItems>
                                <UserButton.Link
                                    label="Saved Jobs"
                                    labelIcon={<Heart size={15} />}
                                    href="saved-jobs"
                                />
                            </UserButton.MenuItems>
                        </UserButton>
                    </SignedIn>
                </div>
            </nav>

            {showSignIn && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" onClick={handleOverlayClick}>
                    <SignIn
                        signUpForceRedirectUrl="/on-boarding"
                        fallbackRedirectUrl="/on-boarding"
                    />
                </div>
            )}
        </>
    );
};

export default Header;
