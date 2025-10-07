import { FaPlus } from "react-icons/fa";

export default function CardZoomIn({zoomIn, setZoomIn, elem, zoomRef}) {

    const getAttackCost = (attack) => {
        let costMap = {};

        for (let c of attack.cost) {
            if (costMap.hasOwnProperty(c)) {
                costMap[c]++;
            }
            else {
                costMap[c] = 1;
            }
        }

        let costString = "";

        const entries = Object.entries(costMap);

        for (const [index, [key, value]] of Object.entries(entries)) {
            costString += `${value} ${key}`;
            if (index < entries.length - 1)
                costString += ", "
        }

        return costString;
    }

    const GetInfo = ({card}) => {
        let output = [];

        if (card.abilities) {
            for (let abi of card.abilities) {
                output.push(
                    <div className="flex flex-col gap-2" key={abi.name}>
                        <p className="flex items-center gap-2 text-2xl">
                            <span className="py-0.5 px-2 rounded-sm bg-red-500">{abi.type}</span>
                            <span className="font-semibold text-red-500">{abi.name}</span>
                        </p>
                        <p className="text-xl">
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
                        <div>
                            <b className="text-2xl">{att.name}</b>
                            <p className="font-light text-lg">
                                {att.cost && <>Cost: <span className="font-bold">{getAttackCost(att)}</span></>}
                            </p>
                            <p className="text-lg">
                                {(att.damage && att.damage > 0) && <>Damage: <span className="font-bold">{att.damage}</span></>}
                            </p>
                        </div>
                        <p className="text-xl">
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
            <div className="fixed flex flex-col w-screen h-screen bg-[#000d] text-my-white z-100 p-4 top-0 left-0 overflow-y-auto" onClick={() => setZoomIn(false)}>
                <div className="w-full flex-1 flex flex-col items-center gap-12">
                    <p className="text-my-white/80 font-light text-sm">
                        Click anywhere to close
                    </p>
                    <div className="flex flex-1 justify-center">
                        <div className="flex flex-col lg:flex-row lg:items-center gap-8">
                            <div className="w-full flex flex-col items-center gap-2 max-w-sm">
                                <img className="block max-w-full" src={elem.card.image + "/high.webp"} alt={`${elem.card.name}#${elem.card.id}`} />
                            </div>
                            <div className="flex flex-col gap-8 max-w-sm text-left">
                                <div>
                                    <p className="font-bold uppercase text-2xl">{elem.card.name}</p>
                                    <p className="text-xl">{elem.card.stage || elem.card.trainerType || elem.card.energyType} {elem.card.types && elem.card.types[0]} {elem.card.category}</p>
                                    {elem.card.hp && <p className="text-xl">HP: <b>{elem.card.hp}</b></p>}
                                </div>
                                <GetInfo card={elem.card} />
                                {elem.card.effect && <p className="text-xl"> {elem.card.effect}</p>}
                                {elem.card.retreat > 0 && <p className="text-xl">Retreat cost: <b>{elem.card.retreat}</b></p>}
                            </div>
                        </div>
                    </div>
                    <p className="lg:hidden text-my-white/80 font-light text-sm">
                        Click anywhere to close
                    </p>
                </div>
            </div>
        )
}