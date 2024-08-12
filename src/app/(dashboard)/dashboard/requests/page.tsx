import { authOptions } from "@/auth";
import { fetchRedis } from "@/utils/redis";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import FriendRequests from "@/components/FriendRequests";

import { FC } from "react";

interface PageProps {}

const Page = async () => {
   const session = await getServerSession(authOptions);
   if (!session) notFound();

   // ids of people who have sent you a friend request
   const incomingSenderIds = (await fetchRedis(
      "smembers",
      `user:${session.user.id}:incoming_friend_requests`
   )) as string[];

   const incomingFriendRequest = await Promise.all([
      ...incomingSenderIds.map(async (senderId) => {
         const sender = (await fetchRedis("get", `user:${senderId}`)) as string;
         const senderParsed = JSON.parse(sender) as User;

         return {
            senderId,
            senderEmail: senderParsed.email,
         };
      }),
   ]);

   return (
      <main className="pt-8">
         <h1 className="font-bold text-5xl mb-8"></h1>
         <div className="flex flex-col gap-4">
            <FriendRequests
               incomingFriendRequest={incomingFriendRequest}
               sessionId={session.user.id}
            />
         </div>
      </main>
   );
};

export default Page;
