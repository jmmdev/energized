"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";

export default function AdminContent({tab}) {
    const [content, setContent] = useState();
    const [loading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
    }, [tab])

    useEffect(() => {
        const getTabContentData = async () => {
            const response = await axios.get(`/api/xapi/admin/${tab}`);
            setContent(response.data);
        }
        if (loading)
            getTabContentData();
    }, [loading])

    useEffect(() => {
        if (content) {
            let timeout;
            clearTimeout(timeout);
            
            timeout = setTimeout(() => {
                setIsLoading(false);
            }, 500);
        }
    }, [content])

    return (
        <section className="hidden lg:flex flex-col lg:flex-1 p-8">
            {loading ?
                <div className="flex flex-col gap-2 text-2xl justify-center items-center lg:flex-1">
                    <FaSpinner className="animate-spin" />
                    Retrieving {tab} data...
                </div>
            :
                <p>{tab} {content}</p>
            }
        </section>
    )
}