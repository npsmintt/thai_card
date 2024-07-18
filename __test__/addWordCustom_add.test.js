import React, { useState } from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import axios from 'axios';
import {
  SafeAreaView,
  TextInput,
  Button,
  Text
} from 'react-native';

// Mock Axios
jest.mock('axios');

// Mock Navigation
const mockNavigate = jest.fn();
const mockProps = {
  navigation: { navigate: mockNavigate },
  route: {
    params: {
      user_id: 1,
      username: 'testuser',
      email: 'test@example.com',
      userSetId: 1,
      userSetName: 'Test Set',
      img: 'testimg.png',
      type: 'testtype'
    }
  }
};

// Component Definition
function AddWordCustom(props) {
  const navigation = props.navigation;
  const { user_id, username, email, userSetId, userSetName, img, type } = props.route.params;
  const [values, setValues] = useState({
    userSetId: userSetId,
    english_word: '',
    thai_word: '',
    pronunciation: '',
    image_url: ''
  });
  const [errors, setErrors] = useState({});

  const handleInput = (name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
  };

  const handleAddWord = async () => {
    const err = {}; // Add your validation logic here
    setErrors(err);
    if (!err.english_word && !err.thai_word && !err.pronunciation) {
      try {
        const res = await axios.post('https://exciting-monster-living.ngrok-free.app/addWordCustom', { values });
        if (res.data.status === "Success") {
          navigation.navigate("WordDictCustom", { user_id, username, email, userSetId, userSetName, img, type });
        } else {
          setErrors(prev => ({ ...prev, limit: res.data.status }));
        }
      } catch (err) {
        console.error("Axios error:", err);
      }
    }
  };

  return (
    <SafeAreaView>
      <TextInput
        placeholder="English Word"
        onChangeText={text => handleInput('english_word', text)}
        value={values.english_word}
      />
      <TextInput
        placeholder="Thai Word"
        onChangeText={text => handleInput('thai_word', text)}
        value={values.thai_word}
      />
      <TextInput
        placeholder="Pronunciation"
        onChangeText={text => handleInput('pronunciation', text)}
        value={values.pronunciation}
      />
      <Button title="Add Word" onPress={handleAddWord} />
      {errors.limit && <Text>{errors.limit}</Text>}
    </SafeAreaView>
  );
}

describe('AddWordCustom', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('submits the form and navigates on success', async () => {
    axios.post.mockResolvedValueOnce({ data: { status: 'Success' } });

    const { getByText, getByPlaceholderText } = render(<AddWordCustom {...mockProps} />);

    // Simulate user input
    fireEvent.changeText(getByPlaceholderText('English Word'), 'hi');
    fireEvent.changeText(getByPlaceholderText('Thai Word'), 'สวัสดี');
    fireEvent.changeText(getByPlaceholderText('Pronunciation'), 'sa-wat-dee');

    // Simulate form submission
    fireEvent.press(getByText('Add Word'));

    await waitFor(() => {
      // Check if axios was called with correct parameters
      expect(axios.post).toHaveBeenCalledWith('https://exciting-monster-living.ngrok-free.app/addWordCustom', {
        values: {
          userSetId: 1,
          english_word: 'hi',
          thai_word: 'สวัสดี',
          pronunciation: 'sa-wat-dee',
          image_url: ''
        }
      });

      // Check if navigation was called with correct parameters
      expect(mockNavigate).toHaveBeenCalledWith('WordDictCustom', {
        user_id: 1,
        username: 'testuser',
        email: 'test@example.com',
        userSetId: 1,
        userSetName: 'Test Set',
        img: 'testimg.png',
        type: 'testtype'
      });
    });
  });

  test('displays error message on failed submission', async () => {
    axios.post.mockResolvedValueOnce({ data: { status: 'Failed' } });

    const { getByText, getByPlaceholderText } = render(<AddWordCustom {...mockProps} />);

    // Simulate user input
    fireEvent.changeText(getByPlaceholderText('English Word'), 'hi');
    fireEvent.changeText(getByPlaceholderText('Thai Word'), 'สวัสดี');
    fireEvent.changeText(getByPlaceholderText('Pronunciation'), 'sa-wat-dee');

    // Simulate form submission
    fireEvent.press(getByText('Add Word'));

    await waitFor(() => {
      // Check if axios was called with correct parameters
      expect(axios.post).toHaveBeenCalledWith('https://exciting-monster-living.ngrok-free.app/addWordCustom', {
        values: {
          userSetId: 1,
          english_word: 'hi',
          thai_word: 'สวัสดี',
          pronunciation: 'sa-wat-dee',
          image_url: ''
        }
      });

      // Check if an error message was set (update this to match your component's actual error handling)
      expect(getByText('Failed')).toBeTruthy();
    });
  });
});