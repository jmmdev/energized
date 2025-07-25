export default function SideMenuSection({content, type, handler, children}) {
    
    if (type === "button") {
        return (
            <button className="w-full text-left text-foreground border-l-5 border-transparent hover:border-highlight-hover hover:bg-container p-2 cursor-pointer" onClick={(e) => {
                e.stopPropagation();
            //handler();
            }}>
                {content}
            </button>
        );
    }

    return (
        <div className="w-full text-left text-foreground border-l-5 border-transparent hover:bg-container p-2">
            {content}
        </div>
    );
}