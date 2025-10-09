"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function Hero() {

    const SLIDES = require("/public/assets/files/slides.json");

    const [currentSlide, setCurrentSlide] = useState(1);
    
    const slideRef = useRef(currentSlide);
    const scrollerRef = useRef(null);
    const scrollingRef = useRef(false);
    const firstScrollRef = useRef(true);

    useEffect(() => {
        const handleResize = () => {
            if (scrollerRef && slideRef.current)
                scrollerRef.current.scrollTo({left: window.innerWidth * slideRef.current});
        }

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [])

    useEffect(() => {
        scrollingRef.current = true;

        let timeout;
        clearTimeout(timeout);

        const doInstant = ((currentSlide === 1 && slideRef.current === SLIDES.length + 1) || (currentSlide === SLIDES.length && slideRef.current === 0));
        
        const behavior = (firstScrollRef.current || doInstant) ? "instant" : "smooth";

        if (firstScrollRef.current)
            firstScrollRef.current = false;

        if (scrollerRef && scrollerRef.current){
            scrollerRef.current.scrollTo({left: window.innerWidth * currentSlide, behavior});
            slideRef.current = currentSlide;

            if (doInstant)
                scrollingRef.current = false;

            else {
                setTimeout(() => {
                    scrollingRef.current = false;
                    
                    if (currentSlide === 0 || currentSlide === SLIDES.length+1) {
                        if (currentSlide === 0)
                            setCurrentSlide(SLIDES.length);
                        else if (currentSlide === SLIDES.length+1)
                        setCurrentSlide(1);
                    }
                }, 700);
            }

        }
    }, [currentSlide]);

    const GetSlide = ({index, elem}) => {
        return (
            <Link key={"sl-" + index} className={`flex flex-[0_0_100%] justify-center hover:scale-110 transition-transform ${elem.background}`}
            href={elem.href}>
                <div className="w-[80%] flex justify-center gap-8 xl:gap-12 items-center">
                    <div className="flex flex-col text-my-white">
                        <p className="uppercase font-bold text-3xl lg:text-5xl">{elem.title}</p>
                        <p className="capitalize text-xl lg:text-3xl">{elem.subtitle}</p>
                    </div>
                    <div className="hidden lg:block w-auto h-40 xl:h-48">
                        <Image className="h-full w-auto object-cover" alt="Test image" src={`/assets/images/${elem.img}.png`} width={2000} height={2000} />
                    </div>
                </div>
            </Link>
        )
    }


    const GetSlides = () => {
        let output =  [];

        output.push(
            <GetSlide elem={SLIDES[SLIDES.length-1]} index={0} />
        )

        for (const [index, elem] of SLIDES.entries()) {
            output.push (
                <GetSlide elem={elem} index={index + 1} /> 
            )
        }

        output.push(
            <GetSlide elem={SLIDES[0]} index={SLIDES.length+1} />
        )

        return output;
    }

    return (
        <section id="hero" className="relative w-screen min-h-28 hidden sm:flex overflow-hidden z-5">
            <button className="w-[5%] max-w-16 h-full absolute left-0 flex justify-center items-center px-2 lg:px-4 cursor-pointer opacity-60 hover:opacity-100 hover:bg-[#fff2] z-10"
            onClick={() => {
                if (scrollingRef.current === false)
                    setCurrentSlide(currentSlide-1)
            }}>
                <FaChevronLeft className="text-2xl lg:text-3xl text-my-white" />
            </button>
            <button className="w-[5%] max-w-16 h-full absolute right-0 flex justify-center items-center px-2 lg:px-4 cursor-pointer opacity-60 hover:opacity-100 hover:bg-[#fff2] z-10"
            onClick={() => {
                if (scrollingRef.current === false)
                    setCurrentSlide(currentSlide+1)
            }}>
                <FaChevronRight className="text-2xl lg:text-3xl text-my-white" />
            </button>
            <div ref={scrollerRef} className="w-screen flex snap-none overflow-y-hidden overflow-x-scroll no-scrollbar">
                <GetSlides />    
            </div>
        </section>
    )
}