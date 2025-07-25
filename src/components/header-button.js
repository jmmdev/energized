export default function HeaderButton({icon, iconStyle, text, handler}) {
    return (
        <button className="flex px-1 py-1 gap-2 items-center text-2xl hover:text-highlight-hover cursor-pointer"
        onClick={handler}>
            <div className={iconStyle}>
                {icon}
            </div>
            <p className="hidden sm:block text-base">{text.toUpperCase()}</p>
        </button>
    )
}