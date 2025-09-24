import { useEffect, useRef, useState } from "react";
import { FaCaretDown, FaChartBar, FaPlus, FaSpinner } from "react-icons/fa";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

export default function DeckStats({deck}) {
    const [loading, setLoading] = useState(true);
    const [showStats, setShowStats] = useState(false);

    const compositionPieRef = useRef();
    const compositionStackBarRef = useRef();
    const energyTinyBarRef = useRef();
    const drawGaugeRef = useRef();

    const POKEMON_KEYS = ["Pokemon:Basic", "Pokemon:Stage1", "Pokemon:Stage2"];
    const TRAINER_KEYS = ["Trainer:Supporter", "Trainer:Item", "Trainer:Stadium"];
    const ENERGY_KEYS  = ["Energy:Normal", "Energy:Special"];

    useEffect(() => {
        let pieCompObj = [
            {name: "Pokemon", value: 0, "Basic": 0, "Stage1": 0, "Stage2": 0},
            {name: "Trainer", value: 0, "Supporter": 0, "Item": 0, "Stadium": 0},
            {name: "Energy", value: 0},
        ]

        let stackBarCompObj = [
            {
                category: "Pokemon",
                "Pokemon:Basic": 0,
                "Pokemon:Stage1": 0,
                "Pokemon:Stage2": 0,
            },
            {
                category: "Trainer",
                "Trainer:Supporter": 0,
                "Trainer:Item": 0,
                "Trainer:Stadium": 0,
            },
            {
                category: "Energy",
                "Energy:Normal": 0,
                "Energy:Special": 0,
            }
        ]

        let tinyBarEnergyObj = [
            {name: "0", value: 0, total: 0},
            {name: "1", value: 0, total: 0},
            {name: "2", value: 0, total: 0},
            {name: "3+", value: 0, total: 0},
        ]

        let basicCount = 0;
        let energyCount = 0;

        for (const slot of deck) {
            const card = slot.card;
            const cardCategory = card.category;

            const index = pieCompObj.findIndex(elem => elem.name === cardCategory);
            pieCompObj[index].value += slot.quantity;
            
            stackBarCompObj[index][`${cardCategory}:${card.stage || card.trainerType || card.energyType}`] += slot.quantity;

            

            if (cardCategory === "Pokemon") {
                for (const attack of card.attacks) {
                    const cost = attack.cost ? attack.cost.length : 0;

                    const indexToFind = cost >= 3 ? "3+" : cost.toString();

                    const index = tinyBarEnergyObj.findIndex(elem => {
                        return elem.name === indexToFind
                    });

                    tinyBarEnergyObj[index].value++;
                    tinyBarEnergyObj[index].total += slot.quantity
                }

                if (card.stage === "Basic")
                    basicCount += slot.quantity;
            }

            if (cardCategory === "Energy")
                energyCount += slot.quantity;
        }

        compositionPieRef.current = pieCompObj;
        compositionStackBarRef.current = stackBarCompObj;
        energyTinyBarRef.current = tinyBarEnergyObj;
        drawGaugeRef.current = {basic: basicCount, energy: energyCount};

        setLoading(false);
    }, [])

    const calcDrawOne = (total, subgroup, sample) => {
        const remaining = total - subgroup;
        let result = 1;

        for (let i=0; i<sample; i++) {
            result *= (remaining - i) / (total - i);;
        }

        return (1 - result) * 100;
    }

    const DataDisplay = ({display, name}) => {
        return (
            <div className="flex flex-col w-full items-center">
                <h1 className={"sticky top-0 w-full text-2xl font-bold bg-background-1/80 p-4 z-10 backdrop-blur-sm"}>
                    {name}
                </h1>
                <div className="flex flex-col justify-center items-center w-full p-4 gap-4">
                    {display}
                </div>
            </div>
        )
    }

    const DeckComp_PieChart = () => {
        const COLORS = ["#00C46F", "#DF5042", "#0088FE"];
        
        return (
            <div className="flex flex-col w-full">
                <p className="font-semibold text-xl">By category</p>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={compositionPieRef.current}
                            cx="50%"
                            cy="50%"
                            dataKey="value"
                            labelLine={false}
                            label={({ cx, cy, midAngle, innerRadius, outerRadius, name, value }) => {
                                const RADIAN = Math.PI / 180;
                                const radius = innerRadius + (outerRadius - innerRadius) * 0.6;
                                const x = cx + radius * Math.cos(-midAngle * RADIAN);
                                const y = cy + radius * Math.sin(-midAngle * RADIAN);

                                return (
                                    <text
                                        x={x}
                                        y={y}
                                        textAnchor="middle"
                                        dominantBaseline="central"
                                        fill="#fff"
                                    >
                                        <tspan className="font-semibold" x={x} dy="-0.4em">{value}</tspan>
                                        <tspan x={x} dy="1.2em">{name}</tspan>
                                    </text>
                                );
                            }}>
                            {compositionPieRef.current.map((entry, index) => (
                            <Cell key={`cell-${entry.name}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
            </div>
        )
    }

    
    const DeckComp_StackBar = () => {
        const COLORS = {
            "Pokemon:Basic": "#00946F",
            "Pokemon:Stage1": "#00C46F",
            "Pokemon:Stage2": "#00F46F",
            "Trainer:Supporter": "#BF3022",
            "Trainer:Item": "#DF5042",
            "Trainer:Stadium": "#FF8072",
            "Energy:Normal": "#0048BE",
            "Energy:Special": "#0088FE",
        };

        const hasData = (key) => compositionStackBarRef.current.some(row => row[key] && row[key] > 0);

        return (
            <div className="flex flex-col w-full gap-4">
                <p className="font-semibold text-xl">By subcategory</p>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={compositionStackBarRef.current} barGap={4}>
                        <XAxis dataKey="category" tick={{ fill: "#fff" }} axisLine={{stroke: "#fff"}} tickLine={{stroke: "#fff"}} />
                        <YAxis allowDecimals={false} width={30} tick={{ fill: "#fff" }} axisLine={{stroke: "#fff"}} tickLine={{stroke: "#fff"}} />
                        <Tooltip
                        formatter={(value, name) => {
                            if (value > 0)
                                return [value, name.split(":")[1] ?? name]
                        }}
                        />
                        {POKEMON_KEYS.filter(k => hasData(k)).map(k => (
                            <Bar key={k} dataKey={k} stackId={1} fill={COLORS[k]} />
                        ))}

                        {TRAINER_KEYS.filter(k => hasData(k)).map(k => (
                            <Bar key={k} dataKey={k} stackId={1} fill={COLORS[k]} />
                        ))}

                        {ENERGY_KEYS.filter(k => hasData(k)).map(k => (
                            <Bar key={k} dataKey={k} stackId={1} fill={COLORS[k]} />
                        ))}
                    </BarChart>
                </ResponsiveContainer>
            </div>
        )
    }

    const EnergyCurve = ({dataKey}) => {
        return (
            <div className="flex flex-col w-full gap-4">
                <p className="font-semibold text-xl">{dataKey === "total" ? "Total attack spread" : "Unique attack spread"}</p>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={energyTinyBarRef.current}>
                        <XAxis dataKey="name" tick={{ fill: "#fff" }} axisLine={{stroke: "#fff"}} tickLine={{stroke: "#fff"}} />
                        <YAxis width={30} allowDecimals={false} tick={{ fill: "#fff" }} axisLine={{stroke: "#fff"}} tickLine={{stroke: "#fff"}} />
                        <Bar dataKey={dataKey} fill={dataKey === "total" ? "#f7c950" : "#c4c4d4"} 
                        label={({ payload, x, y, width, height, value }) => {
                            if (value > 0)
                                return <text className="font-medium text-lg" x={x + width / 2} y={y + height / 2} fill="#000" textAnchor="middle">{value}</text>
                        }} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        )
    }

    const DrawGauge = ({percentage, color}) => {
        const result = Math.round(((percentage / 100) * 180 - 45) * 10) / 10;
        
        return (
            <div className="w-full px-4">
                <div className={`relative w-full flex aspect-[2] items-center justify-center overflow-hidden rounded-t-full ${color}`}>
                    <div className={`absolute top-0 aspect-square w-full bg-gradient-to-tr from-transparent from-50% to-white to-50% transition-transform duration-500`} style={{rotate: result+"deg"}} />
                    <div className="absolute top-1/4 flex aspect-square w-3/4 justify-center rounded-full bg-background"/>
                    <div className="absolute bottom-0 w-full truncate text-center text-5xl font-bold leading-none">
                        {Math.round(percentage)}%
                    </div>
                </div>
            </div>
        )
    }
    
    return (
        <div className="flex flex-col w-full sm:flex-1">
            <div className={`absolute lg:relative top-0 left-0 flex flex-col lg:flex-row w-full lg:h-full z-80 bg-background
                ${showStats ? "h-full" : "h-0 overflow-y-hidden"} transition-all`}>
                <div className="flex flex-col w-full h-full lg:gap-4 overflow-y-auto">
                    <button className="flex justify-end gap-4 items-center p-4 lg:hidden cursor-pointer opacity-70 hover:opacity-100"
                    onClick={() => setShowStats(false)}>
                        <div className="flex gap-2 items-center">
                            <FaChartBar className="text-2xl" />
                            <h1 className="uppercase text-xl">Deck stats</h1>
                        </div>
                        <FaPlus className="text-2xl rotate-45" />
                    </button>
                    {loading ?
                    <div className="flex flex-col w-full h-full justify-center items-center gap-2">
                        <FaSpinner className="text-2xl animate-spin" />
                        <p className="text-xl">Loading stats...</p>
                    </div>
                    :
                    <div className="w-full">
                        <div className="flex flex-col w-full gap-8">
                            <DataDisplay display={
                                <div className="w-full flex flex-col sm:flex-row gap-8">
                                    <DeckComp_PieChart />
                                    <DeckComp_StackBar />
                                </div>
                            } name="Deck composition" />
                        </div>

                        <div className="flex flex-col w-full gap-8">
                            <DataDisplay display={
                                <div className="w-full flex flex-col sm:flex-row gap-8">
                                    <EnergyCurve dataKey="total" />
                                    <EnergyCurve dataKey="value" />
                                </div>
                            } name="Energy costs & distribution" />
                        </div>

                        <div className="flex flex-col w-full items-center">
                        <h1 className={"sticky top-0 w-full text-2xl font-bold bg-background-1/80 p-4 z-10 backdrop-blur-sm"}>
                            Starting hand odds
                        </h1>
                            <div className="flex flex-col w-full items-center sm:flex-row gap-8 p-4">
                                <div className="flex flex-col w-full gap-4">
                                    <p className="font-semibold text-xl">
                                        Chance of Basic Pokémon
                                    </p>
                                    <DrawGauge percentage={calcDrawOne(60, drawGaugeRef.current.basic, 7)} color="bg-red-500" />
                                </div>
                                <div className="flex flex-col w-full gap-4">
                                    <p className="font-semibold text-xl">
                                        Chance of Energy
                                    </p>
                                    <DrawGauge percentage={calcDrawOne(60, drawGaugeRef.current.energy, 7)} color="bg-blue-500" />
                                </div>
                            </div>
                        </div>
                    </div>
                    }
                </div>
            </div>
            {!showStats &&
            <button className="group absolute top-0 lg:hidden flex self-center p-2 bg-background-1 text-xl cursor-pointer rounded-br rounded-bl" onClick={() => setShowStats(!showStats)}>
                <div className="flex opacity-70 hover:opacity-100">
                    <FaCaretDown />
                    <FaChartBar />
                </div>
            </button>
                }
        </div>
    )
}