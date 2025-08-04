import Image from "next/image";
import { useState } from "react";
import { FaSpinner } from "react-icons/fa";

export default function DeckCardElement({elem}) {
    const [loaded, setLoaded] = useState(false);

    const handleLoad = () => {
        
        let timeout;
        clearTimeout(timeout);
        
        setTimeout(() => {
            setLoaded(true);
        }, 800);
    }
 
        return (
            <div className="w-full relative">
                <Image className={`object-contain ${!loaded && "opacity-0"}`} priority src={elem.card.image + "/high.webp"}
                width={500} height={500}alt={`${elem.card.name}#${elem.card.id}`} onLoad={handleLoad} />
                <p className={`absolute right-2 bottom-2 rounded bg-background-1 text-foreground px-4 py-1 font-bold ${!loaded && "opacity-0"}`}>
                   x {elem.quantity} 
                </p>
                <div className={`absolute top-0 w-full h-full rounded-lg border-4 flex items-center justify-center ${loaded ? "opacity-0" : "opacity-60"}`}>
                    <FaSpinner className="text-3xl animate-spin" />
                </div>
            </div>
        )
}