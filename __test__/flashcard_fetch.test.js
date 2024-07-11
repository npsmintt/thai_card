import React, { useEffect, useState } from "react";
import { SafeAreaView, Text, FlatList } from "react-native";
import { render, waitFor } from '@testing-library/react-native';
import axios from 'axios';

// Mock Axios
jest.mock('axios');

// Plain Screen Component
const FlashcardScreen = ({ wordSetId }) => {
  const [flashcards, setFlashcards] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        const response = await axios.get(`https://exciting-monster-living.ngrok-free.app/flashcards/${wordSetId}`);
        setFlashcards(response.data);
      } catch (err) {
        setError('Network Error');
      }
    };

    fetchFlashcards();
  }, [wordSetId]);

  if (error) {
    return <SafeAreaView><Text>{error}</Text></SafeAreaView>;
  }

  return (
    <SafeAreaView>
      <FlatList
        data={flashcards}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Text>{item.english_word} - {item.thai_word} - {item.pronunciation}</Text>
        )}
      />
    </SafeAreaView>
  );
};

// Tests
describe('FlashcardScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('fetches and displays flashcards', async () => {
    const mockFlashcards = [
      { english_word: 'Hello', thai_word: 'สวัสดี', pronunciation: 'sa-wat-dee' },
      { english_word: 'Thank you', thai_word: 'ขอบคุณ', pronunciation: 'khob khun' }
    ];

    axios.get.mockResolvedValueOnce({ data: mockFlashcards });

    const { getByText } = render(<FlashcardScreen wordSetId={1} />);

    await waitFor(() => {
      expect(getByText('Hello - สวัสดี - sa-wat-dee')).toBeTruthy();
      expect(getByText('Thank you - ขอบคุณ - khob khun')).toBeTruthy();
    });
  });

  test('displays error message on failed fetch', async () => {
    const errorMessage = 'Network Error';
    axios.get.mockRejectedValueOnce(new Error(errorMessage));

    const { getByText } = render(<FlashcardScreen wordSetId={1} />);

    await waitFor(() => {
      expect(getByText('Network Error')).toBeTruthy();
    });
  });
});