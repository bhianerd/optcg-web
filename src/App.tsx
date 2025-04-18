import './App.css';
import DeckBuilder from './components/deckbuilder/DeckBuilder';

function App() {
  return (
    <div className="min-h-screen bg-gray-900">
      <header className="bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-white">One Piece TCG Deck Builder</h1>
        </div>
      </header>
      <main className="py-4">
        <DeckBuilder />
      </main>
    </div>
  );
}

export default App;
