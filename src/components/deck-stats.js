import { useEffect, useRef, useState } from "react";
import { FaCaretDown, FaCaretUp, FaChartBar, FaSpinner } from "react-icons/fa";
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

        let drawGaugeObj = {
            basic: [
                {name: "Turn 1 Basic", value: 0},
                {name: "No turn 1 Basic", value: 0}
            ],
            energy: [
                {name: "Turn 1 Energy", value: 0},
                {name: "No turn 1 Energy", value: 0},
            ]
        }

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

        const basicChance = calcDrawOne(60, basicCount, 7);
        const energyChance = calcDrawOne(60, energyCount, 7);

        drawGaugeObj.basic[0].value = basicChance;
        drawGaugeObj.basic[1].value = 100 - basicChance;

        drawGaugeObj.energy[0].value = energyChance;
        drawGaugeObj.energy[1].value = 100 - energyChance;

        compositionPieRef.current = pieCompObj;
        compositionStackBarRef.current = stackBarCompObj;
        energyTinyBarRef.current = tinyBarEnergyObj;
        drawGaugeRef.current = drawGaugeObj;

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
                <p className="font-semibold text-lg">By category</p>
                <PieChart width={250} height={250}>
                    <Pie
                        data={compositionPieRef.current}
                        dataKey="value"
                        isAnimationActive={false}
                        labelLine={false}
                        label={({ cx, cy, midAngle, innerRadius, outerRadius, name, value }) => {
                            const RADIAN = Math.PI / 180;
                            const radius = innerRadius + (outerRadius - innerRadius) * 0.6;
                            const x = cx + radius * Math.cos(-midAngle * RADIAN);
                            const y = cy + radius * Math.sin(-midAngle * RADIAN);

                            return (
                                <text
                                className="uppercase"
                                    x={x}
                                    y={y}
                                    textAnchor="middle"
                                    dominantBaseline="central"
                                    fill="#fff"
                                >
                                    <tspan className="text-sm font-bold" x={x} dy="-0.4em">{value}</tspan>
                                    <tspan className="text-sm" x={x} dy="1.2em">{name}</tspan>
                                </text>
                            );
                        }}>
                        {compositionPieRef.current.map((entry, index) => (
                        <Cell key={`cell-${entry.name}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                </PieChart>
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
                <p className="font-semibold text-lg">By subcategory</p>
                <ResponsiveContainer width="100%" height={250}>
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
                            <Bar key={k} dataKey={k} stackId={1} fill={COLORS[k]} isAnimationActive={false} />
                        ))}

                        {TRAINER_KEYS.filter(k => hasData(k)).map(k => (
                            <Bar key={k} dataKey={k} stackId={1} fill={COLORS[k]} isAnimationActive={false} />
                        ))}

                        {ENERGY_KEYS.filter(k => hasData(k)).map(k => (
                            <Bar key={k} dataKey={k} stackId={1} fill={COLORS[k]} isAnimationActive={false} />
                        ))}
                    </BarChart>
                </ResponsiveContainer>
            </div>
        )
    }

    const EnergyCurve = ({dataKey}) => {
        return (
            <div className="flex flex-col w-full gap-4">
                <p className="font-semibold text-lg">{dataKey === "total" ? "Total attack spread" : "Unique attack spread"}</p>
                <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={energyTinyBarRef.current}>
                        <XAxis dataKey="name" tick={{ fill: "#fff" }} axisLine={{stroke: "#fff"}} tickLine={{stroke: "#fff"}} />
                        <YAxis width={30} allowDecimals={false} tick={{ fill: "#fff" }} axisLine={{stroke: "#fff"}} tickLine={{stroke: "#fff"}} />
                        <Bar dataKey={dataKey} fill={dataKey === "total" ? "#f7c950" : "#c4c4d4"} isAnimationActive={false}
                        label={({ payload, x, y, width, height, value }) => {
                            if (value > 0)
                                return <text className="font-medium text-lg" x={x + width / 2} y={y + height / 2} fill="#000" textAnchor="middle">{value}</text>
                        }} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        )
    }

    const DrawGauge = ({data, first, textValue}) => {
        const COLORS = [
            first ? "#ef4444" : "#3b82f6", 
            "#e5e5e5"];

        return (
            <div className="flex flex-col w-full">
                <p className="font-semibold text-lg">{first ? "Chance of Basic PKMN" : "Chance of Energy"}</p>
                <div className="relative self-center w-[250px] aspect-square">
                    <PieChart width={250} height={250}>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            dataKey="value"
                            isAnimationActive={false}
                            labelLine={false}
                            innerRadius={65}
                            stroke="none">
                            {data.map((entry, index) => (
                                <Cell key={`cell-${entry.name}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                    </PieChart>
                    <p className="absolute top-1/2 left-1/2 -translate-1/2 w-fit text-4xl font-bold">
                        {textValue}%
                    </p>
                </div>
            </div>
        )
    }
    
    return (
        <div className="flex flex-col w-full sm:flex-1">
            <button className="group w-full lg:hidden flex flex-col items-center gap-2 p-4 bg-background-1 text-xl cursor-pointer" onClick={() => setShowStats(!showStats)}>
                <div className="w-48 h-2 bg-foreground/30 rounded-full group-hover:bg-foreground/60" />
                <div className="flex opacity-30 group-hover:opacity-60 gap-1">
                    <FaChartBar />
                    <FaCaretUp />
                </div>
            </button>
            <div className={"absolute lg:relative bottom-0 left-0 flex flex-col lg:flex-row w-full lg:h-full z-80 transition-all " +
                `${showStats ? "h-full" : "h-0 overflow-y-hidden"}`}>
                <button className="group w-full lg:hidden flex flex-col items-center gap-2 p-4 bg-background-1 text-xl cursor-pointer" onClick={() => setShowStats(!showStats)}>
                    <div className="w-48 h-2 bg-foreground/30 rounded-full group-hover:bg-foreground/60" />
                    <div className="flex opacity-30 group-hover:opacity-60 gap-1">
                        <FaChartBar />
                        <FaCaretDown />
                    </div>
                </button>
                <div className="flex flex-col w-full h-full lg:gap-4 overflow-y-auto bg-background">
                    {loading ?
                    <div className="flex flex-col w-full h-full justify-center items-center gap-2">
                        <FaSpinner className="text-2xl animate-spin" />
                        <p className="text-xl">Loading stats...</p>
                    </div>
                    :
                    <div className="w-full">
                        <div className="flex flex-col w-full gap-8">
                            <DataDisplay display={
                                <div className="w-full flex flex-col sm:flex-row lg:flex-col 2xl:flex-row gap-4">
                                    <DeckComp_PieChart />
                                    <DeckComp_StackBar />
                                </div>
                            } name="Deck composition" />
                        </div>

                        <div className="flex flex-col w-full gap-8">
                            <DataDisplay display={
                                <div className="w-full flex flex-col sm:flex-row lg:flex-col 2xl:flex-row gap-4">
                                    <EnergyCurve dataKey="total" />
                                    <EnergyCurve dataKey="value" />
                                </div>
                            } name="Energy costs & distribution" />
                        </div>

                        <div className="flex flex-col w-full items-center">
                        <h1 className={"sticky top-0 w-full text-2xl font-bold bg-background-1/80 p-4 z-10 backdrop-blur-sm"}>
                            Starting hand odds
                        </h1>
                            <div className="flex flex-col w-full items-center justify-center sm:flex-row lg:flex-col 2xl:flex-row gap-4 p-4">
                                <div className="flex flex-col w-full gap-4">
                                    <DrawGauge data={drawGaugeRef.current.basic} textValue={Math.round(drawGaugeRef.current.basic[0].value * 10) / 10} first />
                                </div>
                                <div className="flex flex-col w-full gap-4">
                                    <DrawGauge data={drawGaugeRef.current.energy} textValue={Math.round(drawGaugeRef.current.energy[0].value * 10) / 10} />
                                </div>
                            </div>
                        </div>
                    </div>
                    }
                </div>
            </div>
        </div>
    )
}