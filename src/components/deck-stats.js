export default function DeckStats({deck}) {
    return (
        <p className="break-words">{JSON.stringify(deck)}</p>
    )
}