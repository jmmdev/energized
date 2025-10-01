import { useEffect, useRef, useState } from "react";
import BuildDeckGridCard from "./build-deck-grid-card";
import ViewDeckGridCard from "./view-deck-grid-card";
import CardZoomIn from "./card-zoom-in";

export default function CardGrid({cards, editable}) {
    const [zoomIn, setZoomIn] = useState(false);
    
    const zoomRef = useRef();
    const gridRef = useRef();

    useEffect(() => {
        const element = gridRef.current.parentElement;

        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                const width = entry.contentRect.width;
                const numColumns = Math.max(2, Math.floor(width / 250));
        
                if (gridRef.current) {
                    gridRef.current.style.gridTemplateColumns = `repeat(${numColumns}, minmax(0, 1fr))`;
                }    
            }
        })
        resizeObserver.observe(element);
    }, [])
    
    useEffect(() => {
        if (zoomIn)
            document.body.style.overflow = "hidden";
        else
            document.body.style.overflow = "auto";
    }, [zoomIn])

    return (
        <div ref={gridRef} className={`grid gap-6 rounded-3xl xs:rounded-xl sm:rounded-lg`}>
            {
                cards.map((elem) => {
                    return (
                            <div key={"grid"+elem.card.id}>
                                {editable 
                                    ? <BuildDeckGridCard elem={elem} setZoomIn={setZoomIn} zoomRef={zoomRef} />
                                    : <ViewDeckGridCard elem={elem} setZoomIn={setZoomIn} zoomRef={zoomRef} />
                                }
                                <CardZoomIn zoomIn={zoomIn} setZoomIn={setZoomIn} elem={elem} zoomRef={zoomRef} />
                            </div>
                        )
                })
            }
        </div>
    )
}