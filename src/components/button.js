export default function Button({content, color, style, name, action, disabled, onClick}) {

    const COLORS = require("/public/assets/files/button-colors.json");

    const colorToPick = COLORS[color] || null;
    const textColor = (color === "light" || color === "yellow" ? "text-my-black" : "text-my-white");

    return (
        <button className={`flex justify-center items-center uppercase text-sm rounded-xs px-3 py-1 ${textColor} ${disabled && "opacity-50"} ${!disabled && "cursor-pointer"} ${style} ` +
        `${colorToPick ? colorToPick.color : "bg-highlight"} ${!disabled && (colorToPick ? colorToPick.hover : "hover:bg-highlight-hover")} ${!disabled && (colorToPick ? colorToPick.active : "active:bg-highlight-active")}`} 
        onClick={onClick} disabled={disabled} name={name} action={action}>
            {content}
        </button>
    )
}