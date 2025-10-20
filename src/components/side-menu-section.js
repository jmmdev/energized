import Link from "next/link";

export default function SideMenuSection({children, type, href}) {
    
    if (type === "link") {
        return (
            <Link className="inline-block w-full text-foreground border-l-5 border-transparent hover:border-highlight hover:bg-background-1 cursor-pointer p-2" 
            href={href} target="_blank">
                {children}
            </Link>
        );
    }

    return (
        <div className="w-full text-left text-foreground border-l-5 border-transparent p-2">
            {content}
        </div>
    );
}