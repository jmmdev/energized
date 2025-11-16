import { useDeckContext } from "@/context/deck-context";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";

export default function BuilderImageSelector({setShowImgSelector}) {
    const {
        image, setImage, setHasChanges
    } = useDeckContext();

    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        setLoaded(true);
    }, [])

    useEffect(() => {
        if (loaded) {
            setHasChanges(true);
            setShowImgSelector(false);
        }
    }, [image]);


    const ENERGY_NUMBER = 10;

    const GetImages = () => {
        const output = [];
        
        for (let i=0; i<ENERGY_NUMBER; i++) {
            output.push(
                <button key={i} className="group w-1/4 sm:w-1/5 p-3 relative cursor-pointer" onClick={() => setImage(`/assets/images/deck-logo-${i}.png`)}>
                    <div className="relative w-full aspect-square">
                        <Image className="object-contain" priority src={`/assets/images/deck-logo-${i}.png`}
                        width={500} height={500} alt={`Energy logo #${i}`} />
                        <div className="hidden group-hover:block absolute top-0 w-full h-full bg-foreground opacity-50 z-101" />
                    </div>
                </button>
            )
        }

        return output;
    }

    return (
        <div className="absolute top-0 left-0 w-full h-full bg-[#000a] flex flex-col items-center justify-center z-[100_!important] px-12">
            <div className="w-full max-w-[640px] flex flex-col gap-8 rounded md:rounded-lg lg:rounded-xl p-8 bg-background-1">
                <div className="flex items-center justify-between">
                    <p className="text-xl">Pick a deck profile pic</p>
                    <button className="cursor-pointer opacity-60 hover:opacity-100" onClick={() => setShowImgSelector(false)}>
                        <FaTimes className="text-2xl text-foreground" />
                    </button>
                </div>
                <div className="w-full flex flex-wrap justify-center">
                    <GetImages />
                </div>
            </div>
            
        </div>
    )
}