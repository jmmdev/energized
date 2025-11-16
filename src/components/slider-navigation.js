export default function SliderNavigation({quantity, currentSlide, setCurrentSlide}) {
    
    const GetNavigation = () => {
        const output = [];
        for(let i=0; i<quantity; i++) {
            output.push(
                <button key={i} className="group h-5 flex items-center cursor-pointer px-1" onClick={() => setCurrentSlide(i)}>
                    <div className={`w-8 h-1 rounded-full bg-my-white ${currentSlide !== i ? "opacity-50 group-hover:opacity-100" : ""}`} />
                </button>
            )
        }
        return output;
    }
    
    return (
        <div className="absolute left-1/2 -translate-x-1/2 bottom-0 z-10 flex py-2 px-4">
            <GetNavigation />
        </div>
    )
}