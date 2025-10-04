import React from 'react';
import { Provider } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { store } from '../../redux/store';
import CardDataProvider from '../CardDataProvider';
import DeckBuilder from '../deckbuilder/DeckBuilder';

const DeckEditor: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Provider store={store}>
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center p-4">
            <h1 className="text-3xl font-bold text-gray-800">Deck Editor</h1>
            <button
              onClick={() => navigate('/menu')}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              Back to Menu
            </button>
          </div>
          
          <div className="p-4">
            <CardDataProvider />
            <DeckBuilder />
          </div>
        </div>
      </div>
    </Provider>
  );
};

export default DeckEditor; 