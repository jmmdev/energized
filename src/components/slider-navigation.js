export default function SliderNavigation({quantity, currentSlide, setCurrentSlide}) {
    
    const GetNavigation = () => {
        const output = [];
        for(let i=0; i<quantity; i++) {
            output.push(
                <div key={i} className={`w-8 h-1 rounded-full bg-my-white cursor-pointer ${currentSlide !== i && "opacity-50 hover:opacity-100"}`} onClick={() => setCurrentSlide(i)} />
            )
        }
        return output;
    }
    
    return (
        <div className="absolute left-1/2 -translate-x-1/2 bottom-0 z-10 flex p-4 gap-1">
            <GetNavigation />
        </div>
    )
}