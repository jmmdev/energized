export default function BuilderDeckTopButton({content, onClick, selected, style}) {
    return (
        <button className={`text-foreground ${selected ? "" : "opacity-60"} hover:opacity-100 cursor-pointer text-xl ${style}`} onClick={onClick}>
            {content}
        </button>
    )
}