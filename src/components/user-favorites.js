import ListDisplay from "./list-display";

export default function UserFavorites({name, favorites}) {
    return (
        <section className="flex flex-col flex-1 gap-2">
            <h1 className="text-3xl font-medium">Favorite decks</h1>
            <div className="flex flex-col flex-1">
                <ListDisplay type="decks" name={name} list={favorites} isFav={true} perPage={10} from={`/user/${name}`} />
            </div>
        </section>
    )
}