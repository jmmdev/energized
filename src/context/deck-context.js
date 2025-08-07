import React, { createContext, useContext, useEffect, useState } from 'react';
import TCGdex from '@tcgdex/sdk';
import axios from 'axios';

const DeckContext = createContext();

export const useDeckContext = () => useContext(DeckContext);

export const DeckProvider = ({ children }) => {
  const tcgdex = new TCGdex('en');

    const [name, setName] = useState(null);
    const [cards, setCards] = useState(null);
    const [image, setImage] = useState(null);
    const [legal, setLegal] = useState(null);
    
    const [hasChanges, setHasChanges] = useState(false);
    const [cardQuantity, setCardQuantity] = useState(0);
    const [deckError, setDeckError] = useState({
        message: "",
        show: false,
    });
    const [waiting, setWaiting] = useState(false);

    useEffect(() => {
        if (cards) {
            let stLegal = true;
            let exLegal = true;

            let count = 0;

            for (let c of cards) {
                stLegal &= c.card.legal.standard;
                exLegal &= c.card.legal.expanded;

                count += c.quantity;
            }

            setCardQuantity(count);
            
            setLegal({
                standard: stLegal,
                expanded: exLegal,
            })

            if (setWaiting) {
                let timeout;
                clearTimeout(timeout);

                timeout = setTimeout(() => {
                    setWaiting(false);        
                }, 500);
            }
        }
    }, [cards])

    const createDeck = async () => {
        await axios.post("http://localhost:3500/api/decks", {
            data: {
                creator: {
                    id: session.user?.id,
                    name: session.user?.name
                },
                name: "Unnamed deck",
                cards: [],
                image: null,
                legal: {
                    standard: false,
                    expanded: false,
                }
            }
        });
    }

    const initializeDeck = async (deckId) => {
            const response = await axios.get(`http://localhost:3500/api/decks/${deckId}`);
            const deck = response.data;

            if (deck) {
                setName(deck.name);
                setCards(deck.cards);
                setImage(deck.image);
                setLegal(deck.legal);
            }
            else
                throw new Error("Deck not found");
        }

    const cardHasLimit = (name) => {
        const targetCard = cards.find((elem) => elem.card.name === name);

        if (targetCard) {
            const card = targetCard.card;
            return card.category !== "Energy" || card.energyType !== "Normal";
        }
        return false;
    }

    const countCardsWithName = (name) => {
        const newCards = [...cards];

        const sameNameCards = newCards.filter((elem) => elem.card.name === name);
        let cardQuantity = 0;

        for (let snc of sameNameCards) {
            cardQuantity += snc.quantity;
        }

        return cardQuantity;
    }

    const addCard = async (card) => {
        const hasLimit = cardHasLimit(card.id);
        const cardQuantity = countCardsWithName(card.name)

        if (!hasLimit || cardQuantity < 4) {
            const newCards = [...cards];

            const position = newCards.findIndex((elem) => elem.card.id === card.id);
            const oldCardObject = position >= 0 ? newCards[position] : null;

            if (oldCardObject) {
                newCards[position] = {
                    card: oldCardObject.card,
                    quantity: oldCardObject.quantity + 1,
                }
            }
            else {
                setWaiting(true);

                const cardData = await tcgdex.card.get(card.id);
                delete cardData.sdk;
                newCards.push({
                    card: cardData,
                    quantity: 1,
                })
            }

            setCards(newCards);
            setHasChanges(true);
        }

        else {
            setDeckError({
                message: `Cannot add more copies of "${card.name}"`,
                show: true,
            });
        }
    }

    const closeDeckError = () => {
        setDeckError({
            message: "",
            show: false,
        })
    }

    const removeCard = (card) => {
        const newCards = [...cards];

        const position = newCards.findIndex((elem) => elem.card.id === card.id);
        const oldCardObject = position >= 0 ? newCards[position] : null;

        if (oldCardObject) {
            if (oldCardObject.quantity > 1){
                newCards[position] = {
                    card: oldCardObject.card,
                    quantity: oldCardObject.quantity - 1,
                }
            }
            else {
                newCards.splice(position, 1);
            }

            setCards(newCards);
            setHasChanges(true);
        }
        else {
            setDeckError({
                message: `Card "${card.name} (${card.id}) could not be found in your deck"`,
                show: true,
            });
        }
    }

  return (
    <DeckContext.Provider value={{ 
        name, setName, cards, setCards, image, setImage, legal, setLegal, hasChanges, setHasChanges, createDeck, initializeDeck,
        countCardsWithName, cardHasLimit, addCard, removeCard, cardQuantity, setCardQuantity, deckError, closeDeckError, waiting, setWaiting
     }}>
      {children}
    </DeckContext.Provider>
  );
};