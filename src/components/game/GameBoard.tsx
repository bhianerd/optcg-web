import { useState } from 'react';
import type { Card } from '../../types/types';
import CardComponent from '../Card';

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
  onDeckClick
}) => {
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [hoveredCard, setHoveredCard] = useState<Card | null>(null);

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

  const handleDeckClick = () => {
    if (!isPlayerTurn) return;
    onDeckClick?.();
  };

  return (
    <div className="relative w-full h-screen bg-gradient-to-b from-blue-900 via-blue-800 to-blue-900">
      {/* Opponent's side */}
      <div className="absolute top-0 left-0 w-full h-[45%]">
        {/* Cost Area */}
        <div className="relative h-24 mx-8 mt-4">
          <div className="absolute inset-0 bg-black/50 rounded-lg backdrop-blur-sm">
            <h2 className="text-white text-2xl font-bold text-center py-2">COST AREA</h2>
          </div>
        </div>

        {/* Character Area */}
        <div className="relative h-48 mx-8 mt-4">
          <div className="absolute inset-0 bg-black/50 rounded-lg backdrop-blur-sm">
            <h2 className="text-white text-2xl font-bold text-center py-2">CHARACTER AREA</h2>
            <div className="flex items-center justify-center space-x-4 p-2">
              {/* Leader */}
              <div className="w-24 h-36">
                {field[0] && (
                  <CardComponent
                    card={field[0]}
                    isSelected={selectedCard?.id === field[0].id}
                    onClick={() => { handleCardClick(field[0], 'opponentField'); }}
                    onHover={() => { handleCardHover(field[0]); }}
                  />
                )}
              </div>
              
              {/* Characters */}
              <div className="flex space-x-2">
                {field.slice(1).map((card, index) => (
                  <div key={index} className="w-24 h-36">
                    <CardComponent
                      card={card}
                      isSelected={selectedCard?.id === card.id}
                      onClick={() => { handleCardClick(card, 'opponentField'); }}
                      onHover={() => { handleCardHover(card); }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Center area with logo */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <h1 className="text-4xl font-bold text-white">ONE PIECE CARD GAME</h1>
      </div>

      {/* Player's side */}
      <div className="absolute bottom-0 left-0 w-full h-[45%]">
        {/* Character Area */}
        <div className="relative h-48 mx-8 mb-4">
          <div className="absolute inset-0 bg-black/50 rounded-lg backdrop-blur-sm">
            <h2 className="text-white text-2xl font-bold text-center py-2">CHARACTER AREA</h2>
            <div className="flex items-center justify-center space-x-4 p-2">
              {/* Leader */}
              <div className="w-24 h-36">
                {field[0] && (
                  <CardComponent
                    card={field[0]}
                    isSelected={selectedCard?.id === field[0].id}
                    onClick={() => { handleCardClick(field[0], 'playerField'); }}
                    onHover={() => { handleCardHover(field[0]); }}
                  />
                )}
              </div>
              
              {/* Characters */}
              <div className="flex space-x-2">
                {field.slice(1).map((card, index) => (
                  <div key={index} className="w-24 h-36">
                    <CardComponent
                      card={card}
                      isSelected={selectedCard?.id === card.id}
                      onClick={() => { handleCardClick(card, 'playerField'); }}
                      onHover={() => { handleCardHover(card); }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Cost Area */}
        <div className="relative h-24 mx-8 mb-4">
          <div className="absolute inset-0 bg-black/50 rounded-lg backdrop-blur-sm">
            <h2 className="text-white text-2xl font-bold text-center py-2">COST AREA</h2>
          </div>
        </div>
      </div>

      {/* Left side zones */}
      <div className="absolute left-2 top-1/2 transform -translate-y-1/2 space-y-4">
        <div 
          className="w-20 h-28 cursor-pointer hover:scale-105 transition-transform" 
          onClick={handleDeckClick}
        >
          <CardComponent isFaceDown />
          <span className="text-white text-sm">DECK ({deck.length})</span>
        </div>
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
                onClick={() => { handleCardPlay(card, 'field'); }}
                onHover={() => { handleCardHover(card); }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Card preview */}
      {hoveredCard && (
        <div className="absolute top-4 right-4 w-48 h-64">
          <CardComponent card={hoveredCard} />
        </div>
      )}
    </div>
  );
};

export default GameBoard; 