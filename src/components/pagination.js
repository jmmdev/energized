import { FaCaretLeft, FaCaretRight } from "react-icons/fa";
import Button from "./button";

export default function Pagination({quantity, pageNumber, setPageNumber, perPage}) {

    const minusDisabled = pageNumber <= 0;
    const plusDisabled = pageNumber >= Math.ceil(quantity / perPage) - 1;

    return (
        <div className="w-full flex flex-col items-center gap-2 mt-auto py-2">
            <div className="flex gap-2">
                <Button color="none" className={`px-1 text-2xl ${minusDisabled ? "invisible" : ""}`} 
                onClick={() => setPageNumber(pageNumber - 1)} disabled={minusDisabled}>
                    <FaCaretLeft />
                </Button>
                {(!minusDisabled || !plusDisabled) &&
                    <p className="text-2xl">{pageNumber + 1}</p>
                }
                <Button color="none" className={`px-1 text-2xl ${plusDisabled ? "invisible" : ""}`} 
                onClick={() => setPageNumber(pageNumber + 1)} disabled={plusDisabled}>
                    <FaCaretRight />
                </Button>
            </div>
        </div>
    )
}