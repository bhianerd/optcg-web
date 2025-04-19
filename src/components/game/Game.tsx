import React, { useState } from 'react';
import type { Card, Deck } from '../../types/types';
import GameBoard from './GameBoard';

interface GameProps {
  playerDeck: Deck;
  opponentDeck: Deck;
}

const Game: React.FC<GameProps> = ({ playerDeck, opponentDeck }) => {
  // Game state
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [opponentHand, setOpponentHand] = useState<Card[]>([]);
  const [playerField, setPlayerField] = useState<Card[]>([]);
  const [opponentField, setOpponentField] = useState<Card[]>([]);
  const [playerDonDeck, setPlayerDonDeck] = useState<Card[]>([]);
  const [opponentDonDeck, setOpponentDonDeck] = useState<Card[]>([]);
  const [playerTrash, setPlayerTrash] = useState<Card[]>([]);
  const [opponentTrash, setOpponentTrash] = useState<Card[]>([]);
  const [playerLife, setPlayerLife] = useState<Card[]>([]);
  const [opponentLife, setOpponentLife] = useState<Card[]>([]);
  const [counters, setCounters] = useState(0);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [playerDeckRemaining, setPlayerDeckRemaining] = useState<Card[]>([]);
  const [opponentDeckRemaining, setOpponentDeckRemaining] = useState<Card[]>([]);

  // Initialize game
  const initializeGame = () => {
    // Shuffle decks
    const shuffledPlayerDeck = [...playerDeck.cards].sort(() => Math.random() - 0.5);
    const shuffledOpponentDeck = [...opponentDeck.cards].sort(() => Math.random() - 0.5);

    // Draw starting hands (5 cards)
    setPlayerHand(shuffledPlayerDeck.slice(0, 5));
    setOpponentHand(shuffledOpponentDeck.slice(0, 5));

    // Set up life (5 cards)
    setPlayerLife(shuffledPlayerDeck.slice(5, 10));
    setOpponentLife(shuffledOpponentDeck.slice(5, 10));

    // Set up Don decks (10 cards)
    setPlayerDonDeck(Array(10).fill({} as Card));
    setOpponentDonDeck(Array(10).fill({} as Card));

    // Set up fields with leaders
    setPlayerField([playerDeck.leader]);
    setOpponentField([opponentDeck.leader]);

    // Store remaining deck cards
    setPlayerDeckRemaining(shuffledPlayerDeck.slice(10));
    setOpponentDeckRemaining(shuffledOpponentDeck.slice(10));
  };

  // Handle playing a card
  const handleCardPlay = (card: Card, zone: string) => {
    if (!isPlayerTurn) return;

    // Remove card from hand
    setPlayerHand(prev => prev.filter(c => c.id !== card.id));

    // Add card to appropriate zone
    if (zone === 'field') {
      setPlayerField(prev => [...prev, card]);
    }
  };

  // Handle attacking with a card
  const handleCardAttack = (attacker: Card, target: Card) => {
    if (!isPlayerTurn) return;

    // TODO: Implement attack logic
    console.log(`${attacker.name} attacks ${target.name}`);
  };

  // Handle activating a card's effect
  const handleCardActivate = (card: Card) => {
    if (!isPlayerTurn) return;

    // TODO: Implement card activation logic
    console.log(`Activating ${card.name}`);
  };

  // Handle attaching Don to a card
  const handleDonAttach = (card: Card) => {
    if (!isPlayerTurn) return;

    // TODO: Implement Don attachment logic
    console.log(`Attaching Don to ${card.name}`);
  };

  // Handle drawing a card
  const handleDrawCard = () => {
    if (!isPlayerTurn || playerDeckRemaining.length === 0) return;

    // Draw the top card
    const [drawnCard, ...remainingDeck] = playerDeckRemaining;
    
    // Add to hand
    setPlayerHand(prev => [...prev, drawnCard]);
    
    // Update remaining deck
    setPlayerDeckRemaining(remainingDeck);
  };

  // Start game when component mounts
  React.useEffect(() => {
    initializeGame();
  }, []);

  return (
    <div className="w-full h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">One Piece Card Game</h1>
          <p className="text-gray-600">Turn: {isPlayerTurn ? 'Your Turn' : "Opponent's Turn"}</p>
        </div>
        <GameBoard
          deck={playerDeckRemaining}
          hand={playerHand}
          field={playerField}
          donDeck={playerDonDeck}
          trash={playerTrash}
          life={playerLife}
          counters={counters}
          isPlayerTurn={isPlayerTurn}
          onCardPlay={handleCardPlay}
          onCardAttack={handleCardAttack}
          onCardActivate={handleCardActivate}
          onDonAttach={handleDonAttach}
          onDeckClick={handleDrawCard}
        />
      </div>
    </div>
  );
};

export default Game; 