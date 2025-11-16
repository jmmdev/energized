"use client";

import { useEffect, useRef, useState } from "react";
import Button from "./button";
import { FaCaretDown } from "react-icons/fa";

export default function AdminFilters({tab, filters, setFilters}) {
    const [name, setName] = useState(filters.name || "");
    const [creator, setCreator] = useState(filters.creator || "");
    const [role, setRole] = useState(filters.role || "");
    const [status, setStatus] = useState(filters.status || "");
    const [visible, setVisible] = useState(filters.visible || "");

    const DropdownFilter = ({currentValue, setCurrentValue, options}) => {
        const [showOptions, setShowOptions] = useState(false);
        const selectorRef = useRef(null);

        useEffect(() => {
            function handleClickOutside(e) {
                if (selectorRef.current && !selectorRef.current.contains(e.target)) {
                    setShowOptions(false);
                }
            }

            document.addEventListener("mouseup", handleClickOutside);
            return () => document.removeEventListener("mouseup", handleClickOutside);
        }, []);

        return (
            <div ref={selectorRef} className="relative">
                <Button color="gray" className={`flex w-32 h-6 items-center gap-1 px-1 ${showOptions ? "rounded-t-xs" : "rounded-xs"}`} 
                onClick={() => setShowOptions(!showOptions)}>
                    <span className="flex-1 text-left">{currentValue}</span>
                    <FaCaretDown />
                </Button>
                {showOptions &&
                <div className="absolute top-full left-0 w-32 z-30 mt-[1px]">
                    {
                        options.map((opt) => {
                            return (
                                <Button key={opt} color="gray" className="flex w-full h-6 items-center gap-1 px-1 uppercase" 
                                onClick={() => {
                                    setCurrentValue(opt);
                                    setShowOptions(false);
                                }}>
                                    <span className="flex-1 text-left">{opt}</span>
                                </Button>
                            )
                        })
                    }
                </div>
                }
            </div>
        )
    }

    const applyFilters = (e) => {
        e.preventDefault();

        const newFilters = {};

        if (name.length > 0)
            newFilters.name = name;
        if (creator.length > 0)
            newFilters.creator = creator;
        if (role.length > 0)
            newFilters.role = role;
        if (status.length > 0)
            newFilters.status = status;
        if (visible.length > 0)
            newFilters.visible = visible;

        setFilters(newFilters);
    }

    return (
        <form className="flex flex-col 2xl:flex-row 2xl:justify-between gap-4" onSubmit={applyFilters}>
                <div className="flex flex-col gap-2">
                    <span className="opacity-60">FILTERS</span>
                <div className="flex flex-col 2xl:flex-row 2xl:justify-between 2xl:items-center gap-2 2xl:gap-4">
                    <div className="flex items-center gap-1">
                        <span className="opacity-60">{tab === "users" ? "Username" : "Name"}:</span>
                        <input className="bg-background-1" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    {tab === "users" &&
                        <>
                        <div className="flex items-center gap-1">
                            <span className="opacity-60">Role:</span>
                            <DropdownFilter currentValue={role} setCurrentValue={setRole} 
                            options={["owner", "admin", "user"]} />
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="opacity-60">Status:</span>
                            <DropdownFilter currentValue={status} setCurrentValue={setStatus} 
                            options={["active", "suspended"]} />
                        </div>
                        </>
                    }
                    {tab === "decks" &&
                        <>
                            <div className="flex items-center gap-1">
                                <span className="opacity-60">Creator:</span>
                                <input className="bg-background-1" value={creator} onChange={(e) => setCreator(e.target.value)} />
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="opacity-60">Visibility:</span>
                                <DropdownFilter currentValue={visible} setCurrentValue={setVisible} 
                                options={["public", "private", "hidden"]} />
                            </div>
                        </>
                    }
                </div>
            </div>
            <div className="flex gap-4 justify-end self-end">
                <button className="underline capitalize cursor-pointer hover:text-highlight-hover active:text-highlight-active"
                onClick={() => setFilters({})} type="button">
                    clear
                </button>
                <Button type="submit" color="blue" className="rounded px-2">
                    apply
                </Button>
            </div>
        </form>
    )
}