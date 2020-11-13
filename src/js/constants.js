import { version } from "react";

export const deck = buildCardDeck();
//export const path = '../../public/images/JPEG/'

function buildCardDeck() {
    let suits = ['C', 'D', 'H', 'S'];
    let value = [2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K', 'A'];
    let deck = [];
    for (let i = 0; i < value.length; i++) {
        let tempVal = value[i];
        for (let j = 0; j < suits.length; j++) {
            if (value[i] === 'J' || value[i] === 'Q' || value[i] === 'K') {
                tempVal = 10;
                deck.push(
                    {
                        value: tempVal,
                        valueA: "",
                        image: value[i] + suits[j] + ".jpg"
                    }
                );
            } else if (tempVal === 'A') {
                deck.push(
                    {
                        value: 1,
                        valueA: 11,
                        image: value[i] + suits[j] + ".jpg"
                    }
                );
            } else {
                deck.push(
                    {
                        value: tempVal,
                        valueA: "",
                        image: value[i] + suits[j] + ".jpg"
                    }
                );
            }
        }
    }
    return deck;
}