import { useEffect, useState } from "react";
import Pagination from "./pagination";
import { FaCaretDown, FaCaretUp, FaEdit, FaSpinner, FaTrash } from "react-icons/fa";
import axios from "axios";
import Button from "./button";

export default function AdminDecks({contentScrollerRef, content, entityToDelete, setShowConfirmDelete, entityToRename, setShowRename, filters}) {
    const [pageNumber, setPageNumber] = useState(0);
    const [showCards, setShowCards] = useState(-1);

    const [decks, setDecks] = useState(content);

    const PER_PAGE = 10;

    useEffect(() => {
        contentScrollerRef.current.scrollTo({top: 0});
    }, [pageNumber])

    const DeckElement = ({deck, index}) => {
        const [cards, setCards] = useState(null);

        useEffect(() => {
            const getCards = async () => {
                const response = await axios.get(`/api/xapi/decks?id=${deck._id}`);

                setTimeout(() => {
                    setCards(response.data.cards);
                }, 1000);
            }
            if (showCards === index)
                getCards();
        }, [showCards])

        const getDeckDate = (deck) => {
            const created = new Date(deck.createdAt);
            const modified = new Date(deck.lastModified);

            return {
                created: created.toLocaleString("en-GB").replace(/\//g, "/"), 
                modified: modified.toLocaleString("en-GB").replace(/\//g, "/"), 
            }
        }

        const changeDeckVisibility = async (visible) => {
            const response = await axios.post(`/api/xapi/admin/decks/${deck._id}`, {
                visible
            }, 
            {
                withCredentials: true,
            });

            const updatedDeck = response.data;
            const newDecks = [...decks];

            if (filters.visible && updatedDeck.visible !== filters.visible) {
                newDecks.splice(index, 1);
            }
            else {
                newDecks[index] = updatedDeck;
            }

            setDecks(newDecks);
        }

        const GetCards = () => {
            if (cards)
                return (
                    <div className="w-full flex-1 flex flex-col text-sm">
                        <div className="flex-1 flex flex-col">
                            <div className="hidden 2xl:flex gap-8 p-2 bg-background-1 text-foreground/60">
                                <p className="flex-1">CARD</p>
                                <p className="flex-1 2xl:text-center">CATEGORY</p>
                                <p className="flex-1">FROM SET</p>
                                <p className="flex-1 2xl:text-center">QUANTITY</p>
                                <p className="flex-1">LEGALITY</p>
                            </div>
                            <div className="flex flex-col p-0.5 gap-0.5 bg-background-1 font-light">
                            {
                                cards.map((obj) => {
                                    return (
                                        <div key={obj.card.id} className="flex-1 p-2 bg-background-2">
                                            <div className="flex flex-col 2xl:flex-row 2xl:items-center gap-4 2xl:gap-8 py-1">
                                                <p className="2xl:flex-1"><span className="2xl:hidden opacity-60 font-medium">CARD: </span>{obj.card.name}</p>
                                                <p className="2xl:flex-1 2xl:text-center"><span className="2xl:hidden opacity-60 font-medium">CATEGORY: </span>{obj.card.category}</p>
                                                <p className="2xl:flex-1"><span className="2xl:hidden opacity-60 font-medium">FROM SET: </span>{obj.card.set.name}</p>
                                                <p className="2xl:flex-1 2xl:text-center"><span className="2xl:hidden opacity-60 font-medium">QUANTITY: </span>{obj.quantity}</p>
                                                <div className="flex 2xl:flex-1 gap-1">
                                                    <p className="2xl:hidden opacity-60 font-medium">LEGALITY:</p>
                                                    ST: {obj.card.legal.standard ? "Legal" : "Illegal"},
                                                    EX: {obj.card.legal.expanded ? "Legal" : "Illegal"}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                            </div>
                        </div>
                    </div>
                )
            return (
                <div className="flex flex-col self-center items-center gap-2 p-8">
                    <FaSpinner className="self-center animate-spin text-2xl" />
                    <p className="text-xl font-medium uppercase">loading cards...</p>
                </div>
            )
        }

        const dates = getDeckDate(deck);
        
        return (
            <div className="flex flex-col flex-1 border-b border-foreground/30 px-2">
                <div className="flex flex-col 2xl:flex-row 2xl:items-center 2xl:gap-8 py-1">
                    <div className="flex-1 flex gap-2 min-w-0">
                        <span className="2xl:hidden opacity-60 font-medium">NAME: </span>
                        <span className="2xl:flex-1 px-1 bg-background-1 overflow-hidden text-ellipsis whitespace-nowrap">{deck.name}</span>
                        <Button color="blue" className="rounded-xs px-1 gap-0.5" onClick={() => {
                            entityToRename.current = deck;
                            setShowRename(true);
                        }}>
                            <FaEdit />
                        </Button>
                    </div>
                    <p className="2xl:flex-1 truncate mt-2 2xl:m-0"><span className="2xl:hidden opacity-60 font-medium">CREATOR: </span>{deck.creator.name}</p>
                    <div className="2xl:flex-1 flex flex-col my-2 2xl:m-0">
                        <span className="w-fit 2xl:hidden opacity-60 font-medium">LEGALITY</span>
                            {
                            deck.cardCount !== 60 ?
                            <h2>Incomplete</h2>
                            :
                            <div className="flex flex-col">
                                <h2>
                                    Standard: 
                                    <>
                                        {deck.legal.standard 
                                            ? <span className="text-emerald-500"> Legal</span>
                                            : <span className="text-red-500"> Illegal</span>
                                        }
                                    </>
                                </h2>
                                <h2>
                                Expanded:
                                    <>    
                                        {deck.legal.expanded 
                                            ? <span className="text-emerald-500"> Legal</span>
                                            : <span className="text-red-500"> Illegal</span>
                                        }
                                    </>
                                </h2>
                            </div>
                            }
                    </div>
                    <p className="2xl:flex-1"><span className="2xl:hidden opacity-60 font-medium">CREATED: </span>{dates.created}</p>
                    <p className="2xl:flex-1"><span className="2xl:hidden opacity-60 font-medium">LAST MODIFIED: </span>{dates.modified}</p>
                    <p className="2xl:flex-1 2xl:text-center">
                        <span className="2xl:hidden opacity-60 font-medium">VISIBILITY: </span>
                        {
                            deck.cardCount === 60 ?
                                deck.visible ? "Public" : "Private"
                            : "Hidden"
                        }
                    </p>
                    {deck.cardCount === 60 ?
                        <div className="2xl:flex-1">
                            <h2 className="2xl:hidden mt-2 mb-0.5 opacity-60 font-medium">CHANGE VISIBILITY</h2>
                            <div className="2xl:flex-1 flex font-medium">
                                <Button color="green" className={`px-2 py-0.5 rounded-l-xs ${deck.visible === false ? "opacity-60" : ""}`} 
                                disabled={deck.cardCount !== 60} onClick={() => {
                                    if (!deck.visible)
                                        changeDeckVisibility(true)
                                }}>
                                    Public
                                </Button>
                                <Button color="red" className={`px-2 py-0.5 rounded-r-xs ${deck.visible === true ? "opacity-60" : ""}`}
                                disabled={deck.cardCount !== 60} onClick={() => {
                                    if (deck.visible)
                                        changeDeckVisibility(false)
                                }}>
                                    Private
                                </Button>
                            </div>
                        </div>
                    :
                        <h2 className="hidden 2xl:block flex-1 text-center"> - </h2>
                    }
                </div>
                <div className="w-full flex items-center justify-between mt-8 mb-4 px-2 gap-2">
                    <button className="flex items-center gap-1 px-4 font-medium py-1 rounded border-red-400 text-red-400
                    hover:text-red-300 hover:border-red-300 active:text-red-500 active:border-red-500 cursor-pointer text-sm border-2"
                    onClick={() => {
                        entityToDelete.current = deck;
                        setShowConfirmDelete(true)
                    }}>
                        <FaTrash /> DELETE
                    </button>
                    <div className="2xl:hidden" />
                    {deck.cardCount > 0 &&
                        <Button color="blue" className="flex items-center gap-1 px-4 font-medium py-1 rounded-sm text-sm self-end 2xl:self-center"
                        onClick={() => {
                            const indexToShow = showCards !== index ? index : -1;
                            setCards(null);
                            setShowCards(indexToShow);
                        } 

                        }>
                                <h2>details</h2>
                                {showCards === index ? <FaCaretUp /> : <FaCaretDown />}
                        </Button>
                    }
                    <div className="hidden 2xl:block" />
                </div>
                {
                    showCards === index && 
                    
                    <div className="pb-2">
                        <div className="flex flex-col rounded">
                            <GetCards />
                        </div>
                    </div>
                }
            </div>
        )
    }

    if (decks.length <= 0)
        return (
            <p className="opacity-60 italic font-light uppercase">No decks found</p>
        )

    let subList = [];

    const startIndex = pageNumber * PER_PAGE;
    const endIndex = startIndex + PER_PAGE;

    subList = decks.slice(startIndex, endIndex);

    return (
        <div className="w-full flex-1 flex flex-col 2xl:text-lg">
            <div className="flex-1 flex flex-col">
                <div className="hidden 2xl:flex  mb-1 gap-8 uppercase opacity-70 px-2">
                    <h2 className="flex-1">name</h2>
                    <h2 className="flex-1">creator</h2>
                    <h2 className="flex-1">legality</h2>
                    <h2 className="flex-1">created</h2>
                    <h2 className="flex-1">modified</h2>
                    <h2 className="flex-1 2xl:text-center">visibility</h2>
                    <h2 className="flex-1">change visibility</h2>
                </div>
                <div className="border border-b-0 border-foreground/30 font-light">
                    {
                        subList.map((deck, index) =>{
                            return (
                                <DeckElement key={deck._id} deck={deck} index={index} />
                            )
                        })
                    }
                </div>
            </div>
            <Pagination quantity={content.length} pageNumber={pageNumber} perPage={PER_PAGE} setPageNumber={setPageNumber} />
        </div>
    )
}