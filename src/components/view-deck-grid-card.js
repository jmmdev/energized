import { useState } from "react";
import GridCardImage from "./grid-card-image";

export default function ViewDeckGridCard({elem, setZoomIn, zoomRef}) {

    const [loaded, setLoaded] = useState(false);
 
    return (
        <div className="flex flex-col items-center gap-3">
            <GridCardImage elem={elem} loaded={loaded} setLoaded={setLoaded} zoomRef={zoomRef} setZoomIn={setZoomIn}>
                {loaded &&
                <div className="absolute flex items-center text-my-white bottom-2 right-2 bg-[#000b] rounded px-4 py-1">
                    <p className="text-2xl text-foreground font-bold">
                        x {elem.quantity} 
                    </p>
                </div> 
                }
            </GridCardImage>
        </div>
    )
}