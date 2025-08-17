import { useSearch } from "@/context/search-context";
import { useEffect, useRef, useState } from "react";
import { FaCaretUp, FaRegSquare, FaCheckSquare, FaPlus, FaCaretRight } from "react-icons/fa";
import { FaCaretDown, FaFilter } from "react-icons/fa6";
import Button from "./button";

export default function CardSearchFilters() {
    const { filters, applyFilters } = useSearch();

    const [showFilters, setShowFilters] = useState(false);
    const [fieldShown, setFieldShown] = useState(-1);

    const selectedFilters = useRef([]);

    const FilterField = ({field, index}) => {
        const [showField, setShowField] = useState(false);

        useEffect(() => {
            setShowField(fieldShown === index);
        }, [fieldShown])

        const doShowField = () => {
            if (fieldShown !== index)
                setFieldShown(index)
            else
                setFieldShown(-1);
        }

            return (
                <div className="flex flex-col gap-2">
                    <div className={`group flex items-center gap-1 cursor-pointer hover:text-sky-400 border-background-2 pb-1 ${showField && "border-b"}`}
                    onClick={doShowField}>
                        {showField ? <FaCaretDown /> : <FaCaretRight />}
                        <p className="capitalize font-bold">{field.field_name}</p>
                    </div>
                    {showField &&
                    <div className="flex flex-wrap gap-4 overflow-y-hidden transition-all">
                    {
                        field.field_options.map((option, index) => {
                            return (
                                <FieldOption key={index + field.field_name} field={field.field_name} option={option} />
                            )
                        })
                    }
                    </div>
                    }
                </div>
            )
    }

    const FieldOption = ({field, option}) => {
        const [checked, setChecked] = useState(false);

        useEffect(() => {
            setChecked(getChecked() >= 0);
        }, [])

        const getChecked = () => {
            const elemIndex = selectedFilters.current.findIndex((elem => 
                elem.field === field.toLowerCase() && elem.value === (option.option_id || option.option_name.toLowerCase())
            ));

            return elemIndex;
        }

        const doCheck = () => {
            if (!checked) {
                selectedFilters.current.push(
                    {
                        field: field.toLowerCase(),
                        value: option.option_id || option.option_name.toLowerCase().replace(" ", ""), 
                    }
                )
            console.log(selectedFilters.current);
                setChecked(true)
            }
            else {
                const indexToRemove = getChecked();

                if (indexToRemove >= 0)
                    selectedFilters.current.splice(indexToRemove, 1);

            console.log(selectedFilters.current);
                setChecked(false);
            }
        }

        return (
            <div className="flex items-center gap-1 cursor-default hover:text-sky-400" onClick={doCheck}>
                {checked ? <FaCheckSquare /> : <FaRegSquare />}
                {option.option_name}
            </div>
        )
    }

    return (
        <>
            <button className="pb-2 text-foreground opacity-60 hover:opacity-100 cursor-pointer border-background-2" onClick={() => setShowFilters(!showFilters)}>
                <div className="flex items-center gap-1">
                    <FaFilter />
                    Filter
                </div>
            </button>
            
            <div className={`fixed top-0 left-0 ${showFilters ? "" : "translate-x-full"} w-full h-full bg-background-1 transition-all z-100 overflow-y-hidden lg:hidden`}>
                <div className="h-full flex flex-col gap-4 overflow-y-auto p-4">
                    <div className="flex justify-between items-center text-xl font-bold">
                        Search filters
                        <button className="cursor-pointer opacity-60 hover:opacity-100" onClick={() => setShowFilters(false)}>
                            <FaPlus className="text-xl rotate-45" />
                        </button>
                    </div>
                    {
                        filters.map((field, index) => {
                            return <FilterField key={field.field_name} field={field} index={index} /> 
                        })
                    }
                    <Button color="blue" content="apply" style="w-full xs:w-fit font-bold py-1 px-4 rounded" />
                </div>
            </div>
            
            {showFilters &&
             <div className="hidden lg:block relative w-full mb-4">
                <div className="h-full flex flex-col gap-4 p-4 bg-background-2 rounded">
                    {
                        filters.map((field, index) => {
                            return <FilterField key={field.field_name} field={field} index={index} /> 
                        })
                    }
                    <Button color="blue" content="apply" style="text-sm font-bold py-1 rounded" onClick={applyFilters}/>
                </div>
            </div>
            }
        </>
    )
}