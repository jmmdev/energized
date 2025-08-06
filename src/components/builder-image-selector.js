import { useDeckContext } from "@/context/deck-context";
import Image from "next/image";
import { FaPlus } from "react-icons/fa";

export default function BuilderImageSelector({setShowImgSelector}) {

    const ENERGY_NUMBER = 9;

    const {
        setImage
    } = useDeckContext();

    const GetImages = () => {
        const output = [];
        
        for (let i=0; i<ENERGY_NUMBER; i++) {
            output.push(
                <div className="relative group" key={i} onClick={() => setImage(`/assets/images/deck-logo-${i}.png`)}>
                    <div className="relative w-full aspect-square">
                        <Image className="object-contain" priority src={`/assets/images/deck-logo-${i}.png`}
                        width={500} height={500} alt={`Energy logo #${i}`} />
                    </div>
                    <div className="hidden group-hover:block absolute top-0 w-full h-full bg-foreground opacity-50 z-101" />
                </div>
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
                        <FaPlus className="text-2xl text-foreground rotate-45" />
                    </button>
                </div>
                <div className="grid gap-6 grid-cols-4 sm:grid-cols-5">
                    <GetImages />
                </div>
            </div>
            
        </div>
    )
}