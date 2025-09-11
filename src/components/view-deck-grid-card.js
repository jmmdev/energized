import Image from "next/image";
import {  useEffect, useState } from "react";
import { FaPlus, FaSearchPlus, FaSpinner } from "react-icons/fa";

export default function BuildDeckGridCard({elem}) {

    const [loaded, setLoaded] = useState(false);
    const [zoomIn, setZoomIn] = useState(false);
    
    const handleLoad = () => {
        if (!loaded) {
            let timeout;
            clearTimeout(timeout);
            
            setTimeout(() => {
                setLoaded(true);
            }, 300);
        }
    }

    useEffect(() => {
        if (zoomIn)
            document.body.style.overflow = "hidden";
        else
            document.body.style.overflow = "auto";
    }, [zoomIn])
 
    return (
        <>
        <div className="flex flex-col items-center gap-3">
            <div className={`group relative flex flex-col cursor-pointer`} onClick={() => setZoomIn(true)}>
                <Image className={`object-contain ${!loaded && "opacity-0"}`} priority src={elem.card.image + "/high.webp"}
                width={2000} height={2000} alt={`${elem.card.name}#${elem.card.id}`} onLoad={handleLoad} />
                {!loaded &&
                <div className="absolute top-0 w-full h-full rounded-lg border-4 flex items-center justify-center">
                    <FaSpinner className="text-3xl animate-spin" />
                </div>
                }
                <div className="absolute text-xl -top-2 -right-2 p-2 bg-background-2 rounded-full border-3 border-background group-hover:bg-background-1 group-hover:text-highlight transition-all">
                    <FaSearchPlus />
                </div>
                {loaded &&
                <div className="absolute flex items-center text-my-white bottom-2 right-2 bg-[#000b] rounded px-6 py-2">
                    <p className="text-2xl text-foreground font-bold">
                        x{elem.quantity} 
                    </p>
                </div> 
            }
            </div>
        </div>
        {zoomIn &&
            <div className="fixed flex flex-col w-full h-full bg-[#000c] z-100 p-8 top-0 left-0">
                <div className="w-full flex-1 flex flex-col justify-center gap-4">
                    <button className="self-end opacity-60 hover:opacity-100 cursor-pointer text-my-white" onClick={() => setZoomIn(false)}>
                        <FaPlus className="text-3xl rotate-45" />
                    </button>
                    <div className="relative w-full h-full">
                        <img className={`absolute inset-0 w-full h-full object-contain ${!loaded && "opacity-0"}`} src={elem.card.image + "/high.webp"} alt={`${elem.card.name}#${elem.card.id}`} onLoad={handleLoad} />
                    </div>
                </div>
            </div>
        }
        </>
    )
}