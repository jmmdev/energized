import LegalTextDisplay from "@/components/legal-text-display";
import Link from "next/link";

export default function Copyright() {
    return (
        <LegalTextDisplay>
            <header className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Copyright Disclaimer</h1>
                <p className="mt-2">
                    <span className="font-medium">Effective Date:</span> 16/11/2025
                </p>
            </header>

            <div className="space-y-5 leading-7">
                <p>
                    This website and its contents have been developed as part of a Master’s degree course. The project is intended
                    <span className="font-semibold"> solely for educational and non-commercial purposes</span>.
                </p>

                <p>
                    All Pokémon names, images, card data, and related intellectual property are the exclusive property of
                    <span className="font-semibold"> The Pokémon Company, Nintendo, Creatures Inc., and Game Freak Inc.</span>
                </p>

                <p>
                    This website is <span className="font-semibold">not affiliated with, endorsed by, or sponsored by</span> The Pokémon Company,
                    Nintendo, Creatures Inc., Game Freak Inc., or any of their subsidiaries or partners.
                </p>

                <p>
                    Pokémon-related content displayed on this site is retrieved from the&nbsp;
                    <Link href="https://tcgdex.dev/" target="_blank" className="font-medium underline decoration-slate-300 underline-offset-4 hover:decoration-slate-400 dark:decoration-slate-700 dark:hover:decoration-slate-600">
                        TCGdex API
                    </Link>
                    &nbsp;and is used strictly for academic demonstration and learning purposes.
                </p>

                <p>No copyright or trademark infringement is intended.</p>
            </div>
        </LegalTextDisplay>
    )
}