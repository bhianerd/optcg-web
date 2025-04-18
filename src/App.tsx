import { Provider } from 'react-redux';
import CardDataProvider from './components/CardDataProvider';
import DeckBuilder from './components/deckbuilder/DeckBuilder';
import { store } from './redux/store';

function App() {
  return (
    <Provider store={store}>
      <CardDataProvider />
      <DeckBuilder />
    </Provider>
  );
}

export default App;
