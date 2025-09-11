export default function BuildDeckListCard({elem}) {

    const TYPES = require("public/assets/files/energy-types.json");
    const COLORS = require("public/assets/files/list-colors.json");

    const getBg = () => {
        const category = elem.card.category;
        const types = elem.card.types;
        

        if (category === "Trainer")
            return "bg-[#bfbfbf]";

        if ((category === "Pokemon" || category === "Energy") && types) {
            const typeIndex = TYPES.findIndex((obj) => obj.toLowerCase() === types[0]?.toLowerCase());
            const bgColor = COLORS[typeIndex];
            
            return bgColor;
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
            
            return `${elem.card.stage} ${elem.card.types && elem.card.types[0]} Pokémon`;
        }

        if (category === "Trainer")
            return elem.card.trainerType;

        if (category === "Energy")
            return `${elem.card.energyType} Energy`
    }
 
    return (
        <div className={`group w-full flex justify-between items-center gap-4 px-4 py-2 text-my-black rounded ${getBg() || "bg-[#5b5b5b]"}`}>
            <div>
                <p className="w-fit text-left text-lg font-bold">
                    {elem.card.name}
                </p>
                <p className="w-fit text-left text-light">
                    {getCardInfo()}
                </p>
           </div> 
            <div className="flex items-center text-sm">
                <p className="text-xl w-12 font-bold">x{elem.quantity}</p>
            </div>
        </div>
    )
}