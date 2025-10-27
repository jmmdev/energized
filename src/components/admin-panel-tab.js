import { FaChevronDown, FaChevronRight } from "react-icons/fa";

export default function AdminPanelTab({tab, setTab, name}) {
    return (
        <button className={"flex justify-between items-center p-4 text-left uppercase cursor-pointer border-b border-background-2 " + 
            `${tab === name ? "bg-background-2" : "bg-transparent hover:bg-background-2/50"}`}
        onClick={() => setTab(name)}>
            <p>{name}</p>
            {tab === name && 
                <>
                    <FaChevronRight className="hidden lg:block" />
                    <FaChevronDown className="lg:hidden" />
                </>
            }
        </button>
    )
}