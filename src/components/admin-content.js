"use client";

import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { FaSpinner } from "react-icons/fa";

export default function AdminContent({tab}) {
    const [loading, setIsLoading] = useState(true);

    const content = useRef();

    useEffect(() => {
        content.current = null;
        setIsLoading(true);
    }, [tab])

    useEffect(() => {
        const getTabContentData = async () => {
            const response = await axios.get(`/api/xapi/admin/${tab}`);
            content.current = response.data;

            let timeout;
            clearTimeout(timeout);
            
            timeout = setTimeout(() => {
                setIsLoading(false);
            }, 500);
        }
        if (loading)
            getTabContentData();
    }, [loading])

    const GetContent = () => {
        switch (tab) {
            case "dashboard":
                return (
                    <Dashboard />
                )
            default:
                break;
        }
    }

    const Dashboard = () => {
        return (
            <div className="flex-1 flex flex-col justify-around">
                <div className="flex flex-col lg:flex-row gap-4">
                    <DashboardInfoDisplay value={content.current.totalDecks} text={"total decks created"} />
                    <DashboardInfoDisplay value={content.current.publicDecks} text={"public decks"} />
                </div>
                <div className="flex flex-col lg:flex-row gap-4">
                    <DashboardInfoDisplay toggle value={content.current.lastUsersActive} text={"users active"} />
                </div>
            </div>
        )
    }

    const DashboardInfoDisplay = ({toggle, value, text}) => {
        const [timespan, setTimespan] = useState("7d");

        const toggleTimespan = () => {
            if (timespan === "7d")
                setTimespan("30d");
            else
                setTimespan("7d");
        }

        return (
            <div className="flex flex-col items-end gap-4">
                {toggle &&
                    <button className="cursor-pointer self-start hover:underline" onClick={toggleTimespan}>
                        <span className={`${timespan === "7d" && "text-highlight"}`}>7d</span>
                        <span> / </span>
                        <span className={`${timespan === "30d" && "text-highlight"}`}>30d</span>
                    </button>
                }
                <h1 className="text-5xl font-bold">
                    {toggle ? value[timespan] : value}
                </h1>
                <p className="text-lg">{text} {toggle && ` in the last ${timespan === "7d" ? "week" : "month"}`}</p>
            </div>
        )
    }

    return (
        <section className="hidden lg:flex flex-col lg:flex-1 p-8">
            {(loading || !content.current) ?
                <div className="flex flex-col gap-2 text-2xl justify-center items-center lg:flex-1">
                    <FaSpinner className="animate-spin" />
                    Retrieving {tab} data...
                </div>
            :
                <GetContent />
            }
        </section>
    )
}