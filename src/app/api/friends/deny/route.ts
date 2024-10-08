import { authOptions } from "@/auth";
import { getServerSession } from "next-auth";
import { fetchRedis } from "@/utils/redis";
import { z } from "zod";
import { db } from "@/lib/db";

export async function POST(req: Request) {
   try {
      const body = await req.json();

      const { id: idToDeny } = z.object({ id: z.string() }).parse(body);

      const session = await getServerSession(authOptions);

      if (!session) {
         return new Response("Unauthorized", { status: 401 });
      }

      const isAlreadyFriends = await fetchRedis(
         "sismember",
         `user:${session.user.id}:friends`,
         idToDeny
      );

      await db.srem(
         `user:${session.user.id}:incoming_friend_requests`,
         idToDeny
      );

      return new Response("OK");
   } catch (error) {
      if (error instanceof z.ZodError) {
         return new Response("Invalid request payload", { status: 422 });
      }

      return new Response("Invalid request", { status: 400 });
   }
}
