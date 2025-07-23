export default function SideMenuButton({content, handler}) {
    return (
        <button className="w-full text-left bg-background text-foreground hover:bg-foreground hover:text-background p-2 cursor-pointer" onClick={(e) => {
            e.stopPropagation();
            //handler();
        }}>
            {content}
        </button>
    )

}