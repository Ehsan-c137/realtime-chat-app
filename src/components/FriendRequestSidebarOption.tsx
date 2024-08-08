"use client";

import Link from "next/link";
import { User } from "lucide-react";
import { useState, FC } from "react";

interface FriendRequestSidebarOptionProps {
   initialUnseenRequestCount: number;
   sessionId: string;
}

const FriendRequestSidebarOption: FC<FriendRequestSidebarOptionProps> = ({
   initialUnseenRequestCount,
   sessionId,
}) => {
   const [unseenRequestCount, setUnseenRequestCount] = useState<number>(
      initialUnseenRequestCount
   );
   return (
      <Link
         href="/dashboard/requests"
         className="text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group transition flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
      >
         <div className="text-gray=400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.65rem] font-medium bg-white">
            <User className="w-4 h-4" />
         </div>
         <p className="truancate">Friend requests</p>
         {unseenRequestCount > 0 && (
            <div className="rounded-full w-5 h-5 text-xs flex justify-center items-center text-white bg-indigo-600">
               {unseenRequestCount}
            </div>
         )}
      </Link>
   );
};

export default FriendRequestSidebarOption;
