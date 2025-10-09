"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function Hero() {

    const SLIDES = require("/public/assets/files/slides.json");

    const [currentSlide, setCurrentSlide] = useState(0);
    
    const slideRef = useRef(currentSlide);
    const scrollerRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            if (scrollerRef && slideRef.current)
                scrollerRef.current.scrollTo({left: window.innerWidth * slideRef.current});
        }

        window.addEventListener("resize", handleScroll);

        return () => {
            window.removeEventListener('resize', handleScroll);
        };
    }, [])

    useEffect(() => {
        if (scrollerRef && scrollerRef.current){
            scrollerRef.current.scrollTo({left: window.innerWidth * currentSlide, behavior: "smooth"});
            slideRef.current = currentSlide;
        }
    }, [currentSlide]);

    return (
        <section id="hero" className="relative w-screen min-h-28 hidden sm:flex overflow-hidden z-5">
            {currentSlide > 0 ?
            <button className="w-[5%] max-w-16 h-full absolute left-0 flex justify-center items-center px-2 lg:px-4 cursor-pointer opacity-60 hover:opacity-100 hover:bg-[#fff2] z-10" onClick={() => setCurrentSlide(currentSlide-1)}>
                <FaChevronLeft className="text-2xl lg:text-3xl text-my-white" />
            </button>
            :
            <div className="w-[5%] max-w-16 h-full absolute left-0 z-10" />
            }
            {currentSlide < SLIDES.length - 1 ?
            <button className="w-[5%] max-w-16 h-full absolute right-0 flex justify-center items-center px-2 lg:px-4 cursor-pointer opacity-60 hover:opacity-100 hover:bg-[#fff2] z-10" onClick={() => setCurrentSlide(currentSlide+1)}>
                <FaChevronRight className="text-2xl lg:text-3xl text-my-white" />
            </button>
            :
            <div className="w-[5%] max-w-16 h-full absolute right-0 z-10" />
            }
                <div ref={scrollerRef} className="w-screen flex snap-none overflow-y-hidden overflow-x-scroll no-scrollbar">
                {SLIDES.map((elem, index) => {
                    return (
                        <Link key={"sl-" + index} id={"slide-" + index} className={`flex flex-[0_0_100%] justify-center hover:scale-110 transition-transform ${elem.background}`}
                        href={elem.href}>
                            <div className="w-[80%] flex justify-center gap-8 xl:gap-12 items-center">
                                <div className="flex flex-col text-my-white">
                                    <p className="uppercase font-bold text-3xl lg:text-5xl">{elem.title}</p>
                                    <p className="capitalize text-xl lg:text-3xl">{elem.subtitle}</p>
                                </div>
                                <div className="hidden lg:block w-auto h-40 xl:h-48">
                                    <Image className="h-full w-auto object-cover" id="image" alt="Test image" src={`/assets/images/${elem.img}.png`} width={2000} height={2000} />
                                </div>
                            </div>
                        </Link>
                    )
                })}
            </div>
        </section>
    )
}