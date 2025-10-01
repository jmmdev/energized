"use client";
import { useSession } from "next-auth/react";
import UserInfo from "../components/user-info";
import UserDecks from "../components/user-decks";
import UserFavorites from "../components/user-favorites";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function UserData({data}) {
    const {data: session, status} = useSession();
    const router = useRouter();

    useEffect(() => {
        if (!data)
            router.replace("/");
    }, [])
    
    if (data) {
        if (status !== "loading")
            return (
                <div className="w-full flex flex-1 justify-center p-4 md:p-8 xl:p-12">
                    <div className="w-full max-w-[1000px] flex flex-col flex-1 gap-12">
                        <UserInfo user={data.user} />
                        <UserDecks name={data.user.name} decks={data.decks} />
                        <UserFavorites name={data.user.name} favorites={data.favorites} />
                    </div>
                </div>
            );
    }
}