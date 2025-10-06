import { useEffect, useRef, useState } from "react";
import CardZoomIn from "./card-zoom-in";

export default function BuildDeckListCard({elem}) {
    const [zoomIn, setZoomIn] = useState(false);
    
    const zoomRef = useRef();

    const TYPES = require("public/assets/files/energy-types.json");
    const COLORS = require("public/assets/files/list-colors.json");

    useEffect(() => {
        if (zoomIn)
            document.body.style.overflow = "hidden";
        else
            document.body.style.overflow = "auto";
    }, [zoomIn])

    const getBg = () => {
        const category = elem.card.category;
        const types = elem.card.types;
        

        if (category === "Trainer")
            return "bg-[#404040]";

        if ((category === "Pokemon" || category === "Energy") && types) {
            const typeIndex = TYPES.findIndex((obj) => obj.toLowerCase() === types[0]?.toLowerCase());
            const textColor = COLORS[typeIndex];
            
            return textColor;
        }
        return null;
    }

    const getCardInfo = () => {
        const category = elem.card.category;
        
        if (category === "Pokemon") {
            const stage = elem.card.stage;

            
            if (stage.toLowerCase().includes("stage")) {
                const stage_number = stage[stage.length-1];
                return `Stage ${stage_number} ${elem.card.types && elem.card.types[0]} Pokémon`;
            }
            
            return (
                <p className="w-fit text-lg">
                    {elem.card.stage} {elem.card.types && elem.card.types[0]} Pokémon
                </p>
            )
        }

        if (category === "Trainer")
            return elem.card.trainerType;

        if (category === "Energy")
            return `${elem.card.energyType} Energy`
    }
 
    return (
        <div key={"list"+elem.card.id}>
            <div className={`group w-full cursor-pointer rounded-lg ${getBg()}`} 
            onClick={() => {
                zoomRef.current = elem.card.id;
                setZoomIn(true);
            }}>
                <div className="px-8 py-4 text-my-white border-2 border-foreground rounded-lg hover:bg-my-white/30">
                    <div className="flex justify-between items-center gap-4 drop-shadow-[1px_1px_0_#000]
                    text-shadow-[1px_1px_0_#000,_-1px_-1px_0_#000,_-1px_1px_0_#000,_1px_-1px_0_#000,_2px_2px_0_#000]">
                        <div>
                            <p className="w-fit text-left text-2xl font-medium">
                                {elem.card.name}
                            </p>
                            {getCardInfo()}
                        </div> 
                        <p className="text-4xl font-bold drop-shadow-[2px_2px_0_#000]">x {elem.quantity}</p>
                    </div>
                </div>
            </div>
            <CardZoomIn zoomIn={zoomIn} setZoomIn={setZoomIn} elem={elem} zoomRef={zoomRef} />
        </div>
    )
}