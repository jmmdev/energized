import { useSearch } from "@/context/search-context";
import { useEffect, useRef, useState } from "react";
import { FaCaretDown, FaCaretRight, FaFilter, FaPlus } from "react-icons/fa";
import Button from "./button";

export default function CardSearchFilters() {
    const { filters, search, trigger, isSearching } = useSearch();
    const [showFilters, setShowFilters] = useState(false);
    const [showFields, setShowFields] = useState(false);

    const optionsDisplayed = useRef([]);

    useEffect(() => {
        if (showFilters)
            document.getElementById("filter-list").setAttribute("open", "true")
    }, [showFilters])

    useEffect(() => {
        setShowFields(false);
    }, [search, trigger])

    const FilterField = ({field}) => {
        const [showOptions, setShowOptions] = useState(false);

        useEffect(() => {
            setShowOptions(optionsDisplayed.current.findIndex((elem) => elem === field.field_name) >= 0);
        }, [])

        const doShowOptions = () => {
            const elemIndex = optionsDisplayed.current.findIndex((elem) => elem === field.field_name);
            const newShowOptions = !showOptions;

            if (elemIndex >= 0 && !newShowOptions)
                optionsDisplayed.current.splice(elemIndex, 1);

            if(elemIndex < 0 && newShowOptions)
                optionsDisplayed.current.push(field.field_name);

            setShowOptions(newShowOptions);
        }

        return (
            <div className="flex flex-col gap-2">
                <button className={`flex items-center gap-1 capitalize font-bold ${isSearching ? "cursor-default" : "cursor-pointer hover:text-highlight"}`} onClick={isSearching ? () => {} : doShowOptions}>
                    {showOptions ? <FaCaretDown /> : <FaCaretRight />}
                    {field.field_name}
                </button>
                {showOptions &&
                    <div className={`flex flex-wrap gap-x-4 gap-y-2 transition-all pl-8 lg:pl-4`}>
                    {
                        field.field_options.map((option) => {
                            return (
                                <FieldOption field={field.field_name} option={option}
                                key={ field.field_name + (option.id || option)} />
                            )
                        })
                    }
                    </div>
                }
            </div>
        )
    }

    const FieldOption = ({field, option}) => {
        const { search, appliedFilters, setAppliedFilters } = useSearch();
        const [isChecked, setIsChecked] = useState(false);

        useEffect(() => {
            setIsChecked(getChecked() >= 0);
        }, [search])

        const getChecked = () => {
            const elemIndex = appliedFilters.findIndex((elem =>
                elem.field === field && elem.value === (option.id || option)
            ));
            return elemIndex;
        }

        const optionValue = JSON.stringify(
            {
                field, 
                value: option.id || option
            }
        )

        const evaluateOptionCheck = (checked) => {
            const optionIndex = getChecked();
            const newAppliedFilters = [...appliedFilters];

            if (optionIndex >= 0 && !checked) {
                newAppliedFilters.splice(optionIndex, 1);
                setAppliedFilters(newAppliedFilters);
            }

            if (optionIndex < 0 && checked) {
                newAppliedFilters.push(JSON.parse(optionValue));
                setAppliedFilters(newAppliedFilters);
            }

            setIsChecked(!isChecked);
        }

        return (
            <label className="flex items-center gap-1 hover:text-highlight">
                <input
                    type="checkbox"
                    name={field}
                    value={optionValue}
                    checked={isChecked}
                    onChange={() => evaluateOptionCheck(!isChecked)}
                  />
                {option.id ? option.name : option}
            </label>
        )
    }

     const GetAppliedFilterPills = () => {
        const { appliedFilters, setAppliedFilters } = useSearch();
        const output = [];

        const removeFilter = (field, value) => {
            const newAppliedFilters = [...appliedFilters];

            const elemIndex = newAppliedFilters.findIndex(elem => elem.field === field && elem.value === value);
            
            if (elemIndex >= 0) {
                newAppliedFilters.splice(elemIndex, 1);
                setAppliedFilters(newAppliedFilters);
            }
        }

        if (appliedFilters.length > 0) {
            for (const ap of appliedFilters) {
                output.push(
                    <button key={ap.field + ap.value} className={`group bg-background-2 px-2 py-1 text-sm rounded-full ${isSearching ? "cursor-default" : "cursor-pointer"}`}
                    onClick={isSearching ? () => {} : () => removeFilter(ap.field, ap.value)}>
                        <div className={`flex items-center gap-1 opacity-70 ${!isSearching && "group-hover:opacity-100"}`}>
                            <p>{ap.field}: {ap.value}</p>
                            <FaPlus className="rotate-45" />
                        </div>
                    </button>
                )
            }

            return (
                <div className={`w-full flex flex-wrap gap-2 ${output.length > 0 ? "mb-2" : ""}`}>
                    {output}
                </div>
            )
        }
        return null;
    }

    if (filters.length > 0)
        return (
            <div className={`px-4 py-2 lg:py-0 ${isSearching && "opacity-60"}`}>
                <Button className="lg:hidden w-full rounded p-1 text-my-white" color="blue" onClick={isSearching ? () => {} : () => setShowFilters(!showFilters)}>
                    <div className="flex justify-center items-center gap-2">
                        <FaFilter />
                        <p className="text-lg">Show filters</p>
                    </div>
                </Button>
                <div className={`fixed top-0 left-0 ${showFilters ? "" : "translate-x-full"} w-full h-full bg-background-1 transition-all z-100 overflow-y-hidden p-4 `+
                `lg:relative lg:h-auto lg:bg-transparent lg:z-0 lg:overflow-y-auto lg:translate-x-0 lg:p-0`}>
                    <div className="flex justify-between items-center text-xl font-bold mb-4 lg:hidden">
                        Search filters
                        <button className={`opacity-60 ${!isSearching ? "cursor-default" : "cursor-pointer hover:opacity-100"}`}
                        onClick={isSearching ? () => {} : () => setShowFilters(false)}>
                            <FaPlus className="text-xl rotate-45" />
                        </button>
                    </div>
                    <GetAppliedFilterPills />
                    <div id="filter-list" className="mb-2">
                        <button className={`flex items-center gap-1 ${isSearching ? "cursor-default" : "cursor-pointer hover:text-highlight"}`}
                        onClick={isSearching ? () => {} : () => setShowFields(!showFields)}>
                            {showFields ? <FaCaretDown /> : <FaCaretRight />}
                            Filter
                        </button>
                        {showFields &&
                        <div className="h-full flex flex-col gap-2 px-4 py-2 lg:bg-background-2 lg:rounded">
                            {
                                filters.map((field, index) => {
                                    if (field.field_options.length > 1)
                                        return <FilterField key={field.field_name} field={field} index={index} /> 
                                })
                            }
                        </div>
                        }
                    </div>
                </div>
            </div>
        )
    
        return null;
}