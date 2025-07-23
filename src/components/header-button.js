export default function HeaderButton({icon, iconStyle, text, handler}) {
    return (
        <button className="flex h-full px-3 py-2 gap-2 items-center text-2xl border-2 hover:bg-container border-background hover:border-b-foreground transition-all cursor-pointer"
        onClick={handler}>
            <div className={iconStyle}>
                {icon}
            </div>
            <p className="hidden sm:block text-base">{text.toUpperCase()}</p>
        </button>
    )
}