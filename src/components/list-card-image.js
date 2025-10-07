import Image from "next/image";

export default function ListCardImage({elem, zoomRef, setZoomIn, children}) {
    
    const getCardInfo = () => {
        const category = elem.card.category;
        
        if (category === "Pokemon") {
            const stage = elem.card.stage;

            
            if (stage.toLowerCase().includes("stage")) {
                const stage_number = stage[stage.length-1];
                return `Stage ${stage_number} ${elem.card.types && elem.card.types[0]} Pokémon`;
            }

            return (`${elem.card.stage} ${elem.card.types && elem.card.types[0]} Pokémon`);
        }

        if (category === "Trainer")
            return elem.card.trainerType;

        if (category === "Energy")
            return `${elem.card.energyType} Energy`
    }

    const cardInfo = getCardInfo();

    return (
        <div key={"list"+elem.card.id} 
        className="relative w-full flex justify-between items-center gap-8 p-4 cursor-pointer rounded-lg bg-background-1 hover:bg-background-2 overflow-hidden" 
        onClick={() => {
            zoomRef.current = elem.card.id;
            setZoomIn(true);
        }}>
            <div className="flex flex-1 items-center gap-8">
                <div className="w-16">
                    <Image src={elem.card.image + "/low.webp"} className="h-full w-auto" width={2000} height={2000} alt={`${elem.card.name} card image`}/>
                </div>
                <div className="flex-1 text-start">
                    <p className="text-2xl font-bold">{elem.card.name}</p>
                    <p className="font-light">{cardInfo}</p>
                </div>
            </div>
            {children}
        </div>
    )
}