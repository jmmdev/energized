import { useState } from "react";
import { FaChevronDown, FaChevronLeft } from "react-icons/fa";

export default function AdminPanelDropdown({tabs, activeTab, setActiveTab, setContent}) {
    const [showTabs, setShowTabs] = useState(false);
    
    return (
        <div className="relative w-full">
            <button className={`flex w-full justify-end items-center gap-4 p-4 uppercase cursor-pointer border-b border-background-2 
            ${showTabs ? "bg-background-2/75" : "bg-background-1 hover:bg-background-2/75"}`}
            onClick={() => setShowTabs(!showTabs)}>
                <p>{activeTab}</p>
                {showTabs ? <FaChevronDown /> : <FaChevronLeft />}
            </button>
            {showTabs &&
                <div className="absolute flex flex-col w-full z-30">
                    {
                        tabs.map((t) => {
                            if (t !== activeTab)
                                return (
                                    <button key={t} onClick={() => {
                                        setContent(null);
                                        setActiveTab(t)
                                    }} className="flex w-full justify-end items-center gap-4 p-4 border-b border-background-2  
                                    uppercase cursor-pointer bg-background-1 hover:bg-background-2">
                                        <p>{t}</p>
                                    </button>
                                )
                        })
                    }
                    <div className="h-dvh bg-[#0008]" onClick={() => setShowTabs(false)} />
                </div>
            }
        </div>
    )
}