import { useEffect, useState } from 'react';
import type { Card } from '../../types/types';
import { CardType } from '../../types/types';
import CardComponent from '../Card';
import CardOptions from './CardOptions';
import DeckZone from './DeckZone';

type GameBoardProps = {
  deck: Card[];
  hand: Card[];
  field: Card[];
  donDeck: Card[];
  trash: Card[];
  life?: Card[];  // Add life as optional
  counters?: number;  // Add counters as optional
  isPlayerTurn: boolean;
  isViewingTrash?: boolean;
  onCardPlay: (card: Card, zone: string) => void;
  onMoveToTrash: (card: Card) => void;
  onCardAttack?: (attacker: Card, target: Card) => void;
  onCardActivate?: (card: Card) => void;
  onDonAttach?: (card: Card) => void;
  onDeckClick?: () => void;
  onDeckShuffle?: () => void;
  onViewTrash?: () => void;
  onCloseTrash?: () => void;
};

const GameBoard: React.FC<GameBoardProps> = ({
  deck,
  hand,
  field,
  donDeck,
  trash,
  life,
  counters,
  isPlayerTurn,
  isViewingTrash,
  onCardPlay,
  onMoveToTrash,
  onCardAttack,
  onCardActivate,
  onDonAttach,
  onDeckClick,
  onDeckShuffle,
  onViewTrash,
  onCloseTrash
}) => {
  console.log('GameBoard mounted with onMoveToTrash:', typeof onMoveToTrash);
  console.log('GameBoard mounted with onCardPlay:', typeof onCardPlay);
  
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [hoveredCard, setHoveredCard] = useState<Card | null>(null);
  const [isViewingTopCard, setIsViewingTopCard] = useState(false);
  const [tappedCards, setTappedCards] = useState<Set<string>>(new Set());

  // Separate leader and character cards
  const leader = field.find(card => card.type.toUpperCase() === 'LEADER');
  const characters = field.filter(card => card.type.toUpperCase() === 'CHARACTER');

  const handleCardClick = (card: Card, zone: string) => {
    if (!isPlayerTurn) return;

    if (selectedCard) {
      if (zone === 'opponentField' && selectedCard.type === CardType.CHARACTER) {
        onCardAttack?.(selectedCard, card);
      } else if (zone === 'playerField' && selectedCard.instanceId === card.instanceId) {
        onCardActivate?.(card);
      }
      setSelectedCard(null);
    } else {
      setSelectedCard(card);
    }
  };

  const handleCardHover = (card: Card | null) => {
    console.log('Card hover:', card);
    setHoveredCard(card);
  };

  const handleCardPlay = (card: Card) => {
    console.log('Attempting to play card:', card);
    if (!isPlayerTurn) return;
    
    // Check if we're trying to play a character and if we already have 5 characters
    if (card.type.toUpperCase() === 'CHARACTER' && characters.length >= 5) {
      console.log('Cannot play more characters - field is full');
      return;
    }
    
    console.log('Playing card to field');
    onCardPlay(card, 'field');
  };

  const handleDeckDraw = () => {
    if (!isPlayerTurn) return;
    onDeckClick?.();
  };

  const handleDeckShuffle = () => {
    if (!isPlayerTurn) return;
    onDeckShuffle?.();
  };

  const handleViewTopCard = () => {
    if (!isPlayerTurn || deck.length === 0) return;
    setIsViewingTopCard(true);
    setHoveredCard(deck[0]);
  };

  const handleTapCard = (cardId: string) => {
    if (!isPlayerTurn) return;
    setTappedCards(prev => {
      const newTapped = new Set(prev);
      newTapped.add(cardId);
      return newTapped;
    });
  };

  const handleUntapCard = (cardId: string) => {
    if (!isPlayerTurn) return;
    setTappedCards(prev => {
      const newTapped = new Set(prev);
      newTapped.delete(cardId);
      return newTapped;
    });
  };

  const handleMoveToTrash = (card: Card) => {
    console.log('Moving card to trash:', card);
    if (!isPlayerTurn) return;
    console.log('onMoveToTrash type:', typeof onMoveToTrash);
    if (onMoveToTrash) {
      onMoveToTrash(card);
    } else {
      console.error('onMoveToTrash is not defined');
    }
  };

  const handleViewTrash = () => {
    // This function is now empty as the logic has been moved to handleViewTrash
  };

  const TrashView = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg w-[80vw] h-[80vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-white text-xl font-bold">Trash ({trash.length} cards)</h2>
          <button 
            onClick={onCloseTrash}
            className="text-white hover:text-gray-300"
          >
            Close
          </button>
        </div>
        <div className="flex-1 overflow-y-auto grid grid-cols-6 gap-4 p-4">
          {trash.map((card, index) => (
            <div key={index} className="w-32 h-44">
              <CardOptions
                card={card}
                onHover={() => handleCardHover(card)}
                onMouseLeave={() => handleCardHover(null)}
                onTrash={() => onMoveToTrash(card)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Auto-play leader if in hand
  useEffect(() => {
    console.log('Checking for leader:', { hand, leader, field });
    if (isPlayerTurn && hand.length > 0 && !leader) {
      const leaderCard = hand.find(card => card.type.toUpperCase() === 'LEADER');
      console.log('Found leader card:', leaderCard);
      if (leaderCard) {
        console.log('Auto-playing leader card');
        handleCardPlay(leaderCard);
      }
    }
  }, [hand, leader, isPlayerTurn]);

  // Add this function to verify state updates
  useEffect(() => {
    console.log('GameBoard received updated state:', {
      handCount: hand.length,
      fieldCount: field.length,
      trashCount: trash.length,
      hand,
      field,
      trash
    });
  }, [hand, field, trash]);

  return (
    <div className="flex flex-col w-full h-screen bg-gray-800">
      {/* Header */}
      <div className="w-full p-4 flex justify-between items-center border-b border-gray-600">
        <div className="text-white text-xl">One Piece Card Game</div>
        <div className="text-white">Turn: Your Turn</div>
      </div>

      {/* Main content */}
      <div className="flex flex-1">
        {/* Card preview section */}
        <div className="w-[400px] min-w-[400px] p-8">
          {hoveredCard && (
            <div className="space-y-4 sticky top-8">
              {/* Card Image */}
              <div className="w-[300px] h-[420px] mx-auto rounded-lg overflow-hidden">
                <img 
                  src={hoveredCard.img_url} 
                  alt={hoveredCard.name}
                  className="w-full h-full object-contain"
                />
              </div>
              {/* Card Details */}
              <div className="bg-gray-700 rounded-lg p-4">
                {/* Card Header */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">{hoveredCard.name}</h3>
                  <div className="flex items-center gap-2">
                    {hoveredCard.cost !== undefined && (
                      <span className="text-white bg-gray-600 px-2 py-1 rounded">
                        Cost: {hoveredCard.cost}
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Metadata */}
                <div className="flex flex-wrap items-center gap-2 mb-4 text-sm">
                  <span className="text-white bg-gray-600 px-2 py-1 rounded capitalize">
                    {hoveredCard.type}
                  </span>
                  {hoveredCard.color && (
                    <span className="text-white bg-gray-600 px-2 py-1 rounded capitalize">
                      {hoveredCard.color}
                    </span>
                  )}
                  {hoveredCard.attribute && (
                    <span className="text-white bg-gray-600 px-2 py-1 rounded">
                      {hoveredCard.attribute}
                    </span>
                  )}
                </div>

                {/* Card Stats */}
                {(hoveredCard.power !== undefined || hoveredCard.counter !== undefined) && (
                  <div className="flex flex-wrap gap-4 mb-4">
                    {hoveredCard.power !== undefined && (
                      <div className="text-white">
                        <span className="font-semibold">Power:</span> {hoveredCard.power}
                      </div>
                    )}
                    {hoveredCard.counter !== undefined && (
                      <div className="text-white">
                        <span className="font-semibold">Counter:</span> {hoveredCard.counter}
                      </div>
                    )}
                    {hoveredCard.life !== undefined && (
                      <div className="text-white">
                        <span className="font-semibold">Life:</span> {hoveredCard.life}
                      </div>
                    )}
                  </div>
                )}

                {/* Card Effects */}
                {hoveredCard.effect && (
                  <div className="mb-4">
                    <h4 className="text-white font-semibold mb-2">Effect</h4>
                    <p className="text-white text-sm whitespace-pre-wrap" 
                       dangerouslySetInnerHTML={{ __html: hoveredCard.effect }} />
                  </div>
                )}

                {/* Trigger Effect */}
                {hoveredCard.trigger && (
                  <div className="mb-4">
                    <h4 className="text-white font-semibold mb-2">Trigger</h4>
                    <p className="text-white text-sm whitespace-pre-wrap">{hoveredCard.trigger}</p>
                  </div>
                )}

                {/* Card Set Info */}
                <div className="flex items-center justify-between text-sm text-gray-400 mt-4">
                  <span>{hoveredCard.set_id}-{hoveredCard.card_number}</span>
                  <span className="capitalize">{hoveredCard.rarity}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Game board section */}
        <div className="flex-1 flex justify-center items-center p-8">
          <div className="relative w-[1200px] h-[800px] bg-gray-900 rounded-lg">
            {/* Top info bar */}
            <div className="absolute top-4 left-4 right-4 flex justify-between">
              <span className="text-white text-sm">DECK ({deck.length})</span>
              <span className="text-white text-sm">TRASH ({trash.length})</span>
            </div>

            {/* Opponent's field */}
            <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-[900px]">
              <div className="h-48 border border-gray-600 rounded-lg p-4">
                <div className="grid grid-cols-6 gap-4 h-full">
                  {/* Empty slots for opponent's field */}
                  {[...Array(6)].map((_, index) => (
                    <div 
                      key={index}
                      className="border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center"
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Side zones container */}
            <div className="absolute top-1/2 transform -translate-y-1/2 w-full flex justify-between px-8">
              {/* Left side zones */}
              <div className="space-y-6">
                <div className="relative w-32">
                  <DeckZone
                    deck={deck}
                    onDraw={handleDeckDraw}
                    onShuffle={handleDeckShuffle}
                    onViewTop={handleViewTopCard}
                  />
                  <span className="text-white text-sm mt-2 block">DECK ({deck.length})</span>
                </div>
                <div className="relative w-32">
                  <CardComponent isFaceDown />
                  <span className="text-white text-sm mt-2 block">DON ({donDeck.length})</span>
                </div>
              </div>

              {/* Right side zones */}
              <div className="space-y-6">
                <div 
                  className="relative w-32 cursor-pointer"
                  onClick={onViewTrash}
                  onMouseEnter={() => {
                    if (trash.length > 0) {
                      handleCardHover(trash[trash.length - 1]);
                    }
                  }}
                  onMouseLeave={() => handleCardHover(null)}
                >
                  {trash.length > 0 ? (
                    <div className="relative">
                      <CardComponent card={trash[trash.length - 1]} />
                      {trash.length > 1 && (
                        <div className="absolute -bottom-1 -right-1 bg-gray-800 text-white px-2 py-1 rounded-full text-xs">
                          +{trash.length - 1}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="w-32 h-44 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center">
                      <span className="text-gray-500 text-sm">Empty</span>
                    </div>
                  )}
                  <span className="text-white text-sm mt-2 block">TRASH ({trash.length})</span>
                </div>
                <div className="relative w-32">
                  <CardComponent isFaceDown />
                  <span className="text-white text-sm mt-2 block">STAGE</span>
                </div>
              </div>
            </div>

            {/* Player's field */}
            <div className="absolute bottom-[180px] left-1/2 transform -translate-x-1/2 w-[900px]">
              <div className="h-48 border border-gray-600 rounded-lg p-4">
                <div className="grid grid-cols-6 gap-4 h-full">
                  {/* Leader slot */}
                  <div className={`border-2 ${leader ? 'border-yellow-500' : 'border-dashed border-gray-600'} rounded-lg flex items-center justify-center`}>
                    {leader && (
                      <div className="w-32 h-44">
                        <CardOptions
                          card={leader}
                          isSelected={selectedCard?.id === leader.id}
                          isTapped={tappedCards.has(leader.id)}
                          onTap={() => handleTapCard(leader.id)}
                          onUntap={() => handleUntapCard(leader.id)}
                          onTrash={() => onMoveToTrash(leader)}
                          onHover={() => handleCardHover(leader)}
                          onMouseLeave={() => handleCardHover(null)}
                        />
                      </div>
                    )}
                  </div>

                  {/* Character slots */}
                  {[...Array(5)].map((_, index) => (
                    <div 
                      key={index}
                      className={`border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center ${
                        characters[index] ? 'border-solid border-blue-500' : ''
                      }`}
                    >
                      {characters[index] && (
                        <div className="w-32 h-44">
                          <CardOptions
                            card={characters[index]}
                            isSelected={selectedCard?.id === characters[index].id}
                            isTapped={tappedCards.has(characters[index].id)}
                            onTap={() => handleTapCard(characters[index].id)}
                            onUntap={() => handleUntapCard(characters[index].id)}
                            onTrash={() => onMoveToTrash(characters[index])}
                            onHover={() => handleCardHover(characters[index])}
                            onMouseLeave={() => handleCardHover(null)}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Hand */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
              <div className="flex items-center justify-center gap-2">
                {hand.map((card, index) => (
                  <div key={`${card.id}-${index}`} className="w-32 h-44 hover:-translate-y-6 transition-transform">
                    <CardOptions
                      card={card}
                      isSelected={selectedCard?.id === card.id}
                      onPlay={() => handleCardPlay(card)}
                      onTrash={() => handleMoveToTrash(card)}
                      onHover={() => handleCardHover(card)}
                      onMouseLeave={() => handleCardHover(null)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {isViewingTrash && <TrashView />}
    </div> 
  );
};

export default GameBoard; 