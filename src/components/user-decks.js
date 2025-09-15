import DeckListDisplay from "./deck-list-display";

export default function UserDecks({decks}) {
    return (
        <section className="flex flex-col gap-2">
            <h1 className="text-3xl font-medium">Created decks</h1>
            <div className="flex flex-col">
                <DeckListDisplay decks={decks} isOwn={true} />
            </div>
        </section>
    )
}