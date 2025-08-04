import { FaCaretLeft, FaCaretRight } from "react-icons/fa";
import Button from "./button";

export default function Pagination({list, pageNumber, setPageNumber, perPage}) {

    const minusDisabled = pageNumber <= 0;
    const plusDisabled = pageNumber >= Math.ceil(list.length / perPage) - 1;

    return (
        <div className="w-full flex justify-center text-2xl">
            <Button color="none" content={<FaCaretLeft />} onClick={() => setPageNumber(pageNumber-1)} disabled={minusDisabled} />
            <p>{pageNumber + 1}</p>
            <Button color="none" content={<FaCaretRight />} onClick={() => setPageNumber(pageNumber+1)} disabled={plusDisabled} />
        </div>
    )
}