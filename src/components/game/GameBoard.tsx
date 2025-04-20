import { useState } from 'react';
import type { Card } from '../../types/types';
import CardComponent from '../Card';
import DeckZone from './DeckZone';

type GameBoardProps = {
  deck: Card[];
  hand: Card[];
  field: Card[];
  donDeck: Card[];
  trash: Card[];
  isPlayerTurn: boolean;
  onCardPlay?: (card: Card, zone: string) => void;
  onCardAttack?: (attacker: Card, target: Card) => void;
  onCardActivate?: (card: Card) => void;
  onDeckClick?: () => void;
  onDeckShuffle?: () => void;
};

const GameBoard: React.FC<GameBoardProps> = ({
  deck,
  hand,
  field,
  donDeck,
  trash,
  isPlayerTurn,
  onCardPlay,
  onCardAttack,
  onCardActivate,
  onDeckClick,
  onDeckShuffle
}) => {
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [hoveredCard, setHoveredCard] = useState<Card | null>(null);
  const [isViewingTopCard, setIsViewingTopCard] = useState(false);

  const handleCardClick = (card: Card, zone: string) => {
    if (!isPlayerTurn) return;

    if (selectedCard) {
      if (zone === 'opponentField' && selectedCard.type.toLowerCase() === 'character') {
        onCardAttack?.(selectedCard, card);
      } else if (zone === 'playerField' && selectedCard.id === card.id) {
        onCardActivate?.(card);
      }
      setSelectedCard(null);
    } else {
      setSelectedCard(card);
    }
  };

  const handleCardHover = (card: Card) => {
    setHoveredCard(card);
  };

  const handleCardPlay = (card: Card, zone: string) => {
    if (!isPlayerTurn) return;
    onCardPlay?.(card, zone);
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

  return (
    <div className="relative w-full h-[600px] bg-gray-800 rounded-lg p-4">
      {/* Field zones */}
      <div className="grid grid-cols-5 gap-4 h-full">
        {/* Player's field */}
        <div className="col-span-5 h-32 border border-gray-600 rounded p-2">
          <div className="flex gap-2">
            {field.map((card, index) => (
              <div key={index} className="w-20 h-28">
                <CardComponent
                  card={card}
                  isSelected={selectedCard?.id === card.id}
                  onClick={() => handleCardClick(card, 'playerField')}
                  onHover={() => handleCardHover(card)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Left side zones */}
      <div className="absolute left-2 top-1/2 transform -translate-y-1/2 space-y-4">
        <DeckZone
          deck={deck}
          onDraw={handleDeckDraw}
          onShuffle={handleDeckShuffle}
          onViewTop={handleViewTopCard}
        />
        <div className="w-20 h-28">
          <CardComponent isFaceDown />
          <span className="text-white text-sm">DON ({donDeck.length})</span>
        </div>
      </div>

      {/* Right side zones */}
      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 space-y-4">
        <div className="w-20 h-28">
          {trash.length > 0 && (
            <CardComponent card={trash[trash.length - 1]} />
          )}
          <span className="text-white text-sm">TRASH ({trash.length})</span>
        </div>
        <div className="w-20 h-28">
          <CardComponent isFaceDown />
          <span className="text-white text-sm">STAGE</span>
        </div>
      </div>

      {/* Hand */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 mb-2">
        <div className="flex items-center justify-center space-x-2">
          {hand.map((card, index) => (
            <div key={index} className="w-20 h-28 hover:-translate-y-4 transition-transform">
              <CardComponent
                card={card}
                isSelected={selectedCard?.id === card.id}
                onClick={() => handleCardPlay(card, 'field')}
                onHover={() => handleCardHover(card)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Card preview */}
      {(hoveredCard || (isViewingTopCard && deck.length > 0)) && (
        <div 
          className="absolute top-4 right-4 w-48 h-64"
          onMouseLeave={() => {
            if (isViewingTopCard) {
              setIsViewingTopCard(false);
              setHoveredCard(null);
            }
          }}
        >
          <CardComponent card={hoveredCard || deck[0]} />
        </div>
      )}
    </div>
  );
};

export default GameBoard; 