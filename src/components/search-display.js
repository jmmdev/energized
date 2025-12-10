"use client";
import { useSession } from "next-auth/react";
import ListDisplay from "./list-display";
import Footer from "./footer";

export default function SearchDisplay({target, data, name}) {
    const {data: session, status} = useSession();

    if (status !== "loading")
        return (
            <>
                <div className="w-full flex flex-1 justify-center">
                    <div className="w-full flex flex-col max-w-[1300px] justify-center p-8 xl:p-12 gap-4">
                        <ListDisplay type={target} list={data} name={name} perPage={12} from={`/search/${target}?name=${name}`} />
                    </div>
                </div>
                <Footer />
            </>
        )
}