"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Button from "./button";
import TCGdex, { Query } from "@tcgdex/sdk";

export default function BuilderCardSearch() {
    const tcgdex = new TCGdex("en");
    
    const [cardList, setCardList] = useState([]);

    const MySearch = () => {
        const [search, setSearch] = useState("");

        const handleSubmit = async (event) => {
            event.preventDefault();
            if (search.length >= 3) {
                const searchLower = search.toLowerCase();
                const searchCapitalize = searchLower[0].toUpperCase() + searchLower.substring(1);

                const cards = await tcgdex.card.list(
                    Query.create().equal("name", searchCapitalize)
                );
                setCardList(cards);
            }
        }

        return (
            <form className="w-full flex gap-2" onSubmit={handleSubmit}>
                <input className={`w-full h-8 bg-background text-foreground border border-background ${search.length > 0 && "capitalize"}`} placeholder="Search cards..." value={search} onChange={(e) => setSearch(e.target.value)} />
                <Button content="Search" color="blue" disabled={search.length < 3}/>
            </form>
        )
    }

    const GetCardList = () => {
        const output = cardList.map((elem, index) => {
            if (elem.image)
                return (
                    <div key={elem.id} className="w-full relative">
                        <Image className="object-contain" src={elem.image + "/low.webp"} width={500} height={500} alt={`${elem.name}#${elem.id}`} />
                    </div>
                )
            else
                return (
                    <div key={elem.id} className="w-full relative">
                        <Image className="object-contain" src={"/assets/images/no-card-image.webp"} width={500} height={500} alt={`${elem.name}#${elem.id}`} />
                    </div>
                )
        })
        return output;
    }

    return (
        <section className="flex bg-background-1 w-96 overflow-hidden gap-4 h-full p-4 flex-col transition-all">
            <MySearch />
            <div className="w-full h-[1px] bg-foreground opacity-40" />
            <div className="w-full grid grid-cols-4 pr-2 gap-2 flex-wrap overflow-auto">
                {cardList.length > 0 &&
                    <GetCardList />
                }
            </div>
        </section>
    )
}