"use client";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import UserInfo from "@/components/user-info";
import UserDecks from "@/components/user-decks";
import UserFavorites from "@/components/user-favorites";

export default function User() {
    const params = useParams();
    const {data: session, status} = useSession();
    
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const getUserData = async () => {
            try {
                const response = await axios.get(`http://localhost:3500/api/users/user/${params.user}`);
                setUserData(response.data);
            } catch (e) {
                console.log(e);
            }
        }
        getUserData();
    }, [])

    useEffect(() => {
        if (status !== "loading" && userData)
            setIsLoading(false);
    }, [status, userData])

    const deleteDeck = async (deck) => {
        if (confirm(`${deck.name} will be completely removed from the database. Are you sure?`)) {
            setIsLoading(true);
            await axios.delete(`http://localhost:3500/api/decks/${deck._id}`);
            
            const response = await axios.get(`http://localhost:3500/api/users/user/${params.user}`);
            setUserData(response.data);
        }
    }

    if (!isLoading) {
        if (userData)
            return (
                <div className="w-full flex justify-center p-4 md:p-8 xl:p-12">
                    <div className="w-full max-w-[1000px] flex flex-col gap-12">
                        <UserInfo user={userData.user} />
                        <UserDecks name={userData.user.name} decks={userData.decks} deleteDeck={deleteDeck} />
                        <UserFavorites name={userData.user.name} favorites={userData.user.favorites} />
                    </div>
                </div>
            );

        return <p>{`User "${params.user}" was not found`}</p>
    }

    return null;
}