import { useSearch } from "@/context/search-context";
import { useEffect, useRef, useState } from "react";
import { FaCaretUp, FaRegSquare, FaCheckSquare } from "react-icons/fa";
import { FaCaretDown, FaFilter } from "react-icons/fa6";

export default function CardSearchFilters() {
    const { filters } = useSearch();

    const [showFilters, setShowFilters] = useState(false);

    const filterRef = useRef();

    useEffect(() => {
        if (showFilters)
            filterRef.current.style.height = filterRef.current.scrollHeight + "px";
        else
            filterRef.current.style.height = 0;
    }, [showFilters]);

    const FilterField = ({field}) => {
        const [showField, setShowField] = useState(false);

        useEffect(() => {
            if (showField)
                fieldRef.current.style.height = fieldRef.current.scrollHeight + "px";
            else
                fieldRef.current.style.height = 0;
        }, [showField]);

        const fieldRef = useRef();
        
        return (
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-4" onClick={() => setShowField(!showField)}>
                    <p className="capitalize">{field.field_name}</p>
                    <div className="flex-1 h-[1px] bg-foreground" />
                </div>
                <div ref={fieldRef} className="flex flex-wrap gap-4 overflow-y-hidden transition-all">
                {
                    field.field_options.map((option, index) => {
                        return (
                            <FieldOption key={index + field.field_name} option={option} />
                        )
                    })
                }
                </div>
            </div>
        )
    }

    const FieldOption = ({option}) => {
        const [checked, setChecked] = useState(option.checked);

        return (
            <div className="flex items-center gap-1 cursor-base" onClick={() => setChecked(!checked)}>
                {checked ? <FaCheckSquare /> : <FaRegSquare />}
                {option.option_name}
            </div>
        )
    }

    return (
        <div className="w-full flex flex-col">
            <button className="text-foreground opacity-60 hover:opacity-100 cursor-pointer" onClick={() => setShowFilters(!showFilters)}>
                <div className="flex items-center gap-1">
                    Filter
                    <div className="flex items-center">
                        <FaFilter className="text-sm" />
                        {showFilters ? <FaCaretUp className="text-xs" /> : <FaCaretDown className="text-xs" />}
                    </div>
                </div>
            </button>
            <div className="w-full pt-2 pr-2">
                <div className="w-full h-[1px] bg-background-2" />
            </div>
            <div ref={filterRef} className={`w-full overflow-y-hidden transition-all`}>
                <div className="flex flex-col gap-4 py-2">
                    {
                        filters.map((field) => {
                            return <FilterField key={field.field_name} field={field} /> 
                        })
                    }
                </div>
                <div className="w-full pr-2">
                    <div className="w-full h-[1px] bg-background-2" />
                </div>
            </div>
        </div>
    )
}