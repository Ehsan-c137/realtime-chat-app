"use client";

import { useEffect, useState } from "react";
import {
   Dialog,
   DialogBackdrop,
   DialogPanel,
   DialogTitle,
   TransitionChild,
} from "@headlessui/react";
import { SidebarOption } from "@/types/typing";
import { X } from "lucide-react";
import { type Session } from "next-auth";
import Button from "./ui/Button";
import SignOutButton from "./SignOutButton";
import FriendRequestSidebarOptions from "./FriendRequestSidebarOption";
import SidebarChatList from "./SidebarChatList";
import { type Icon, Icons } from "@/components/Icon";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";
import styles from "./MobileChatLayout.module.css";

interface IProps {
   friends: User[];
   session: Session;
   sidebarOptions: SidebarOption[];
   unseenRequestCount: number;
}

export default function MobileChatLayout({
   friends,
   session,
   sidebarOptions,
   unseenRequestCount,
}: IProps) {
   const [open, setOpen] = useState(false);
   const pathname = usePathname();

   useEffect(() => {
      setOpen(false);
   }, [pathname]);

   return (
      <div className="fixed z-10 bg-zinc-50 border-zinc-200 top-0 w-full inset-x-0 py-2 px-4">
         <div className="sticky top-0 left-0 px-4  w-full flex justify-between items-center text-black">
            <button
               className={`${styles.menu} ${open ? styles.opened : ""}`}
               onClick={() => setOpen(true)}
               aria-label="Main Menu"
            >
               <svg width="45" height="45" viewBox="0 0 100 100">
                  <path
                     className={`${styles.line} ${styles.line1}`}
                     d="M 20,29.000046 H 80.000231 C 80.000231,29.000046 94.498839,28.817352 94.532987,66.711331 94.543142,77.980673 90.966081,81.670246 85.259173,81.668997 79.552261,81.667751 75.000211,74.999942 75.000211,74.999942 L 25.000021,25.000058"
                  />
                  <path
                     d="M 20,50 H 80"
                     className={`${styles.line} ${styles.line2}`}
                  />
                  <path
                     className={`${styles.line} ${styles.line3}`}
                     d="M 20,70.999954 H 80.000231 C 80.000231,70.999954 94.498839,71.182648 94.532987,33.288669 94.543142,22.019327 90.966081,18.329754 85.259173,18.331003 79.552261,18.332249 75.000211,25.000058 75.000211,25.000058 L 25.000021,74.999942"
                  />
               </svg>
            </button>
            <Link href="/dashboard">Dashboard</Link>
         </div>
         <Dialog open={open} onClose={setOpen} className="relative z-10">
            <DialogBackdrop
               transition
               className="fixed left-0  inset-0 bg-gray-500 bg-opacity-75 transition-opacity duration-500 ease-in-out data-[closed]:opacity-0"
            />

            <div className="fixed inset-0 overflow-hidden">
               <div className="absolute inset-0 overflow-hidden">
                  <div className="pointer-events-none fixed inset-y-0 left-0 flex max-w-full pr-10">
                     <DialogPanel
                        transition
                        className="pointer-events-auto relative w-screen max-w-md transform transition duration-500 ease-in-out data-[closed]:-translate-x-full sm:duration-600"
                     >
                        <TransitionChild>
                           <div className="absolute right-0 top-0 flex pr-2 pt-4 duration-500 ease-in-out data-[closed]:opacity-0 ">
                              <button
                                 type="button"
                                 onClick={() => setOpen(false)}
                                 className="relative rounded-md text-black hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                              >
                                 <span className="absolute -inset-2.5" />
                                 <span className="sr-only">Close panel</span>
                                 <X aria-hidden="true" className="h-6 w-6" />
                              </button>
                           </div>
                        </TransitionChild>
                        <div className="flex h-full flex-col overflow-y-scroll bg-white p-4 shadow-xl">
                           <div className="sm:px-6">
                              <Link
                                 href={"/dashboard"}
                                 className="text-base text-black p-4 px-2 font-semibold leading-6"
                              >
                                 Dashboard
                              </Link>
                           </div>
                           {friends.length > 0 && (
                              <div className="text-xs font-semibold leading-6 text-gray-400 px-2 mt-4">
                                 Your chats
                              </div>
                           )}

                           <ul role="list" className="space-y-2">
                              <li className="px-2">
                                 <SidebarChatList
                                    friends={friends}
                                    sessionId={session.user.id}
                                 />
                              </li>
                              {sidebarOptions.map((option) => {
                                 const ICON = Icons[option.Icon as Icon];
                                 return (
                                    <li key={option.id}>
                                       <Link
                                          href={option.href}
                                          className="text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex gap-3 rounded-md px-2 py-2 text-sm leading-6 font-semibold"
                                       >
                                          <span className="text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white">
                                             <ICON className="h-4 w-4" />
                                          </span>

                                          <span className="truncate">
                                             {option.name}
                                          </span>
                                       </Link>
                                    </li>
                                 );
                              })}

                              <li>
                                 <FriendRequestSidebarOptions
                                    sessionId={session.user.id}
                                    initialUnseenRequestCount={
                                       unseenRequestCount
                                    }
                                 />
                              </li>
                           </ul>
                           <div className="absolute w-full flex items-center justify-between bottom-0 flex-1 pr-6">
                              <div className="flex flex-1 items-center gap-x-4 py-3 text-sm font-semibold leading-6 text-gray-900">
                                 <div className="relative h-8 w-8 bg-gray-50">
                                    <Image
                                       fill
                                       referrerPolicy="no-referrer"
                                       className="rounded-full"
                                       src={session.user.image || ""}
                                       alt="Your profile picture"
                                    />
                                 </div>

                                 <span className="sr-only">Your profile</span>
                                 <div className="flex flex-col">
                                    <span aria-hidden="true">
                                       {session.user.name}
                                    </span>
                                    <span
                                       className="text-xs text-zinc-400"
                                       aria-hidden="true"
                                    >
                                       {session.user.email}
                                    </span>
                                 </div>
                              </div>

                              <SignOutButton className="p-3 aspect-square" />
                           </div>
                        </div>
                     </DialogPanel>
                  </div>
               </div>
            </div>
         </Dialog>
      </div>
   );
}
