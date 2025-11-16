import Footer from "@/components/footer"
import LegalTextDisplay from "@/components/legal-text-display"

export default function TermsOfUse() {
    return (
        <>
        <LegalTextDisplay>
            <header className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Terms of Use</h1>
                <p className="mt-2">
                    <span className="font-medium">Effective Date:</span> 16/11/2025
                </p>
            </header>

            <p className="leading-7">
            These Terms of Use (“Terms”) govern your access to and use of this website (the “Service”). By creating an account or otherwise using the Service, you agree to these Terms. If you do not agree, you should not use the Service.
            </p>

            <div className="mt-8 space-y-8">
                <section>
                    <h2 className="text-xl font-semibold">1. Purpose of the Service</h2>
                    <p className="mt-3 leading-7">
                    This Service has been developed as part of a Master’s degree course and is intended
                    <span className="font-semibold"> solely for educational and non-commercial purposes</span>.
                    It is not affiliated with, endorsed by, or sponsored by
                    <span className="font-semibold"> The Pokémon Company, Nintendo, Creatures Inc., Game Freak Inc., or any of their partners</span>.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold">2. User Accounts</h2>
                    <ul className="mt-3 list-disc space-y-2 pl-6">
                    <li>To use certain features, you must register with a valid email or sign in through Google.</li>
                    <li>You are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account.</li>
                    <li>Please avoid using sensitive or personal information beyond what is required to register, as this is an academic project and not a production service.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold">3. User Content</h2>
                    <ul className="mt-3 list-disc space-y-2 pl-6">
                    <li>You may create and share Pokémon decks through the Service.</li>
                    <li>By submitting content (such as decks), you grant permission for that content to be stored and displayed within the Service.</li>
                    <li>You remain the owner of your user-generated content, but you agree not to submit content that is unlawful, offensive, or harmful to others.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold">4. Intellectual Property</h2>
                    <p className="mt-3 leading-7">
                    All Pokémon-related names, images, and card data are the property of
                    <span className="font-semibold"> The Pokémon Company, Nintendo, Creatures Inc., and Game Freak Inc. </span>
                    No copyright or trademark rights are claimed by the creator of this Service.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold">5. Limitation of Liability</h2>
                    <div className="mt-3 rounded-lg bg-background-1 border border-background-2 p-4">
                    <p className="leading-7">
                        This Service is provided on an <span className="font-semibold">{'"as is"'}</span> and <span className="font-semibold">{'"as available"'}</span> basis, without warranties of any kind. No guarantee is made regarding the accuracy, reliability, or availability of the Service. The creator of the Service shall not be held liable for any damages arising from the use or inability to use the Service.
                    </p>
                    </div>
                </section>

                <section>
                    <h2 className="text-xl font-semibold">6. Changes to These Terms</h2>
                    <p className="mt-3 leading-7">
                    The creator of this project reserves the right to update these Terms at any time to reflect improvements or requirements of the course project. Continued use of the Service after updates constitutes acceptance of the new Terms.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold">7. Contact</h2>
                    <p className="mt-3 leading-7">
                    {"For any questions regarding these Terms, please contact the project creator at "}
                    <span className="font-semibold">
                        devjosm@gmail.com
                    </span>
                    </p>
                </section>
            </div>
        </LegalTextDisplay>
        <div className="mt-auto">
            <Footer />
        </div>
        </>
    )
}