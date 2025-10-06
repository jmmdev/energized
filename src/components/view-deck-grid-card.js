import Image from "next/image";
import { useState } from "react";
import { FaSearchPlus, FaSpinner } from "react-icons/fa";

export default function ViewDeckGridCard({elem, setZoomIn, zoomRef}) {

    const [loaded, setLoaded] = useState(false);
    
    const handleLoad = () => {
        if (!loaded) {
            let timeout;
            clearTimeout(timeout);
            
            setTimeout(() => {
                setLoaded(true);
            }, 300);
        }
    }
 
    return (
        <div className="flex flex-col items-center gap-3">
            <div className={`group relative flex flex-col select-none cursor-pointer`} onClick={() => {
                zoomRef.current = elem.card.id;
                setZoomIn(true);
            }}>
                <Image className={`object-contain ${!loaded && "opacity-0"}`} priority src={elem.card.image + "/high.webp"}
                width={2000} height={2000} alt={`${elem.card.name}#${elem.card.id}`} onLoad={handleLoad} />
                {!loaded &&
                <div className="absolute top-0 w-full h-full rounded-lg border-4 flex items-center justify-center">
                    <FaSpinner className="text-3xl animate-spin" />
                </div>
                }
                <div className="absolute text-xl -top-2 -right-2 p-2 bg-background-2 rounded-full border-3 border-background 
                group-hover:bg-highlight-hover group-hover:text-my-white group-active:bg-highlight-active group-active:text-my-white transition-all">
                    <FaSearchPlus />
                </div>
                {loaded &&
                <div className="absolute flex items-center text-my-white bottom-2 right-2 bg-[#000c] rounded px-6 py-2">
                    <p className="text-3xl text-foreground font-bold">
                        x {elem.quantity} 
                    </p>
                </div> 
                }
            </div>
        </div>
    )
}