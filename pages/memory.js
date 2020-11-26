import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import nextCookies from 'next-cookies';
import { isSessionTokenValid } from '../util/auth';
import { getUserBySessionToken } from '../util/database';
import { colors } from '../assets/colors';
import { css } from '@emotion/core';
import countries from '../countries.js';

const memoryStyles = css`
  .outer-wrapper {
    width: 80vw;
    max-width: 900px;
    height: 100%;
    margin-top: 100px;
    margin-left: auto;
    margin-right: auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex-grow: 1;
    line-height: 2;
  }

  .memory-area {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr 1fr 1fr;
    column-gap: 1em;
    row-gap: 1em;
    margin: 0.5em;
    margin-bottom: 4em;
  }
  .memory-card {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100px;
    width: 100px;
    border: 1px solid black;
    text-align: center;

    border-radius: 5px;

    position: relative;
  }
  .memory-area div {
  }

  .memory-area button {
    border-radius: 5px;
    border: none;
    background-color: ${colors.primary};
    text-shadow: 1px 1px #000000;
    color: white;
    font-family: monospace;
    width: 100%;
    height: 100%;
    box-shadow: 2pt 2pt ${colors.black};
  }

  .memory-area button:hover {
    background-color: ${colors.primaryLight};
  }
  .memory-area button .backside {
  }
  .memory-area img {
    max-width: 100px;
  }

  .hidden {
    opacity: 0;
  }
`;

export default function Memory(props) {
  const [cards, setCards] = useState([]);
  const [score, setScore] = useState(0);

  function getRandomSubsetOfArray(array, n) {
    const subset = [];
    while (subset.length < n) {
      const randomIndex = Math.floor(Math.random() * (array.length - 1));
      if (subset.indexOf(array[randomIndex]) === -1) {
        subset.push(array[randomIndex]);
      }
    }

    return subset;
  }
  function concatArrays(array1, array2) {
    return array1.concat(array2);
  }
  function addPairIdToCards(array) {
    return array.map((card, index) => {
      return { ...card, pairId: index };
    });
  }

  function addDisplayAndSolvedToCards(array) {
    return array.map((card, index) => {
      return { ...card, visible: false, solved: false };
    });
  }
  function addDisplayA(array) {
    return array.map((card) => {
      return { ...card, display: 'A' };
    });
  }
  function addDisplayB(array) {
    return array.map((card) => {
      return { ...card, display: 'B' };
    });
  }
  function addIdToCards(array) {
    return array.map((card, index) => {
      return { ...card, id: index };
    });
  }
  function shuffle(array) {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const newIndex = Math.floor(Math.random() * (i + 1));
      const oldValue = shuffledArray[newIndex];
      // puts the card at i in the position of the new index
      shuffledArray[newIndex] = shuffledArray[i];
      // puts the the card that was at the newIndex in the position of I
      shuffledArray[i] = oldValue;
    }
    return shuffledArray;
  }

  useEffect(() => {
    function createNewCardSet(input, numberOfPairs) {
      const newCardSet = getRandomSubsetOfArray(input, numberOfPairs);
      const newCardSetWithPairId = addPairIdToCards(newCardSet);
      const newCardSetWithDisplay = addDisplayAndSolvedToCards(
        newCardSetWithPairId,
      );
      const cardSetA = addDisplayA(newCardSetWithDisplay);
      const cardSetB = addDisplayB(newCardSetWithDisplay);
      const cardSetAndB = concatArrays(cardSetA, cardSetB);
      const newCardSetWithIds = addIdToCards(cardSetAndB);
      const cardSetAndBShuffled = shuffle(newCardSetWithIds);
      console.log(cardSetAndBShuffled);
      setCards(cardSetAndBShuffled);
      setScore(0);
      return;
    }

    createNewCardSet(countries, 8);
  }, []);

  useEffect(() => {
    const visibleCards = cards.filter((c) => c.visible === true);
    if (
      visibleCards.length === 2 &&
      visibleCards[0].pairId === visibleCards[1].pairId
    ) {
      const newScore = score + 1;
      setScore(newScore);
      setCards(
        cards.map((ca) => {
          return ca.pairId === visibleCards[0].pairId
            ? { ...ca, solved: true, visible: false }
            : ca;
        }),
      );
    }
  }, [cards, score]);

  function handleCardClick(allCards, clickedCard) {
    // if already 2 cards are visible, flip all to invisible
    if (allCards.filter((c) => c.visible === true).length === 2) {
      setCards(
        cards.map((ca) => {
          return ca.id !== clickedCard.id
            ? { ...ca, visible: false }
            : { ...ca, visible: true };
        }),
      );
    } else
      setCards(
        cards.map((ca) => {
          return ca.id !== clickedCard.id ? ca : { ...ca, visible: true };
        }),
      );
  }

  function Cards({ cards, handleCardClick }) {
    return (
      <>
        {' '}
        {cards.map((card) => {
          return (
            <div className="memory-card">
              <button
                onClick={() => handleCardClick(cards, card)}
                className={card.visible || card.solved ? 'front' : 'back'}
              >
                {!(card.visible || card.solved) ? (
                  <div />
                ) : card.display === 'A' ? (
                  <div>{card.name}</div>
                ) : (
                  <div>{card.capital}</div>
                )}
              </button>
            </div>
          );
        })}
      </>
    );
  }
  return (
    <Layout loggedIn={props.loggedIn}>
      <Head>
        <title>GeoQuiz - Memory</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div css={memoryStyles}>
        <div className="outer-wrapper">
          <div>Solved: {score}</div>
          <div className="memory-area">
            <Cards cards={cards} handleCardClick={handleCardClick} />
          </div>
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  let { session: token } = nextCookies(context) || null;
  const loggedIn = await isSessionTokenValid(token);
  const user = (await getUserBySessionToken(token)) || null;

  if (typeof token === 'undefined') {
    token = null;
  }
  return {
    props: { loggedIn: loggedIn, user: user, token: token },
  };
}
