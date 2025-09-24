export default function HeaderButton({icon, iconStyle, text, href}) {
    return (
        <a className="flex flex-col md:flex-row px-1 py-1 gap-1 md:gap-2 items-center text-2xl hover:text-highlight cursor-pointer"
        href={href}>
            <div className={iconStyle}>
                {icon}
            </div>
            <p className="hidden md:block text-sm">{text.toUpperCase()}</p>
        </a>
    )
}