import Footer from "@/components/footer";
import LegalTextDisplay from "@/components/legal-text-display";

export default function Privacy() {
    return (
        <>
        <LegalTextDisplay>
            <header className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
                <p className="mt-2">
                    <span className="font-medium">Effective Date:</span> 16/11/2025
                </p>
            </header>

            <p className="mb-6 leading-7">
            Your privacy is important. This website is part of an academic project and is designed to
            demonstrate web development concepts, including user authentication and data management.
            </p>

            <p className="mb-8 leading-7">
            By registering and using this website, you acknowledge and agree to the practices described below.
            </p>

            <div className="space-y-8">
                <section>
                    <h2 className="text-xl font-semibold">1. Information Collected</h2>
                    <ul className="mt-3 list-disc space-y-2 pl-6">
                    <li><span className="font-semibold">Account Information:</span> email address, username, and login credentials</li>
                    <li><span className="font-semibold">Google Authentication Data:</span> if you log in with Google, your basic profile information (such as your email address and display name) will be accessed for authentication purposes</li>
                    <li><span className="font-semibold">User Content:</span> Pokémon decks you create and share</li>
                    <li><span className="font-semibold">Favorites:</span> other users’ decks you choose to mark as favorites</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold">2. Purpose of Data Collection</h2>
                    <p className="mt-3 leading-7">Your information is collected exclusively to enable the core features of this project, including:</p>
                    <ul className="mt-3 list-disc space-y-2 pl-6">
                    <li>Creating and managing your account</li>
                    <li>Allowing you to build, save, and share decks</li>
                    <li>Enabling you to favorite decks created by other users</li>
                    </ul>
                    <p className="mt-3 leading-7">
                    Your information will <span className="font-semibold">not be sold, rented or used for any commercial purposes</span>.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold">3. Data Security</h2>
                    <div className="mt-3 rounded-lg border border-yellow-200 bg-yellow-900 p-4 text-yellow-200">
                    <p className="leading-7">
                        While best efforts are made to protect your data, this is a <span className="font-semibold">student project</span> and does not implement production-level security or compliance standards. Please avoid using sensitive personal information beyond what is required to register.
                    </p>
                    </div>
                </section>

                <section>
                    <h2 className="text-xl font-semibold">4. Data Sharing</h2>
                    <p className="mt-3 leading-7">
                    No personal information will be shared with third parties, except as required to provide authentication services (e.g., Google sign-in).
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold">5. Academic Context</h2>
                    <p className="mt-3 leading-7">
                    This website is for educational use only. It is not intended for public release and should not be considered a production-grade service.
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