import React from 'react';
import {
  SafeAreaView,
  TouchableOpacity,
  Text,
} from "react-native";
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import axios from 'axios'; // Import Axios for mocking

// Mock Axios
jest.mock('axios');

// Example functional component with a delete button
const DeleteButtonScreen = () => {
  const handleDelete = async () => {
    try {
      const id = 1; // Example ID to delete
      await axios.post('https://exciting-monster-living.ngrok-free.app/wordDeleteCustom', { id });
      // Optionally update state or handle success message
    } catch (error) {
      console.error('Error deleting:', error);
      // Optionally handle error state or display error message
    }
  };

  return (
    <SafeAreaView>
      <TouchableOpacity onPress={handleDelete}>
        <Text>Delete</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

describe('DeleteButtonScreen', () => {
  test('delete button click', async () => {
    // Mock Axios response for delete action
    axios.post.mockResolvedValueOnce({ status: 200 });

    // Render the component
    const { getByText } = render(<DeleteButtonScreen />);

    // Simulate delete action
    fireEvent.press(getByText('Delete'));

    // Wait for Axios request to resolve (optional)
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('https://exciting-monster-living.ngrok-free.app/wordDeleteCustom', { id: 1 });
      // Optionally assert on state updates or success message
    });
  });
});