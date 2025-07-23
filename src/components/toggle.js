export default function Toggle({value1, value2, variable, setVariable}) {

    return (
        <div className="flex gap-2 items-center">
            {value1}
            <div className="group flex w-12 h-6 p-0.5 rounded-full border-2 border-foreground cursor-pointer" onClick={() => setVariable(!variable)}>
                <div className="relative w-full h-full">
                    <div className={`absolute left-0 h-full aspect-square bg-foreground rounded-full group-hover:opacity-60 transition-all
                        ${variable && "left-full -translate-x-full"}`} />
                </div>
            </div>
            {value2}
        </div>
    )
}