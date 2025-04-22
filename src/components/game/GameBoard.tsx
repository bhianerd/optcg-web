import React, { useEffect, useState } from 'react';
import { Card } from '../../types/types';
import CardComponent from './Card';
import CardOptions from './CardOptions';

type GameBoardProps = {
  // Player 1 (bottom player)
  deck: Card[];
  hand: Card[];
  donDeck: Card[];
  trash: Card[];
  leader?: Card;
  characterField: Card[];
  donField: Card[];
  stageCard?: Card;
  
  // Player 2 (top player)
  player2Deck: Card[];
  player2DonDeck: Card[];
  player2Trash: Card[];
  player2Leader?: Card;
  player2CharacterField: Card[];
  player2DonField: Card[];
  player2StageCard?: Card;

  isPlayerTurn: boolean;
  onCardPlay: (card: Card, zone: string) => void;
  onMoveToTrash: (card: Card) => void;
  onDrawCard?: () => void;
  onViewTrash?: () => void;
  isViewingTrash?: boolean;
  onCloseTrash?: () => void;
};

const GameBoard: React.FC<GameBoardProps> = ({
  // Player 1
  deck,
  hand,
  donDeck,
  trash,
  leader,
  characterField,
  donField,
  stageCard,
  
  // Player 2
  player2Deck,
  player2DonDeck,
  player2Trash,
  player2Leader,
  player2CharacterField,
  player2DonField,
  player2StageCard,

  isPlayerTurn,
  onCardPlay,
  onMoveToTrash,
  onDrawCard,
  onViewTrash,
  isViewingTrash,
  onCloseTrash,
}) => {
  const [hoveredCard, setHoveredCard] = useState<Card | null>(null);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [tappedCards, setTappedCards] = useState<Set<string>>(new Set());

  // Load deck from localStorage on mount
  useEffect(() => {
    const savedDecks = localStorage.getItem('optcg_saved_decks');
    if (savedDecks) {
      const decks = JSON.parse(savedDecks);
      if (decks && decks.length > 0) {
        console.log('Loaded deck:', decks[0]);
      }
    }
  }, []);

  const handleCardHover = (card: Card | null) => {
    setHoveredCard(card);
  };

  const handleCardPlay = (card: Card) => {
    onCardPlay(card, 'field');
  };

  const handleTapCard = (cardId: string) => {
    const newTappedCards = new Set(tappedCards);
    newTappedCards.add(cardId);
    setTappedCards(newTappedCards);
  };

  const handleUntapCard = (cardId: string) => {
    const newTappedCards = new Set(tappedCards);
    newTappedCards.delete(cardId);
    setTappedCards(newTappedCards);
  };

  // Trash view component
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
            <div key={card.instanceId || index} className="w-32 h-44">
              <CardOptions
                card={card}
                onHover={() => handleCardHover(card)}
                onMouseLeave={() => handleCardHover(null)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-screen flex">
      {/* Card preview section */}
      <div className="w-[400px] min-w-[400px] p-8 bg-gray-800">
        {hoveredCard && (
          <div className="space-y-4 sticky top-8">
            <div className="w-[300px] h-[420px] mx-auto rounded-lg overflow-hidden">
              <img 
                src={hoveredCard.img_url} 
                alt={hoveredCard.name}
                className="w-full h-full object-contain"
              />
            </div>
            {/* Card details section */}
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="text-xl font-bold text-white">{hoveredCard.name}</h3>
              {hoveredCard.effect && (
                <p className="text-white mt-2 text-sm">{hoveredCard.effect}</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Game board section */}
      <div className="flex-1 p-8 bg-gray-900">
        <div className="relative w-full h-full rounded-lg border border-gray-700">
          {/* Player 2 (Top) Section */}
          <div className="absolute top-4 left-4 right-4 space-y-4">
            {/* Player 2 Don Field */}
            <div className="flex items-center gap-4">
              <div className="w-32">
                <CardComponent isFaceDown />
                <span className="text-white text-sm mt-1 block">P2 Deck</span>
              </div>
              <div className="flex-1 h-32 border border-gray-600 rounded-lg">
                <span className="text-white text-sm">P2 Don Field</span>
              </div>
              <div className="w-32">
                <CardComponent isFaceDown />
                <span className="text-white text-sm mt-1 block">P2 Don Deck</span>
              </div>
            </div>

            {/* Player 2 Character Field */}
            <div className="flex items-center gap-4">
              <div className="w-32">
                <CardComponent isFaceDown />
                <span className="text-white text-sm mt-1 block">P2 Trash</span>
              </div>
              <div className="w-32">
                <CardComponent isFaceDown />
                <span className="text-white text-sm mt-1 block">P2 Stage</span>
              </div>
              <div className="flex-1 h-32 border border-gray-600 rounded-lg">
                <span className="text-white text-sm">P2 Character Field</span>
              </div>
              <div className="w-32">
                <CardComponent isFaceDown />
                <span className="text-white text-sm mt-1 block">P2 Leader</span>
              </div>
            </div>
          </div>

          {/* Player 1 (Bottom) Section */}
          <div className="absolute bottom-4 left-4 right-4 space-y-4">
            {/* Player 1 Character Field */}
            <div className="flex items-center gap-4">
              <div className="w-32">
                {leader ? (
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
                ) : (
                  <div className="w-32 h-44 border-2 border-dashed border-gray-600 rounded-lg" />
                )}
                <span className="text-white text-sm mt-1 block">Leader</span>
              </div>
              <div className="flex-1 h-44 border border-gray-600 rounded-lg p-2">
                <div className="flex gap-2 h-full">
                  {characterField.map((card, index) => (
                    <div key={card.instanceId || index} className="w-32">
                      <CardOptions
                        card={card}
                        isSelected={selectedCard?.id === card.id}
                        isTapped={tappedCards.has(card.id)}
                        onTap={() => handleTapCard(card.id)}
                        onUntap={() => handleUntapCard(card.id)}
                        onTrash={() => onMoveToTrash(card)}
                        onHover={() => handleCardHover(card)}
                        onMouseLeave={() => handleCardHover(null)}
                      />
                    </div>
                  ))}
                </div>
                <span className="text-white text-sm">Character Field</span>
              </div>
              <div className="w-32">
                <CardComponent isFaceDown />
                <span className="text-white text-sm mt-1 block">Stage</span>
              </div>
              <div className="w-32">
                <div 
                  className="cursor-pointer"
                  onClick={onViewTrash}
                >
                  {trash.length > 0 ? (
                    <div 
                      className="relative"
                      onMouseEnter={() => handleCardHover(trash[trash.length - 1])}
                      onMouseLeave={() => handleCardHover(null)}
                    >
                      <CardComponent card={trash[trash.length - 1]} />
                      {trash.length > 1 && (
                        <div className="absolute -bottom-1 -right-1 bg-gray-800 text-white px-2 py-1 rounded-full text-xs">
                          +{trash.length - 1}
                        </div>
                      )}
                    </div>
                  ) : (
                    <CardComponent isFaceDown />
                  )}
                </div>
                <span className="text-white text-sm mt-1 block">Trash ({trash.length})</span>
              </div>
            </div>

            {/* Player 1 Don Field */}
            <div className="flex items-center gap-4">
              <div className="w-32">
                <CardComponent isFaceDown />
                <span className="text-white text-sm mt-1 block">Don Deck</span>
              </div>
              <div className="flex-1 h-32 border border-gray-600 rounded-lg">
                <span className="text-white text-sm">Don Field</span>
              </div>
              <div className="w-32 cursor-pointer" onClick={onDrawCard}>
                {deck.length > 0 ? (
                  <div className="relative">
                    <CardComponent isFaceDown />
                    <div className="absolute -bottom-1 -right-1 bg-gray-800 text-white px-2 py-1 rounded-full text-xs">
                      {deck.length}
                    </div>
                  </div>
                ) : (
                  <div className="w-32 h-44 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500 text-sm">Empty</span>
                  </div>
                )}
                <span className="text-white text-sm mt-1 block">Deck ({deck.length})</span>
              </div>
            </div>

            {/* Player Hand */}
            <div className="absolute -bottom-24 left-1/2 transform -translate-x-1/2 flex items-center gap-2">
              {hand.map((card, index) => (
                <div 
                  key={card.instanceId || index} 
                  className="w-32 h-44 transition-transform hover:-translate-y-6"
                >
                  <CardOptions
                    card={card}
                    isSelected={selectedCard?.id === card.id}
                    onPlay={() => handleCardPlay(card)}
                    onTrash={() => onMoveToTrash(card)}
                    onHover={() => handleCardHover(card)}
                    onMouseLeave={() => handleCardHover(null)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Trash View Modal */}
      {isViewingTrash && <TrashView />}
    </div>
  );
};

export default GameBoard; 