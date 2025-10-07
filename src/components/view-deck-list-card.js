import ListCardImage from "./list-card-image";

export default function ViewDeckListCard({elem, setZoomIn, zoomRef}) {

    return (
        <ListCardImage elem={elem} setZoomIn={setZoomIn} zoomRef={zoomRef}>
            <p className="text-4xl font-bold">x {elem.quantity}</p>
        </ListCardImage>
    )
}