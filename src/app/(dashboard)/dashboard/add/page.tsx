import { FC } from "react";
import AddFriendButton from "@/components/AddFriendButton";

const Page: FC = () => {
   return (
      <div className="p-8">
         <h1 className="font-bold text-5xl mb-8">Add a friend </h1>
         <AddFriendButton />
      </div>
   );
};

export default Page;
