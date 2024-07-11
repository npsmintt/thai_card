import React, { useState } from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import axios from 'axios';
import { View, Text, Button, TextInput, TouchableHighlight } from 'react-native';

// Mocking axios
jest.mock('axios');

const CheckEmailExistsScreen = () => {
  const [email, setEmail] = useState('');
  const [emailExists, setEmailExists] = useState(false);

  const checkEmailExists = async (email) => {
    try {
      const response = await axios.get('https://exciting-monster-living.ngrok-free.app/getUser', { params: { email } });
      if (response.data && response.data.email) {
        return true; 
      }
      return false; 
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return false;
      }
      console.log("Email check error:", error);
      return false;
    }
  };

  const handleSubmit = async () => {
    const emailExists = await checkEmailExists(email);
    setEmailExists(emailExists);
  };

  return (
    <View>
      <TextInput
        value={email}
        onChangeText={(text) => setEmail(text)}
        placeholder="Enter Email"
        placeholderTextColor="rgba(0,0,0,0.5)"
        returnKeyType="go"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        testID="email-input"
      />
      <TouchableHighlight onPress={handleSubmit} testID="submit-button">
        <Text>Submit</Text>
      </TouchableHighlight>
      {emailExists && <Text>Email exists!</Text>}
    </View>
  );
};

describe('CheckEmailExistsScreen', () => {
  test('checks if email exists', async () => {
    const { getByTestId, getByText } = render(<CheckEmailExistsScreen />);
    const mockResponse = { data: { email: 'test@example.com' } };

    axios.get.mockResolvedValueOnce(mockResponse);

    const emailInput = getByTestId('email-input');
    const submitButton = getByTestId('submit-button');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith('https://exciting-monster-living.ngrok-free.app/getUser', { params: { email: 'test@example.com' } });
      expect(getByText('Email exists!')).toBeTruthy();
    });
  });

  test('handles email not found', async () => {
    const { getByTestId, queryByText } = render(<CheckEmailExistsScreen />);
    const mockError = { response: { status: 404 } };

    axios.get.mockRejectedValueOnce(mockError);

    const emailInput = getByTestId('email-input');
    const submitButton = getByTestId('submit-button');

    fireEvent.changeText(emailInput, 'nonexistent@example.com');
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith('https://exciting-monster-living.ngrok-free.app/getUser', { params: { email: 'nonexistent@example.com' } });
      expect(queryByText('Email exists!')).toBeNull();
    });
  });
});