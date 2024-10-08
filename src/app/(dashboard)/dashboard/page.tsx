import { authOptions } from "@/auth";
import { chatHrefConstructor } from "@/lib/utils";
import { getFriendsByUserId } from "@/utils/get-friends-by-user-id";
import { fetchRedis } from "@/utils/redis";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import Image from "next/image";

export default async function Dashboard() {
   const session = await getServerSession(authOptions);
   if (!session) notFound();

   // const router = useRouter();

   const friends = await getFriendsByUserId(session.user.id);

   const friendsWithLastMessage = await Promise.all(
      friends.map(async (friend) => {
         const [lastMessageRaw] = (await fetchRedis(
            "zrange",
            `chat:${chatHrefConstructor(session.user.id, friend.id)}:messages`,
            -1,
            -1
         )) as string[];

         const lastMessage = JSON.parse(lastMessageRaw) as Message;

         return {
            ...friend,
            lastMessage,
         };
      })
   );

   return (
      <div className="container pt-20">
         <h1 className="font-bold md:text-5xl text-xl text-black mb-8">
            Recent chats
         </h1>
         {friendsWithLastMessage.length === 0 && (
            <p className="text-sm text-zinc-500">Nothing to show here</p>
         )}
         {friendsWithLastMessage.map((friend) => {
            return (
               <div
                  key={friend.id}
                  className="relative bg-zinc-50 border border-zinc-200 p-3 rounded-lg mb-5"
               >
                  <div className="absolute right-4 inset-y-0 flex items-center">
                     <ChevronRight className="h-7 w-7 text-zinc-400" />
                  </div>
                  <Link
                     href={`/dashboard/chat/${chatHrefConstructor(
                        session.user.id,
                        friend.id
                     )}`}
                     className="relative flex gap-4"
                  >
                     <div className="flex-shrink-0 mb-0 sm:mr-4 items-center flex">
                        <div className="relative h-10 w-10">
                           <Image
                              referrerPolicy="no-referrer"
                              fill
                              src={friend.image}
                              alt={`${friend.name} profile picture`}
                              className="rounded-full"
                           />
                        </div>
                     </div>
                     <div className="text-black flex flex-col">
                        <h4 className="text-lg font-semibold text-black">
                           {friend.name}
                        </h4>
                        <p className="mt-1 max-w-md">
                           <span className="text-zinc-400">
                              {friend.lastMessage.senderId ===
                                 session.user.id && "You: "}
                           </span>
                           {friend.lastMessage.text}
                        </p>
                     </div>
                  </Link>
               </div>
            );
         })}
      </div>
   );
}
