import React, { useState } from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { View, Text, Button } from 'react-native';
import axios from 'axios';

// Mocking axios
jest.mock('axios');

const PlainScreen = () => {
  const [userSets, setUserSets] = useState([
    { id: 1, name: 'Set 1' },
    { id: 2, name: 'Set 2' },
  ]);
  const [editMode, setEditMode] = useState(true);

  const handleDelete = async (id) => {
    try {
      // Simulating deletion logic
      await axios.post('https://exciting-monster-living.ngrok-free.app/setDeleteCustom', { id });
      const updatedSets = userSets.filter(set => set.id !== id);
      setUserSets(updatedSets);
    } catch (error) {
      console.error('Error deleting set:', error);
    }
  };

  return (
    <View>
      {userSets.map(set => (
        <View key={set.id} testID={`set-${set.id}`}>
          <Text>{set.name}</Text>
          {editMode && (
            <Button
              title="Delete"
              onPress={() => handleDelete(set.id)}
              testID={`delete-${set.id}`}
            />
          )}
        </View>
      ))}
    </View>
  );
};

describe('PlainScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('deletes a set on button press', async () => {
    const { getByTestId, queryByTestId } = render(<PlainScreen />);
    const mockResponse = { status: 200 };

    axios.post.mockResolvedValueOnce(mockResponse);

    const deleteButton1 = getByTestId('delete-1');
    fireEvent.press(deleteButton1);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('https://exciting-monster-living.ngrok-free.app/setDeleteCustom', { id: 1 });
      expect(queryByTestId('set-1')).toBeNull();
    });
  });

  test('handles error on delete failure', async () => {
    const { getByTestId, queryByTestId } = render(<PlainScreen />);
    const mockError = new Error('Network error');

    axios.post.mockRejectedValueOnce(mockError);

    const deleteButton1 = getByTestId('delete-1');
    fireEvent.press(deleteButton1);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('https://exciting-monster-living.ngrok-free.app/setDeleteCustom', { id: 1 });
      // The set should still exist in case of an error
      expect(queryByTestId('set-1')).toBeTruthy();
    });
  });
});