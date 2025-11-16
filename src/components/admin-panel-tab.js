import { FaChevronDown, FaChevronLeft, FaChevronRight, FaChevronUp } from "react-icons/fa";

export default function AdminPanelTab({tab, setContent, setTab, name}) {
    return (
        <button className={"flex w-full justify-between items-center p-4 text-left uppercase cursor-pointer " + 
            `${tab === name ? "bg-background-2" : "bg-background-1 hover:bg-background-2/75"}`}
        onClick={() => {
            if (tab !== name) {
                setContent(null);
                setTab(name);
            }
        }}>
            <p>{name}</p>
            {tab === name ? <FaChevronRight className="hidden lg:block" /> : <FaChevronLeft className="hidden opacity-60 lg:block" />}
            {tab === name ? <FaChevronDown className="lg:hidden" /> : <FaChevronUp className="opacity-60 lg:hidden" />}
        </button>
    )
}