"use client";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import ListDisplay from "@/components/list-display";

export default function TargetSearch() {
    const {data: session, status} = useSession();
    const params = useParams();
    const searchParams = useSearchParams();

    const [output, setOutput] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const getOutput = async () => {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/${params.target}/search/${searchParams.get("name")}`);
            setOutput(response.data);
        }
        getOutput();
    }, [searchParams.get("name")])

    useEffect(() => {
        if (output && (status !== "loading")){
            setIsLoading(false);
        }
    }, [output, status])

    if (!isLoading) {
        return (
            <div className="w-full flex h-full justify-center">
                <div className="w-full flex flex-col max-w-[1440px] justify-center p-8 xl:p-12 gap-4">
                    <ListDisplay type={params.target} list={output} name={searchParams.get("name")} />
                </div>
            </div>
        )
    }
    
    return null;
}