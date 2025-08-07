export default function BuilderDeckTopButton({content, onClick}) {
    return (
        <button className="text-foreground opacity-60 hover:opacity-100 cursor-pointer text-xl" onClick={onClick}>
            {content}
        </button>
    )
}