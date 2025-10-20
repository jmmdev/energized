export default function BuilderDeckTopButton({children, onClick, selected, className}) {
    return (
        <button className={`text-foreground ${selected ? "" : "opacity-60"} hover:opacity-100 cursor-pointer text-xl ${className}`} onClick={onClick}>
            {children}
        </button>
    )
}