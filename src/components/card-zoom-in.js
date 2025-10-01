import { FaPlus } from "react-icons/fa";

export default function CardZoomIn({zoomIn, setZoomIn, elem, zoomRef}) {
    const GetInfo = ({card}) => {
        let output = [];

        if (card.abilities) {
            for (let abi of card.abilities) {
                output.push(
                    <div className="flex flex-col gap-2" key={abi.name}>
                        <p className="flex items-center gap-2">
                            <span className="py-0.5 px-2 rounded-sm bg-red-500">{abi.type}</span>
                            <span className="font-semibold text-red-500">{abi.name}</span>
                        </p>
                        <p>
                            {abi.effect}
                        </p>
                    </div>
                )
            }
        }

        if (card.attacks) {
            for (let att of card.attacks) {
                output.push(
                    <div className="flex flex-col gap-2" key={att.name}>
                        <p>{att.cost ? `(${att.cost.length})` : ""} {att.name} {att.damage}</p>
                        <p>
                            {att.effect}
                        </p>
                    </div>
                )
            }
        }

        return output;
    }

    if (zoomIn && zoomRef.current && (zoomRef.current === elem.card.id))
        return (
            <div className="fixed flex flex-col w-full h-full bg-[#000d] text-my-white z-100 p-8 top-0 left-0 overflow-y-auto">
                <div className="w-full flex-1 flex flex-col gap-4">
                    <button className="self-end opacity-70 hover:opacity-100 cursor-pointer text-my-white" onClick={() => setZoomIn(false)}>
                        <FaPlus className="text-3xl rotate-45" />
                    </button>
                    <div className="flex flex-1 justify-center">
                        <div className="flex flex-col lg:flex-row lg:items-center text-xl gap-8">
                            <div className="w-full max-w-md">
                                <img className="block max-w-full" src={elem.card.image + "/high.webp"} alt={`${elem.card.name}#${elem.card.id}`} />
                            </div>
                            <div className="flex flex-col gap-8 max-w-md text-left">
                                <div>
                                    <p className="font-bold uppercase">{elem.card.name}</p>
                                    <p>{elem.card.stage || elem.card.trainerType || elem.card.energyType} {elem.card.types && elem.card.types[0]} {elem.card.category}</p>
                                    {elem.card.hp && <p>HP: {elem.card.hp}</p>}
                                </div>
                                <GetInfo card={elem.card} />
                                {elem.card.effect && <p> {elem.card.effect}</p>}
                                {elem.card.retreat > 0 && <p>Retreat cost: {elem.card.retreat}</p>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
}