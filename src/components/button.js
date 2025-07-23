export default function Button({content, color, style, name, action, disabled, onClick}) {

    const COLORS = require("/public/assets/files/colors.json");

    const colorToPick = COLORS[color] || COLORS["red"];

    return (
        <button className={`uppercase text-sm text-my-white rounded-xs px-3 py-1 ${disabled && "opacity-50"} ${!disabled && "cursor-pointer"} ${style} ${colorToPick.color} ${!disabled && colorToPick.hover} ${!disabled && colorToPick.active}`} 
        onClick={onClick} disabled={disabled} name={name} action={action}>
            {content}
        </button>
    )
}