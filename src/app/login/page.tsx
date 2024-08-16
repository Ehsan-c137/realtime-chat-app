"use client";

import { FC, useState } from "react";
import Button from "@/components/ui/Button";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";
import { Icons } from "@/components/Icon";
import style from "./login.module.css";

const Page: FC = () => {
   const [isLaoding, setIsLoading] = useState(false);

   const loginWithGoogle = async () => {
      setIsLoading(true);
      try {
         await signIn("google");
      } catch (error) {
         toast.error("something went wrong");
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <>
         <div
            className={`${style.background} flex min-h-screen items-center justify-center py-12 px-4 sm:px-6 lg:px-8`}
         >
            <div className="w-full flex flex-col items-center max-w-md space-y-8">
               <div className="flex flex-col items-center gap-8">
                  <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-white">
                     Sign in to your account
                  </h2>
               </div>
               <Button
                  onClick={loginWithGoogle}
                  isLoading={isLaoding}
                  variant={"ghost"}
                  className="max-w-sm mx-auto w-full bg-blue-500"
                  type="button"
               >
                  <Icons.GoogleIcon />
                  Sign in with Google
               </Button>
            </div>
         </div>
      </>
   );
};

export default Page;
