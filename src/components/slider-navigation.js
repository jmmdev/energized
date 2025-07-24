export default function SliderNavigation({quantity, currentSlide, setCurrentSlide}) {
    
    const GetNavigation = () => {
        const output = [];
        for(let i=0; i<quantity; i++) {
            output.push(
                <div key={i} className="group w-8 h-5 flex items-center cursor-pointer" onClick={() => setCurrentSlide(i)}>
                    <div className={`w-full h-1 rounded-full bg-my-white ${currentSlide !== i && "opacity-50 group-hover:opacity-100"}`} />
                </div>
            )
        }
        return output;
    }
    
    return (
        <div className="absolute left-1/2 -translate-x-1/2 bottom-0 z-10 flex py-2 px-4 gap-1.5">
            <GetNavigation />
        </div>
    )
}