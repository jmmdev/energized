import { useEffect, useRef, useState } from "react";
import BuildDeckListCard from "./build-deck-list-card";
import ViewDeckListCard from "./view-deck-list-card";
import CardZoomIn from "./card-zoom-in";
import BuildDeckGridCard from "./build-deck-grid-card";
import ViewDeckGridCard from "./view-deck-grid-card";

export default function CardDisplay({cards, editable, display}) {
    const [zoomIn, setZoomIn] = useState(false);
    
    const zoomRef = useRef();
    const containerRef = useRef();

    useEffect(() => {
        const element = containerRef.current.parentElement;

        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                const width = entry.contentRect.width;
                const threshold = (display === "grid" ? 210 : 550);
                const minColumns = display === grid ? 2 : 1;

                const numColumns = Math.max(minColumns, Math.floor(width / threshold));
        
                if (containerRef.current) {
                    containerRef.current.style.gridTemplateColumns = `repeat(${numColumns}, minmax(0, 1fr))`;
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
        <div ref={containerRef} className={`grid ${display === "grid" ? "gap-6 rounded-3xl xs:rounded-xl sm:rounded-lg" : "gap-4"}`}>
            {
                cards.map((elem) => {
                    return (
                            <div key={"card"+elem.card.id}>
                                {display === "grid"
                                ?
                                <>
                                    {editable 
                                        ? <BuildDeckGridCard elem={elem} setZoomIn={setZoomIn} zoomRef={zoomRef} />
                                        : <ViewDeckGridCard elem={elem} setZoomIn={setZoomIn} zoomRef={zoomRef} />
                                    }
                                </>
                                :
                                <>
                                    {editable 
                                        ? <BuildDeckListCard elem={elem} setZoomIn={setZoomIn} zoomRef={zoomRef} />
                                        : <ViewDeckListCard elem={elem} setZoomIn={setZoomIn} zoomRef={zoomRef} />
                                    }
                                </>
                                }
                                <CardZoomIn zoomIn={zoomIn} setZoomIn={setZoomIn} elem={elem} zoomRef={zoomRef} />
                            </div>
                        )
                })
            }
        </div>
    )
}