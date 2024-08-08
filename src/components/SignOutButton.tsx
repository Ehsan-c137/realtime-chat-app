"use client";

import { ButtonHTMLAttributes } from "react";
import Button from "./ui/Button";
import { useState } from "react";
import { signOut } from "next-auth/react";
import toast from "react-hot-toast";
import { Loader2, LogOut } from "lucide-react";
import { Icons } from "@/components/Icon";
import { revalidatePath } from "next/cache";

interface SignOutButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

const SignOutButton = ({ ...props }) => {
   const [isSigningOut, setIsSigningOut] = useState<boolean>(false);

   const handleSignout = async () => {
      setIsSigningOut(true);
      try {
         await signOut();
         revalidatePath("/dashboard");
      } catch (error) {
         toast.error((error as Error).message);
      } finally {
         setIsSigningOut(false);
      }
   };

   return (
      <Button {...props} variant={"ghost"} onClick={handleSignout}>
         {isSigningOut ? (
            <Loader2 className="w-4 h-4 animate-spin" />
         ) : (
            <LogOut className="w-4 h-4" />
         )}
      </Button>
   );
};

export default SignOutButton;
