"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import SliderNavigation from "@/components/slider-navigation";

export default function Hero() {

    const SLIDES = require("/public/assets/files/slides.json");

    const [currentSlide, setCurrentSlide] = useState(0);
    const scrollerRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            if (scrollerRef && scrollerRef.current)
                scrollerRef.current.scrollTo({left: window.innerWidth * currentSlide});
        }

        window.addEventListener("resize", handleScroll);

        return () => {
            window.removeEventListener('click', handleScroll);
        };
    }, [])

    useEffect(() => {
        if (scrollerRef && scrollerRef.current)
            scrollerRef.current.scrollTo({left: window.innerWidth * currentSlide, behavior: "smooth"});
    }, [currentSlide]);

    return (
        <section id="hero" className="relative w-screen hidden sm:flex overflow-hidden z-5">
            {currentSlide > 0 ?
            <div className="w-[5%] max-w-16 h-full absolute left-0 flex justify-center items-center px-2 lg:px-4 cursor-pointer opacity-60 hover:opacity-100 hover:bg-[#fff2] z-10" onClick={() => setCurrentSlide(currentSlide-1)}>
                <FaChevronLeft className="text-xl lg:text-2xl text-my-white" />
            </div>
            :
            <div className="w-[5%] max-w-16 h-full absolute left-0 z-10" />
            }
            {currentSlide < SLIDES.length - 1 ?
            <div className="w-[5%] max-w-16 h-full absolute right-0 flex justify-center items-center px-2 lg:px-4 cursor-pointer opacity-60 hover:opacity-100 hover:bg-[#fff2] z-10" onClick={() => setCurrentSlide(currentSlide+1)}>
                <FaChevronRight className="text-xl lg:text-2xl text-my-white" />
            </div>
            :
            <div className="w-[5%] max-w-16 h-full absolute right-0 z-10" />
            }
                <div ref={scrollerRef} className="w-screen flex snap-none overflow-y-hidden overflow-x-scroll no-scrollbar">
                {SLIDES.map((elem, index) => {
                    return (
                        <a key={"sl-" + index} id={"slide-" + index} className={`flex flex-[0_0_100%] justify-center hover:scale-110 transition-transform ${elem.background}`}
                        href={elem.href}>
                            <div className="w-[80%] flex justify-center sm:gap-12 lg:gap-24 items-center">
                                <div className="flex flex-col gap-0 text-my-white">
                                    <p className="uppercase font-bold text-3xl lg:text-5xl">{elem.title}</p>
                                    <p className="capitalize text-xl lg:text-3xl">{elem.subtitle}</p>
                                </div>
                                <div className="relative w-24 lg:w-30 h-30 lg:h-48" style={{clipPath: "polygon(0% 0%, 80% 0%, 100% 100%, 20% 100%, 0% 0%)", WebkitClipPath: "polygon(0% 0%, 80% 0%, 100% 100%, 20% 100%, 0% 0%)"}}>
                                    <Image id="image" alt="Test image" src={`/assets/images/${elem.img}`} fill className="object-contain scale-150" />
                                </div>
                            </div>
                        </a>
                    )
                })}
            </div>
            <SliderNavigation quantity={SLIDES.length} currentSlide={currentSlide} setCurrentSlide={setCurrentSlide}/>
            <canvas id="canvas" className="hidden"></canvas>
        </section>
    )
}