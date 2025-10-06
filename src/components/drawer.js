"use client";

import React, { useState } from "react"
import { FaCaretDown, FaCaretLeft, FaCaretRight, FaCaretUp } from "react-icons/fa";

export default function Drawer({children, drawerIcon, iconList}) {
    const [showChild, setShowChild] = useState(0);
    const [showDrawer, setShowDrawer] = useState(false);

    const GetChildren = () => {
        const childrenArray = React.Children.toArray(children);

        return childrenArray[showChild];
    }

    const GetDrawerButtons = () => {
        const output = [];
        
        for (const [index, icon] of iconList.entries()) {
            output.push(
                <button key={"button"+index} className={`group w-full flex justify-center items-center p-4 lg:p-3 text-xl ${showChild === index ? "cursor-default" : "cursor-pointer"}`} 
                onClick={() => setShowChild(index)}>
                    <div className={`${showChild === index ? "opacity-100" : "opacity-30 group-hover:opacity-60"}`}>
                        {icon}
                    </div>
                </button>
            );
            if (index < iconList.length-1)
                output.push(
                    <div key={"line-"+index} className="w-0.5 h-2/3 bg-[#fff]/30"/>
                )
        }

        return (
            <div className="sticky bottom-0 w-full flex items-center bg-background-1 z-20">
                {output}
            </div>
        )
    }

    return (
        <div className={`absolute lg:relative bottom-0 left-0 flex flex-col-reverse lg:flex-row w-full ${showDrawer ? "h-full" : "lg:w-auto h-auto"} 
        lg:max-w-[640px] max-h-full z-90 transition-all`}>
            <div className={`flex flex-col w-full bg-background-1 overflow-hidden ${showDrawer ? "flex-1" : "h-0 lg:w-0"}`}>
                <GetChildren />
                {iconList && iconList.length > 1 &&
                    <GetDrawerButtons />
                }
            </div>
            <button className={`group w-full lg:w-auto h-fit self-center flex flex-col border-background ${showDrawer ? "border-t-2" : "border-0 rounded-t"} 
            lg:rounded-none lg:rounded-r lg:flex-row items-center gap-2 p-4 bg-background-1 text-xl cursor-pointer`}
            onClick={() => setShowDrawer(!showDrawer)}>
                <div className="flex lg:flex-col opacity-30 group-hover:opacity-60 gap-1">
                    {drawerIcon}
                    <div className="hidden lg:block">
                        {showDrawer ? <FaCaretLeft /> : <FaCaretRight />}
                    </div>
                    <div className="lg:hidden">
                        {showDrawer ? <FaCaretDown /> : <FaCaretUp />}
                    </div>
                </div>
            </button>
        </div>
    )
}