export default function SideMenuButton({content, handler}) {
    return (
        <button className="w-full text-left text-foreground border-l-5 border-transparent hover:border-highlight hover:bg-container p-2 cursor-pointer" onClick={(e) => {
            e.stopPropagation();
            //handler();
        }}>
            {content}
        </button>
    )

}