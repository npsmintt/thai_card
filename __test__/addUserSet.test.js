import React, { useState } from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import axios from 'axios';
import { Text, TextInput, Button, View } from 'react-native';

// Mocking axios
jest.mock('axios');

// Validation function for testing purposes
const validation = (newUserSetName) => {
  const errors = {};
  if (!newUserSetName) {
    errors.categoryName = 'Category name is required';
  } else {
    errors.categoryName = '';
  }
  return errors;
};

// Plain screen component
const PlainScreen = ({ navigation }) => {
  const [newUserSetName, setNewUserSetName] = useState('');
  const [errors, setErrors] = useState({});

  const handleAddSet = async () => {
    const err = validation(newUserSetName);
    setErrors(err);
    if (err.categoryName === '') {
      try {
        const response = await axios.post('https://exciting-monster-living.ngrok-free.app/addUserSet', { user_id: 1, newUserSetName });
        if (response.data.status === 'Success') {
          navigation.navigate('TopicSelectCustom');
        } else {
          setErrors({ categoryName: 'This set name is existed' });
        }
      } catch (error) {
        console.error('Axios error:', error);
      }
    }
  };

  return (
    <View>
      <Text>Add Set</Text>
      <TextInput
        placeholder="set name..."
        value={newUserSetName}
        onChangeText={setNewUserSetName}
        testID="setNameInput"
      />
      {errors.categoryName && <Text>{errors.categoryName}</Text>}
      <Button title="Add" onPress={handleAddSet} testID="addButton" />
    </View>
  );
};

describe('PlainScreen', () => {
  const mockNavigate = jest.fn();

  const mockProps = {
    navigation: {
      navigate: mockNavigate,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('shows validation error if set name is empty', async () => {
    const { getByText, getByTestId } = render(<PlainScreen {...mockProps} />);
    const button = getByTestId('addButton');
    
    fireEvent.press(button);

    await waitFor(() => {
      expect(getByText('Category name is required')).toBeTruthy();
    });
  });

  test('makes axios post request with correct data and navigates on success', async () => {
    const { getByText, getByPlaceholderText, getByTestId } = render(<PlainScreen {...mockProps} />);
    const input = getByPlaceholderText('set name...');
    const button = getByTestId('addButton');
    const mockResponse = { data: { status: 'Success' } };

    axios.post.mockResolvedValueOnce(mockResponse);

    fireEvent.changeText(input, 'New Set Name');
    fireEvent.press(button);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('https://exciting-monster-living.ngrok-free.app/addUserSet', {
        user_id: 1,
        newUserSetName: 'New Set Name'
      });
      expect(mockNavigate).toHaveBeenCalledWith('TopicSelectCustom');
    });
  });

  test('shows error message if set name already exists', async () => {
    const { getByText, getByPlaceholderText, getByTestId } = render(<PlainScreen {...mockProps} />);
    const input = getByPlaceholderText('set name...');
    const button = getByTestId('addButton');
    const mockResponse = { data: { status: 'Error' } };

    axios.post.mockResolvedValueOnce(mockResponse);

    fireEvent.changeText(input, 'Existing Set Name');
    fireEvent.press(button);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('https://exciting-monster-living.ngrok-free.app/addUserSet', {
        user_id: 1,
        newUserSetName: 'Existing Set Name'
      });
      expect(getByText('This set name is existed')).toBeTruthy();
    });
  });
});