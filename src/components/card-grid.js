import { useEffect, useRef } from "react";
import BuildDeckGridCard from "./build-deck-grid-card";
import ViewDeckGridCard from "./view-deck-grid-card";

export default function CardGrid({cards, editable}) {
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
        if (gridRef.current) {
            handleResize();
        }
    }, [gridRef.current])

    return (
        <div ref={gridRef} className={`grid gap-6 ${editable && "bg-background-1"} rounded-3xl xs:rounded-xl sm:rounded-lg`}>
            {editable ?
                <>
                {
                    cards.map((elem) => {
                        return <BuildDeckGridCard key={"grid"+elem.card.id} elem={elem} />
                    })
                }
                </>
            :
                <>
                {
                    cards.map((elem) => {
                        return <ViewDeckGridCard key={"grid"+elem.card.id} elem={elem} />
                    })
                }
                </>
            }
        </div>
    )
}