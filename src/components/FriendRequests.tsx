"use client";

import { Check, UserPlus, X } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { pusherClient } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";

interface IProps {
   incomingFriendRequest: IncomingFriendRequest[];
   sessionId: string;
}

const FriendRequests = ({ incomingFriendRequest, sessionId }: IProps) => {
   const [friendRequest, setFriendRequest] = useState<IncomingFriendRequest[]>(
      incomingFriendRequest
   );

   const router = useRouter();

   const acceptFriendRequest = async (senderId: string) => {
      await axios.post("/api/friends/accept", { id: senderId });
      setFriendRequest((prev) =>
         prev.filter((request) => request.senderId !== senderId)
      );

      router.refresh();
   };

   const denyFriendRequest = async (senderId: string) => {
      await axios.post("/api/friends/deny", { id: senderId });
      setFriendRequest((prev) =>
         prev.filter((request) => request.senderId !== senderId)
      );

      router.refresh();
   };

   useEffect(() => {
      pusherClient.subscribe(
         toPusherKey(`user:${sessionId}:incoming_friend_requests`)
      );

      const friendRequestHandler = ({
         senderId,
         senderEmail,
      }: IncomingFriendRequest) => {
         setFriendRequest((prev) => [...prev, { senderEmail, senderId }]);
      };

      pusherClient.bind("incoming_friend_requests", friendRequestHandler);

      return () => {
         pusherClient.unsubscribe(
            toPusherKey(`user:${sessionId}:incoming_friend_requests`)
         );
         pusherClient.unbind("incoming_friend_requests", friendRequestHandler);
      };
   }, [sessionId]);

   return (
      <>
         {friendRequest.length === 0 ? (
            <p className="text-sm text-zinc-500">Nothing to show here.</p>
         ) : (
            friendRequest.map((request) => (
               <div key={request.senderId} className="flex gap-4 items-center">
                  <UserPlus className="text-black" />
                  <p className="font-medium text-lg text-black">
                     {request.senderEmail}
                  </p>
                  <button
                     onClick={() => acceptFriendRequest(request.senderId)}
                     aria-label="accept friend request"
                     className="w-8 h-8 bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center rounded-full transition hover:shadow-md"
                  >
                     <Check className="font-semibold text-white w-3/4 h-3/4" />
                  </button>
                  <button
                     onClick={() => denyFriendRequest(request.senderId)}
                     aria-label="deny friend request"
                     className="w-8 h-8 bg-red-600 hover:bg-red-700 flex items-center justify-center rounded-full transition hover:shadow-md"
                  >
                     <X className="font-semibold text-white w-3/4 h-3/4" />
                  </button>
               </div>
            ))
         )}
      </>
   );
};

export default FriendRequests;
