import { useSearch } from "@/context/search-context";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import Button from "./button";

export default function CardSearchFilters() {
    const { filters, appliedFilters, setAppliedFilters } = useSearch();

    const [showFilters, setShowFilters] = useState(false);

    const FilterField = ({field, isLarge}) => {
            return (
                <details className="flex flex-col gap-2">
                    <summary className="capitalize font-bold">{field.field_name}</summary>
                    <div className={`flex flex-wrap gap-4 transition-all`}>
                    {
                        field.field_options.map((option) => {
                            return (
                                <FieldOption field={field.field_name} option={option}
                                key={ (isLarge ? "lg-" : "") + field.field_name + (option.id || option)} />
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
                elem.field === field && elem.value === (option.id || option.replace(" ", ""))
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
            <div className="flex items-center gap-1">
                <input
                    type="checkbox"
                    name={field}
                    value={optionValue}
                    checked={isChecked}
                    onChange={() => setIsChecked(!isChecked)}
                  />
                {option.id ? option.name : option}
            </div>
        )
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const appliedFiltersData = [];
        for (const field of filters) {
            const checkBoxes = document.getElementsByName(field.field_name);
            for (const cb of checkBoxes) {
                if (cb.checked) {
                    console.log(cb.name, cb.value);
                    appliedFiltersData.push(JSON.parse(cb.value));
                }
            }
        }
        console.log(appliedFiltersData.length);
        setAppliedFilters(appliedFiltersData);
    }

    if (filters.length > 0)
        return (
            <form onSubmit={handleSubmit}>
                <details className={`fixed top-0 left-0 ${showFilters ? "" : "translate-x-full"} w-full h-full bg-background-1 transition-all z-100 overflow-y-hidden lg:hidden`}>
                    <summary>
                        Filter
                    </summary>
                    <div className="h-full flex flex-col gap-4 overflow-y-auto p-4">
                        <div className="flex justify-between items-center text-xl font-bold">
                            Search filters
                            <button className="cursor-pointer opacity-60 hover:opacity-100" onClick={() => setShowFilters(false)}>
                                <FaPlus className="text-xl rotate-45" />
                            </button>
                        </div>
                        {
                            filters.map((field, index) => {
                                return <FilterField key={"sm-" + field.field_name} field={field} index={index} /> 
                            })
                        }
                        <Button color="blue" content="apply" style="w-full xs:w-fit font-bold py-1 px-4 rounded" />
                    </div>
                </details>
                
                <details className={"hidden lg:block relative w-full mb-4"}>
                    <summary>
                        Filter
                    </summary>
                    <div className="h-full flex flex-col gap-4 p-4 bg-background-2 rounded">
                        {
                            filters.map((field, index) => {
                                return <FilterField key={"lg-" + field.field_name} field={field} index={index} isLarge={true} /> 
                            })
                        }
                        <Button color="blue" content="apply" style="text-sm font-bold py-1 rounded" />
                    </div>
                </details>
            </form>
        )
    
        return null;
}