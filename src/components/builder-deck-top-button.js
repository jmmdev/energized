export default function BuilderDeckTopButton({content, onClick, selected}) {
    return (
        <button className={`text-foreground ${selected ? "" : "opacity-60"} hover:opacity-100 cursor-pointer text-xl`} onClick={onClick}>
            {content}
        </button>
    )
}