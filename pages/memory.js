import React, { useState, useEffect } from 'react';
import { useLocalStore, useObserver } from 'mobx-react';
import Head from 'next/head';
import Layout from '../components/Layout';
import nextCookies from 'next-cookies';
import Confetti from 'react-dom-confetti';
import { isSessionTokenValid } from '../util/auth';
import { getUserBySessionToken } from '../util/database';
import { createMemoryCards } from '../util/functions';
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
    z-index: 0;
    @media (max-width: 400px) {
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr 1fr 1fr 1fr
    }
  }
  .memory-card {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 120px;
    width: 120px;
    border: 1px solid black;
    text-align: center;

    border-radius: 5px;

    position: relative;
    @media (max-width: 500px) {
      width: 20vw;
      height: 20vw;
      font-size: 0.4em;
    }
    @media (max-width: 400px) {
      width: 28vw;
      height: 30vw;
    }
  }
  .memory-area button,
  .settings,
  #restart {
    font-family: monospace;
    @media (max-width: 500px) {
      font-size: 11px;
    }
    @media (max-width: 400px) {
      font-size: 10px;
    }
  }
  .memory-area button {
    border: none;
    border-radius: 5px;
    width: 100%;
    height: 100%;
    box-shadow: 2pt 2pt ${colors.black};
    background-color: ${colors.primary};
    color: white;
    text-shadow: 1px 1px #000000;
  }

  .settings {
    border:none
    background-color: none;
    width: 200px;
    text-shadow: none;
    box-shadow: none;
    padding: 1em;
    margin: 0.5em;
    border-radius: 25px;
    background-color: white;
    color: ${colors.black};
    border: 2px solid black;
  }
  .settings,
  #restart {

    width: 200px;
    margin: 0.5em;
    border-radius: 25px;
    padding: 1em;
  }
  .settings:hover {
    box-shadow: 0 0 3pt 2pt ${colors.primary};

  }

  .active {
    background-color: ${colors.black};
    color: white;
  }
  .solved {
    margin: 1em;
  }
  #restart {
    border:none;
    margin-left: auto;
    margin-right: auto;
    box-shadow: none;
    background-color: ${colors.primary};
    color: white;
    margin-bottom: 2em;
  }
  #restart:hover {
    background-color: ${colors.primaryLight};
  }
  .memory-area button:hover {
    background-color: ${colors.primaryLight};
  }
  .memory-area button .backside {
  }
  button img {
    max-width: 80%;
  }

  .hidden {
    opacity: 0;
  }
`;

const StoreContext = React.createContext();

const StoreProvider = ({ children }) => {
  const store = useLocalStore(() => ({
    cards: createMemoryCards(countries, 8),

    flipCard: (flippedCard) => {
      // if 0 or 1 cards are visible, make the clicked one additionally visible
      if (
        store.cards.filter((c) => c.visible === true).length === 0 ||
        store.cards.filter((c) => c.visible === true).length === 1
      ) {
        store.cards.replace(
          store.cards.map((ca) => {
            return ca.id !== flippedCard.id || ca.visible
              ? ca
              : { ...ca, visible: true };
          }),
        );
      }
      // if two cards a already visible, make all cards invisible except the just clicked one
      else if (store.cards.filter((c) => c.visible === true).length === 2) {
        store.cards.replace(
          store.cards.map((ca) => {
            return ca.id !== flippedCard.id
              ? { ...ca, visible: false }
              : { ...ca, visible: true };
          }),
        );
      }
      // if there is already one card visible and has the same pair ID as the flipped one -> set the pair to solved
      if (
        store.cards.filter((c) => c.visible).length === 2 &&
        store.cards.filter((c) => c.visible)[0].pairId ===
          store.cards.filter((c) => c.visible)[1].pairId
      ) {
        store.cards.replace(
          store.cards.map((ca) => {
            return ca.pairId !== flippedCard.pairId
              ? ca
              : { ...ca, solved: true, visible: false };
          }),
        );
      }
    },

    get solvedCards() {
      return store.cards.filter((card) => card.solved).length / 2;
    },
    restart: () => {
      store.cards.replace(createMemoryCards(countries, 8));
    },
  }));

  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
};

const SolvedCards = () => {
  const store = React.useContext(StoreContext);
  const confettiConfig = {
    angle: 90,
    spread: 90,
    startVelocity: 33,
    elementCount: 120,
    dragFriction: 0.15,
    duration: 4000,
    stagger: 3,
    width: '12px',
    height: '12px',
    perspective: '560px',
    colors: ['#a864fd', '#29cdff', '#78ff44', '#ff718d', '#fdff6a'],
  };
  return useObserver(() => (
    <>
      <Confetti
        active={store.solvedCards === store.cards.length / 2}
        config={confettiConfig}
      />
      <div className="solved">Solved: {store.solvedCards}</div>
    </>
  ));
};

const MobXCards = ({ gameSetting }) => {
  const store = React.useContext(StoreContext);

  return useObserver(() => (
    <>
      <div className="memory-area">
        {' '}
        {store.cards.map((card) => {
          return (
            <div className="memory-card" key={card.id}>
              <button
                onClick={() => store.flipCard(card)}
                className={card.visible || card.solved ? 'front' : 'back'}
              >
                {!(card.visible || card.solved) ? (
                  <div />
                ) : card.display === 'A' &&
                  (gameSetting === 'Country - Capital' ||
                    gameSetting === 'Country - Flag') ? (
                  <div>{card.name}</div>
                ) : card.display === 'A' && gameSetting === 'Capital - Flag' ? (
                  <div>{card.capital}</div>
                ) : card.display === 'B' &&
                  (gameSetting === 'Capital - Flag' ||
                    gameSetting === 'Country - Flag') ? (
                  <img src={card.flag} alt="flag" />
                ) : (
                  <div>{card.capital}</div>
                )}
              </button>
            </div>
          );
        })}
      </div>
      <button id="restart" onClick={() => store.restart()}>
        Restart
      </button>
    </>
  ));
};

export default function Memory(props) {
  const [gameSetting, setGameSetting] = useState('Country - Capital');

  const gameSettings = [
    'Country - Capital',
    'Country - Flag',
    'Capital - Flag',
  ];

  return (
    <StoreProvider>
      <Layout loggedIn={props.loggedIn}>
        <Head>
          <title>GeoQuiz - Memory</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div css={memoryStyles}>
          <div className="outer-wrapper">
            {gameSettings.map((setting) => {
              return (
                <button
                  key={setting}
                  className={
                    gameSetting === setting ? 'settings active' : 'settings'
                  }
                  onClick={() => setGameSetting(setting)}
                >
                  {setting}
                </button>
              );
            })}

            <SolvedCards />

            <MobXCards gameSetting={gameSetting} />
          </div>
        </div>
      </Layout>
    </StoreProvider>
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
    props: { loggedIn: loggedIn, user: user },
  };
}
