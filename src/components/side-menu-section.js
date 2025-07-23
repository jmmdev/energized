export default function SideMenuSection({content, children}) {
    return (
        <div className="w-full flex text-left bg-background text-foreground p-2">
            {content}
            {children}
        </div>
    )

}