import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setAllCards, setError, setLoading } from '../redux/slices/deckBuilderSlice';
import { loadCards } from '../utils/cardLoader';

export default function CardDataProvider() {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchCards = async () => {
      console.log('Starting to fetch cards...');
      dispatch(setLoading(true));
      try {
        const cards = await loadCards();
        console.log('Loaded cards:', cards.length, 'cards');
        console.log('Sample card:', cards[0]);
        dispatch(setAllCards(cards));
      } catch (error) {
        console.error('Error loading cards:', error);
        dispatch(setError(error instanceof Error ? error.message : 'Failed to load cards'));
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchCards();
  }, [dispatch]);

  return null;
} 