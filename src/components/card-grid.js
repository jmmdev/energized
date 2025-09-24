import { useEffect, useRef, useState } from "react";
import BuildDeckGridCard from "./build-deck-grid-card";
import ViewDeckGridCard from "./view-deck-grid-card";
import { FaPlus } from "react-icons/fa";

export default function CardGrid({cards, editable}) {
    const [zoomIn, setZoomIn] = useState(false);
    
    const zoomRef = useRef();
    const gridRef = useRef();
    
    const handleResize = () => {
        let timeout;
        clearTimeout(timeout);

        timeout = setTimeout(() => {
            const width = gridRef.current.parentElement.offsetWidth;
            const numColumns = Math.max(2, Math.floor(width / 250));
            
            if (gridRef.current) {
                gridRef.current.style.gridTemplateColumns = `repeat(${numColumns}, minmax(0, 1fr))`;
            }    
        }, 100);
    }

    useEffect(() => {
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [])
    
    useEffect(() => {
        if (zoomIn)
            document.body.style.overflow = "hidden";
        else
            document.body.style.overflow = "auto";
    }, [zoomIn])

    useEffect(() => {
        if (gridRef.current) {
            handleResize();
        }
    }, [gridRef.current])

    const GetZoomIn = ({elem}) => {
        if (zoomIn && zoomRef.current && (zoomRef.current === elem.card.id))
            return (
                <div className="fixed flex flex-col w-full h-full bg-[#000c] z-100 p-8 top-0 left-0">
                    <div className="w-full flex-1 flex flex-col justify-center gap-4">
                        <button className="self-end opacity-70 hover:opacity-100 cursor-pointer text-my-white" onClick={() => setZoomIn(false)}>
                            <FaPlus className="text-3xl rotate-45" />
                        </button>
                        <div className="relative w-full h-full">
                            <img className={`absolute inset-0 w-full h-full object-contain`} src={elem.card.image + "/high.webp"} alt={`${elem.card.name}#${elem.card.id}`} />
                        </div>
                    </div>
                </div>
            )
    }

    return (
        <div ref={gridRef} className={`grid gap-6 ${editable && "bg-background-1"} rounded-3xl xs:rounded-xl sm:rounded-lg`}>
            {
                cards.map((elem) => {
                    return (
                            <div key={"grid"+elem.card.id}>
                                {editable 
                                    ? <BuildDeckGridCard elem={elem} setZoomIn={setZoomIn} zoomRef={zoomRef} />
                                    : <ViewDeckGridCard elem={elem} setZoomIn={setZoomIn} zoomRef={zoomRef} />
                                }
                                <GetZoomIn elem={elem} />
                            </div>
                        )
                })
            }
        </div>
    )
}