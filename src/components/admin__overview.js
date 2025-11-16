import { useState } from "react";

export default function AdminOverview({content}) {

    const OverviewInfoDisplay = ({toggle, value, text}) => {
        const [timespan, setTimespan] = useState(
            (value && value["all"]) ? "all" : "7d"
        );

        return (
            <div className="flex flex-col justify-end bg-background-1 p-8 min-w-1/2 rounded-xl">
                {toggle &&
                <div className="flex gap-1 self-start text-lg">
                    {value && value["all"] &&
                    <>
                        <button className={`${timespan === "all" ? "opacity-100" : "opacity-60 cursor-pointer"} hover:opacity-100`} onClick={() => setTimespan("all")}>
                            All
                        </button>
                        <div className="opacity-60">/</div>
                    </>
                    }
                    <button className={`${timespan === "7d" ? "opacity-100" : "opacity-60 cursor-pointer"} hover:opacity-100`} onClick={() => setTimespan("7d")}>
                        7d
                    </button>
                    <div className="opacity-60">/</div>
                    <button className={`${timespan === "30d" ? "opacity-100" : "opacity-60 cursor-pointer"} hover:opacity-100`} onClick={() => setTimespan("30d")}>
                        30d
                    </button>
                </div>
                }
                <div className="flex flex-col items-end">
                    <h1 className="text-[64px] font-bold">
                        {value && (toggle ? value[timespan] : value)}
                    </h1>
                    <p className="text-xl opacity-60 font-light">{text} {toggle && timespan !== "all" && ` in the last ${timespan === "7d" ? "week" : "month"}`}</p>
                </div>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 w-full self-center gap-8">
            <OverviewInfoDisplay toggle value={content.users} text={"users registered"} />
            <OverviewInfoDisplay toggle value={content.users.active} text={"users active"} />
            <OverviewInfoDisplay toggle value={content.decks} text={"decks created"} />
            <OverviewInfoDisplay value={content.decks.public} text={"public decks"} />
            <OverviewInfoDisplay toggle value={content.favorites} text={"decks faved by users"} />
            <OverviewInfoDisplay toggle value={content.indexedCards} text={"indexed cards"} />
            <OverviewInfoDisplay toggle value={content.searches} text={"searches"} />
        </div>
    )
}