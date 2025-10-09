import { useTheme } from "@/context/theme-context";
import { useEffect, useRef, useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Cell, Pie, PieChart, Legend } from "recharts";

export default function DeckStats({stats}) {
    const {theme, setTheme} = useTheme();

    const POKEMON_KEYS = ["Pokemon:Basic", "Pokemon:Stage1", "Pokemon:Stage2"];
    const TRAINER_KEYS = ["Trainer:Supporter", "Trainer:Item", "Trainer:Stadium"];
    const ENERGY_KEYS  = ["Energy:Normal", "Energy:Special"];

    const DataDisplay = ({display, name}) => {
        return (
            <div className="flex flex-col w-full items-center">
                <h1 className="sticky top-0 w-full text-2xl font-bold bg-background-2/80 p-4 z-10 backdrop-blur-sm">
                    {name}
                </h1>
                <div className="flex flex-col justify-center items-center w-full p-6 gap-4">
                    {display}
                </div>
            </div>
        )
    }

    const DeckComp_PieChart = () => {
        const COLORS = ["#10D47F", "#EF6052", "#1098FE"];
        
        return (
            <div className="flex flex-col w-full">
                <p className="font-semibold text-lg">By category</p>
                <PieChart width={250} height={250}>
                    <Legend  />
                    <Pie
                        data={stats.catComp}
                        dataKey="value"
                        isAnimationActive={false}
                        labelLine={false}
                        label={({ cx, cy, midAngle, innerRadius, outerRadius, name, value }) => {
                            const RADIAN = Math.PI / 180;
                            const radius = innerRadius + (outerRadius - innerRadius) * 0.58;
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
                                    <tspan className="text-xl font-bold" x={x} >{value}</tspan>
                                </text>
                            );
                        }}>
                        {stats.catComp.map((entry, index) => (
                        <Cell key={`cell-${entry.name}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                </PieChart>
            </div>
        )
    }

    
    const DeckComp_StackBar = () => {
        const accentColor = theme === "dark" ? "#eee" : "#111";
        const COLORS = {
            "Pokemon:Basic": "#00B46F",
            "Pokemon:Stage1": "#10D47F",
            "Pokemon:Stage2": "#20F48F",
            "Trainer:Supporter": "#DF3022",
            "Trainer:Item": "#EF6052",
            "Trainer:Stadium": "#FF9082",
            "Energy:Normal": "#0078DE",
            "Energy:Special": "#1098FE",
        };

        const hasData = (key) => stats.subcatComp.some(row => row[key] && row[key] > 0);
        const tickStyle = {fill: accentColor, fontWeight: 600};
        const lineStyle = {stroke: accentColor, strokeWidth: 2};

        return (
            <div className="flex flex-col w-full gap-4">
                <p className="font-semibold text-lg">By subcategory</p>
                <BarChart width={250} height={250} data={stats.subcatComp} barGap={4}>
                    <XAxis dataKey="category" tick={tickStyle} 
                    axisLine={lineStyle} tickLine={lineStyle} />
                    <YAxis allowDecimals={false} width={30} tick={tickStyle} padding={{bottom: 1}}
                    axisLine={lineStyle} tickLine={lineStyle} />
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
            </div>
        )
    }

    const EnergyCurve = ({dataKey}) => {
        const accentColor = theme === "dark" ? "#eee" : "#111";
        const tickStyle = {fill: accentColor, fontWeight: 600};
        const lineStyle = {stroke: accentColor, strokeWidth: 2};

        return (
            <div className="flex flex-col w-full gap-4">
                <p className="font-semibold text-lg">{dataKey === "total" ? "Total attack spread" : "Unique attack spread"}</p>
                <BarChart width={250} height={250} data={stats.energyDist}>
                    <XAxis dataKey="name" tick={tickStyle} 
                    axisLine={lineStyle} tickLine={lineStyle} />
                    <YAxis allowDecimals={false} width={30} tick={tickStyle} padding={{bottom: 1}}
                    axisLine={lineStyle} tickLine={lineStyle} />
                    <Bar dataKey={dataKey} fill={dataKey === "total" ? "#f7c950" : "#c4c4d4"} isAnimationActive={false}
                    label={({ payload, x, y, width, height, value }) => {
                        const fill = height < 50 
                        ? accentColor
                        : "#000"
                        if (value > 0)
                            return (
                                <text className="font-medium text-lg" fill={fill} textAnchor="middle"
                                x={x + width / 2} y={height < 50 ? (y - 5) : y + height / 2}>
                                    {value}
                                </text>
                            )
                    }} />
                </BarChart>
            </div>
        )
    }

    const DrawGauge = ({data, first, textValue}) => {
        const COLORS = [
            first ? "#ef4444" : "#3b82f6", 
            theme === "dark" ? "#e5e5e5" : "#1a1a1a"];

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

    if (stats)
        return (
                <div className="w-full overflow-y-auto stats-scrollbar">
                    <div className="flex flex-col w-full">
                        <DataDisplay display={
                            <div className="w-full flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-4">
                                <DeckComp_PieChart />
                                <DeckComp_StackBar />
                            </div>
                        } name="Deck composition" />
                    </div>

                    <div className="flex flex-col w-full">
                        <DataDisplay display={
                            <div className="w-full flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-4">
                                <EnergyCurve dataKey="total" />
                                <EnergyCurve dataKey="value" />
                            </div>
                        } name="Energy costs & distribution" />
                    </div>

                    <div className="flex flex-col w-full">
                        <DataDisplay display={
                            <div className="flex flex-col w-full items-center justify-center sm:flex-row lg:flex-col xl:flex-row gap-4 p-6">
                                <DrawGauge data={stats.drawOdds.basic} textValue={Math.round(stats.drawOdds.basic[0].value * 10) / 10} first />
                                <DrawGauge data={stats.drawOdds.energy} textValue={Math.round(stats.drawOdds.energy[0].value * 10) / 10} />
                            </div>
                        } name="Starting hand odds" />
                    </div>
                </div>
        )
    return (
        <p>Loading...</p>
    )
}