"use client";

import Button from "@/components/button";
import Footer from "@/components/footer";
import { useState } from "react";
import { FaCaretLeft, FaCaretRight } from "react-icons/fa";

export default function UserGuide() {

    const STEPS = require("/public/assets/files/user-guide-steps.json");

    const [step, setStep] = useState(0);

    const TOTAL_STEPS = STEPS.length-1;

    return (
        <section className="flex-1 flex flex-col">
            <main className="w-full max-w-[1280px] self-center flex-1 flex flex-col p-4 md:p-8">
                <div className="w-full flex-1 flex flex-col">
                    <h1 className="font-bold uppercase text-4xl">Welcome to our user guide</h1>
                    <h2 className="mt-2 font-light">
                        Here we will help you with creating decks, searching cards and users, and customizing your experience
                    </h2>
                    <article className="flex-1 flex flex-col gap-4 md:gap-8 py-4 md:py-8">
                        <div className="w-full flex justify-between">
                            <h1 className="text-xl font-semibold">Step {step+1}: {STEPS[step].title}</h1>
                            <div className="flex gap-2 items-center">
                                {step > 0 &&
                                    <Button color="none" className="px-1 text-xl" 
                                    onClick={() => setStep(step-1)}>
                                        <FaCaretLeft /> Prev
                                    </Button>
                                }
                                {step < TOTAL_STEPS &&
                                    <Button color="none" className="px-1 text-xl" 
                                    onClick={() => setStep(step+1)}>
                                        Next <FaCaretRight />
                                    </Button>
                                }
                            </div>
                        </div>
                        {STEPS[step].paragraphs.map((p, index) => {
                            return (
                                <div key={"step-" + index} className="w-full flex flex-col gap-2 p-4 rounded bg-background-1">
                                    <p className="text-lg">{p}</p>
                                    <img className="block" src={`/assets/images/steps/${step}-${index}.jpg`}
                                    alt="XD" />
                                </div>
                            )
                        })}
                    </article>
                </div>
                <div className="w-full flex gap-2 justify-between items-center">
                    {step > 0 ?
                        <Button color="none" className="px-1 text-xl" 
                        onClick={() => setStep(step-1)}>
                            <FaCaretLeft /> Prev
                        </Button>
                    : <div />}
                    {step < TOTAL_STEPS ?
                        <Button color="none" className="px-1 text-xl" 
                        onClick={() => setStep(step+1)}>
                            Next <FaCaretRight />
                        </Button>
                    : <div />}
                </div>
            </main>
            <Footer />
        </section>
    )
}