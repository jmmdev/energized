export default function Button({children, color, className, name, action, type, disabled, onClick}) {

    const COLORS = require("/public/assets/files/button-colors.json");

    const colorToPick = COLORS[color] || null;

    return (
        <button className={`flex justify-center items-center uppercase ${disabled && "opacity-50"} ${!disabled && "cursor-pointer"} ${className} ` +
        `${colorToPick ? colorToPick.color : "bg-highlight"} ${!disabled && (colorToPick ? colorToPick.hover : "hover:bg-highlight-hover")} ${!disabled && (colorToPick ? colorToPick.active : "active:bg-highlight-active")}`} 
        onClick={onClick} disabled={disabled} name={name} action={action} type={type || "button"}>
            {children}
        </button>
    )
}