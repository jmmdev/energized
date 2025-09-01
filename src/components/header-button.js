export default function HeaderButton({icon, iconStyle, text, href}) {
    return (
        <a className="flex flex-col md:flex-row px-1 py-1 md:gap-2 items-center text-2xl sm:text-xl md:text-2xl hover:text-highlight-hover cursor-pointer"
        href={href}>
            <div className={iconStyle}>
                {icon}
            </div>
            <p className="hidden sm:block text-xs md:text-sm">{text.toUpperCase()}</p>
        </a>
    )
}