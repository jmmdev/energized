import { FaCaretLeft, FaCaretRight } from "react-icons/fa";
import Button from "./button";

export default function Pagination({list, pageNumber, setPageNumber, perPage}) {

    const minusDisabled = pageNumber <= 0;
    const plusDisabled = pageNumber >= Math.ceil(list.length / perPage) - 1;

    return (
        <div className="w-full flex flex-col items-center gap-2 mt-auto py-2">
            <div className="flex gap-2">
                <Button color="none" content={<FaCaretLeft />} style="px-[4px_!important] text-2xl" onClick={() => setPageNumber(pageNumber-1)} disabled={minusDisabled} />
                <p className="text-2xl">{pageNumber + 1}</p>
                <Button color="none" content={<FaCaretRight />} style="px-[4px_!important] text-2xl" onClick={() => setPageNumber(pageNumber+1)} disabled={plusDisabled} />
            </div>
        </div>
    )
}