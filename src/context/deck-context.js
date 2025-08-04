import React, { createContext, useContext, useEffect, useState } from 'react';
import TCGdex from '@tcgdex/sdk';

const DeckContext = createContext();

export const useDeckContext = () => useContext(DeckContext);

export const DeckProvider = ({ children }) => {
  const tcgdex = new TCGdex('en');

    const [name, setName] = useState("Unnamed Deck");
    const [debouncedName, setDebouncedName] = useState(name);

    const [cards, setCards] = useState([]);
    const [image, setImage] = useState("placeholder");
    const [legal, setLegal] = useState({
        standard: true,
        expanded: true,
    });
    
    const [hasChanges, setHasChanges] = useState(false);
    const [cardQuantity, setCardQuantity] = useState(0);
    const [deckError, setDeckError] = useState({
        message: "",
        show: false,
    });
    const [waiting, setWaiting] = useState(false);

    useEffect(() => {
        const storedCards = sessionStorage.getItem("built-deck-cards");
        const storedName = sessionStorage.getItem("built-deck-name");

        if (storedName)
            setName(storedName)

        if (storedCards)
            setCards(JSON.parse(storedCards));

    }, [])

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedName(name);
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [name]);

    useEffect(() => {
        sessionStorage.setItem("built-deck-name", debouncedName);
        setHasChanges(true);
    }, [debouncedName])

    useEffect(() => {
      sessionStorage.setItem("built-deck-cards", JSON.stringify(cards));

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

      setHasChanges(true);
      setWaiting(false);
    }, [cards])

    const addCard = async (card) => {
        setWaiting(true);
        
        const newCards = [...cards];

        const sameNameCards = newCards.filter((elem) => elem.card.name === card.name);
        let cardQuantity = 0;

        for (let snc of sameNameCards) {
            cardQuantity += snc.quantity;
        }

        if (cardQuantity < 4) {

            const position = newCards.findIndex((elem) => elem.card.id === card.id);
            const oldCardObject = position >= 0 ? newCards[position] : null;

            if (oldCardObject) {
                newCards[position] = {
                    card: oldCardObject.card,
                    quantity: oldCardObject.quantity + 1,
                }
            }
            else {
                const cardData = await tcgdex.card.get(card.id);
                delete cardData.sdk;
                newCards.push({
                    card: cardData,
                    quantity: 1,
                })
            }

            setCards(newCards);
        }

        else {
            setDeckError({
                message: `Cannot add more than 4 "${card.name}" cards`,
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
        setWaiting(true);

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
        name, setName, cards, setCards, image, setImage, legal, setLegal, hasChanges, setHasChanges,
        addCard, removeCard, cardQuantity, setCardQuantity, deckError, closeDeckError, waiting, setWaiting
     }}>
      {children}
    </DeckContext.Provider>
  );
};