export default function Button({content, color, style, name, action, disabled, onClick}) {

    const COLORS = require("/public/assets/files/colors.json");

    const colorToPick = COLORS[color] || COLORS["red"];
    const textColor = (color === "light" ? "text-my-black" : "text-my-white");

    return (
        <button className={`uppercase text-sm rounded-xs px-3 py-1 ${textColor} ${disabled && "opacity-50"} ${!disabled && "cursor-pointer"} ${style} ${colorToPick.color} ${!disabled && colorToPick.hover} ${!disabled && colorToPick.active}`} 
        onClick={onClick} disabled={disabled} name={name} action={action}>
            {content}
        </button>
    )
}