import { useSearch } from "@/context/search-context";
import { useEffect, useState } from "react";
import { FaFilter, FaPlus } from "react-icons/fa";
import Button from "./button";

export default function CardSearchFilters() {
    const { filters, appliedFilters, setAppliedFilters, isSearching } = useSearch();

    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        if (showFilters)
            document.getElementById("filter-list").setAttribute("open", "true")
    }, [showFilters])

    const FilterField = ({field}) => {
            return (
                <details className="flex flex-col gap-2">
                    <summary className="capitalize font-bold cursor-pointer hover:text-highlight">{field.field_name}</summary>
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
                </details>
            )
    }

    const FieldOption = ({field, option}) => {
        const [isChecked, setIsChecked] = useState(false);

        useEffect(() => {
            setIsChecked(getChecked() >= 0);
        }, [])

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

        return (
            <label className="flex items-center gap-1 hover:text-highlight">
                <input
                    type="checkbox"
                    name={field}
                    value={optionValue}
                    checked={isChecked}
                    onChange={() => setIsChecked(!isChecked)}
                  />
                {option.id ? option.name : option}
            </label>
        )
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const appliedFiltersData = [];
        for (const field of filters) {
            const checkBoxes = document.getElementsByName(field.field_name);
            for (const cb of checkBoxes) {
                if (cb.checked) {
                    appliedFiltersData.push(JSON.parse(cb.value));
                }
            }
        }
        setAppliedFilters(appliedFiltersData);
        document.getElementById("filter-list").removeAttribute("open");
        setShowFilters(false);
    }

    if (filters.length > 0 && !isSearching)
        return (
            <div className="px-4 py-2 lg:py-0">
                <Button style="lg:hidden w-full rounded p-1 text-my-white" color="blue" onClick={() => setShowFilters(!showFilters)}
                content={   
                    <div className="flex justify-center items-center gap-2">
                    <FaFilter />
                    <p className="text-lg">Show filters</p>
                    </div>
                }
                />
                <form className={`fixed top-0 left-0 ${showFilters ? "" : "translate-x-full"} w-full h-full bg-background-1 transition-all z-100 overflow-y-hidden p-4 `+
                `lg:relative lg:h-auto lg:bg-transparent lg:z-0 lg:overflow-y-auto lg:translate-x-0 lg:p-0`}
                onSubmit={handleSubmit}>
                    <div className="flex justify-between items-center text-xl font-bold mb-4 lg:hidden">
                        Search filters
                        <div className="cursor-pointer opacity-60 hover:opacity-100" onClick={() => setShowFilters(false)}>
                            <FaPlus className="text-xl rotate-45" />
                        </div>
                    </div>
                    <details id="filter-list">
                        <summary className="cursor-pointer hover:text-highlight">
                            Filter
                        </summary>
                        <div className="h-full flex flex-col gap-2 p-4 mt-2 lg:bg-background-2 lg:rounded">
                            {
                                filters.map((field, index) => {
                                    if (field.field_options.length > 1)
                                        return <FilterField key={field.field_name} field={field} index={index} /> 
                                })
                            }
                            <Button color="blue" content="apply" style="w-full xs:w-fit font-bold py-1 px-4 rounded" />
                        </div>
                    </details>
                </form>
            </div>
        )
    
        return null;
}