import ListDisplay from "./list-display";

export default function UserDecks({decks}) {
    return (
        <section className="flex flex-col flex-1 gap-2">
            <h1 className="text-3xl font-medium">Created decks</h1>
            <div className="flex flex-col flex-1">
                <ListDisplay type="decks" list={decks} isOwn={true} perPage={5} />
            </div>
        </section>
    )
}