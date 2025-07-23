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
        getLeastUsedColor();
    }, [])

    useEffect(() => {
        window.addEventListener("resize",() => {
            scrollerRef.current.scrollTo({left: window.innerWidth * currentSlide});
        });
    }, [])

    useEffect(() => {
        scrollerRef.current.scrollTo({left: window.innerWidth * currentSlide, behavior: "smooth"});
    }, [currentSlide]);

    const getLeastUsedColor = () => {

        const img = document.getElementById("image");

        const canvas = document.getElementById("canvas");
        const ctx = canvas.getContext("2d");

        const width = 50, height = 50;
        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(img, 0, 0, width, height);
        const imageData = ctx.getImageData(0, 0, width, height).data;

        const colorCount = {};
        const quant = 16; // adjust: 8 (coarse), 32 (fine)

        for (let i = 0; i < imageData.length; i += 4) {
        const r = imageData[i];
        const g = imageData[i + 1];
        const b = imageData[i + 2];
        const a = imageData[i + 3];

        if (a < 128) continue;

        // Quantize RGB values
        const qr = Math.floor(r / quant) * quant;
        const qg = Math.floor(g / quant) * quant;
        const qb = Math.floor(b / quant) * quant;

        const key = `${qr},${qg},${qb}`;
        colorCount[key] = (colorCount[key] || 0) + 1;
        }

        // Find least used color
        let leastUsedColor = null;
        let minCount = Infinity;

        for (const [color, count] of Object.entries(colorCount)) {
            if (count < minCount /* && count > 1 */) {
                minCount = count;
                leastUsedColor = color;
            }
        }
            
        document.getElementById("hero").style.backgroundColor = `rgb(${leastUsedColor})`;
    }

    return (
        <section id="hero" className="relative w-screen hidden sm:flex overflow-hidden z-5">
            {currentSlide > 0 &&
            <div className="h-full absolute left-0 flex items-center px-2 lg:px-4 cursor-pointer opacity-60 hover:opacity-100 hover:bg-[#fff2] z-10" onClick={() => setCurrentSlide(currentSlide-1)}>
                <FaChevronLeft className="text-2xl lg:text-3xl text-my-white" />
            </div>
            }
            {currentSlide < SLIDES.length - 1 &&
            <div className="h-full absolute right-0 flex items-center px-2 lg:px-4 cursor-pointer opacity-60 hover:opacity-100 hover:bg-[#fff2] z-10" onClick={() => setCurrentSlide(currentSlide+1)}>
                <FaChevronRight className="text-2xl lg:text-3xl text-my-white" />
            </div>
            }
                <div ref={scrollerRef} className="w-screen flex snap-none overflow-y-hidden overflow-x-scroll no-scrollbar">
                {SLIDES.map((elem, index) => {
                    return (
                        <a key={"sl-" + index} id={"slide-" + index} className="flex flex-[0_0_100%] justify-center hover:scale-110 transition-transform" href={elem.href} target="_blank">
                            <div className="w-[80%] flex justify-between gap-24 items-center">
                                <div className="text-my-white text-3xl lg:text-5xl">
                                    <p className="uppercase font-bold">{elem.title}</p>
                                    <p className="capitalize">{elem.subtitle}</p>
                                </div>
                                <div className="relative w-24 lg:w-30 h-30 lg:h-48" style={{clipPath: "polygon(0% 0%, 80% 0%, 100% 100%, 20% 100%, 0% 0%)", WebkitClipPath: "polygon(0% 0%, 80% 0%, 100% 100%, 20% 100%, 0% 0%)"}}>
                                    <Image id="image" alt="Test image" src={`/assets/images/${elem.img}`} fill sizes="2000" className="object-contain scale-150" />
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