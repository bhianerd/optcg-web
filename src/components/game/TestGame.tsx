import React, { useEffect, useState } from 'react';
import { Card } from '../../types/types';
import GameBoard from './GameBoard';

const TestGame: React.FC = () => {
  const [deck, setDeck] = useState<Card[]>([]);
  const [hand, setHand] = useState<Card[]>([]);
  const [leader, setLeader] = useState<Card | undefined>();
  const [characterField, setCharacterField] = useState<Card[]>([]);
  const [donField, setDonField] = useState<Card[]>([]);
  const [donDeck, setDonDeck] = useState<Card[]>([]);
  const [trash, setTrash] = useState<Card[]>([]);
  const [isViewingTrash, setIsViewingTrash] = useState(false);

  useEffect(() => {
    // Load deck from localStorage
    const savedDecks = localStorage.getItem('optcg_saved_decks');
    if (savedDecks) {
      const decks = JSON.parse(savedDecks);
      if (decks && decks.length > 0) {
        const selectedDeck = decks[0];
        console.log('Loaded deck:', selectedDeck);

        // Initialize game state
        const shuffledDeck = [...selectedDeck.cards].sort(() => Math.random() - 0.5);
        
        // Add instanceId to cards
        const addInstanceId = (card: Card) => ({
          ...card,
          instanceId: `${card.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        });

        // Set up initial hand (5 cards)
        setHand(shuffledDeck.slice(0, 5).map(addInstanceId));
        
        // Set leader
        setLeader(addInstanceId(selectedDeck.leader));
        
        // Set remaining deck
        setDeck(shuffledDeck.slice(5).map(addInstanceId));
        
        // Initialize empty don deck with 10 cards
        setDonDeck(Array(10).fill(null));
      }
    }
  }, []);

  const handleCardPlay = (card: Card, zone: string) => {
    console.log('Playing card to zone:', zone, card);
    // Remove from hand
    setHand(prev => prev.filter(c => c.instanceId !== card.instanceId));
    
    // Add to character field
    if (zone === 'field') {
      setCharacterField(prev => [...prev, card]);
    }
  };

  const handleMoveToTrash = (card: Card) => {
    console.log('Moving to trash:', card);
    // Remove from hand or field
    setHand(prev => prev.filter(c => c.instanceId !== card.instanceId));
    setCharacterField(prev => prev.filter(c => c.instanceId !== card.instanceId));
    
    // Add to trash
    setTrash(prev => [...prev, card]);
  };

  const handleDrawCard = () => {
    if (deck.length === 0) return;
    
    // Take the top card from the deck
    const [drawnCard, ...remainingDeck] = deck;
    
    // Add to hand
    setHand(prev => [...prev, drawnCard]);
    
    // Update deck
    setDeck(remainingDeck);
  };

  const handleViewTrash = () => {
    setIsViewingTrash(true);
  };

  const handleCloseTrash = () => {
    setIsViewingTrash(false);
  };

  return (
    <div className="w-full h-screen bg-gray-900">
      <GameBoard
        deck={deck}
        hand={hand}
        donDeck={donDeck}
        trash={trash}
        leader={leader}
        characterField={characterField}
        donField={donField}
        stageCard={undefined}
        player2Deck={[]}
        player2DonDeck={[]}
        player2Trash={[]}
        player2Leader={undefined}
        player2CharacterField={[]}
        player2DonField={[]}
        player2StageCard={undefined}
        isPlayerTurn={true}
        onCardPlay={handleCardPlay}
        onMoveToTrash={handleMoveToTrash}
        onDrawCard={handleDrawCard}
        onViewTrash={handleViewTrash}
        isViewingTrash={isViewingTrash}
        onCloseTrash={handleCloseTrash}
      />
    </div>
  );
};

export default TestGame; 