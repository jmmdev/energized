import ListDisplay from "./list-display";

export default function UserFavorites({favorites}) {
    return (
        <section className="flex flex-col gap-2">
            <h1 className="text-3xl font-medium">Favorite decks</h1>
            <div className="flex flex-col">
                <ListDisplay type="decks" list={favorites} isFav={true} />
            </div>
        </section>
    )
}