import React, { useEffect, useState, useRef } from "react";
import {
  AppRegistry,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  Animated,
} from "react-native";
import { Dangrek_400Regular } from "@expo-google-fonts/dangrek";
import { useFonts } from "expo-font";
import axios from 'axios';
import { ChevronLeftIcon } from 'react-native-heroicons/solid';

export default function FlashcardAdmin(props) {
  const navigation = props.navigation;
  const { categoryName, wordSetName, flashcardId } = props.route.params;
  const [flashcard, setFlashcard] = useState([]);
  const flipAnimation = useRef(new Animated.Value(0)).current;
  const [flipped, setFlipped] = useState(false);
  const [fontsLoaded] = useFonts({
    Dangrek_400Regular,
  });

  useEffect(() => {
    const fetchFlashcard = async () => {
        try {
            const response = await axios.get(`https://exciting-monster-living.ngrok-free.app/findcard/${flashcardId}`);
            setFlashcard(response.data);
            console.log(flashcard)
        } catch (error) {
            console.error(error);
        }
    };

    fetchFlashcard();
  }, [flashcardId]);

  const card = flashcard[0]

  const handleFlip = () => {
    Animated.timing(flipAnimation, {
      duration: 300,
      toValue: flipped ? 0 : 180,
      useNativeDriver: true,
    }).start();
    setFlipped(!flipped);
  };

  const interpolateFront = flipAnimation.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });

  const interpolateBack = flipAnimation.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });

  const handleDelete = async (id) => {
    try {
        await axios.post('https://exciting-monster-living.ngrok-free.app/wordDelete', { id });
        // Assuming successful deletion, update the state or refetch data
        navigation.goBack()
    } catch (error) {
      console.error('Error deleting word:', error);
      // Handle error state or alert user
    }
  };

  if (!fontsLoaded) {
    return <Text>Font Loading...</Text>;
  }

  return (
      <SafeAreaView className="flex-1 bg-[#397CE1]">
        <View className="flex-row px-4 items-center justify-center">
          <TouchableOpacity onPress={() => navigation.goBack()} 
            className="ml-5 absolute left-0 bg-white rounded-full p-3 shadow">
            <ChevronLeftIcon size={23} stroke={50} color="#434343" />
          </TouchableOpacity>
          <Text className="font-[dangrek] text-white pt-8 text-4xl">
            {categoryName}
          </Text>
        </View>
        <View className="items-center justify-center px-4 mb-5 mt-[-2vw]">
          <Text className="font-[dangrek] text-white text-lg">
              {wordSetName}
          </Text>
        </View>
        <View className="flex-0 bg-[#CCE0FF] items-center pt-10">
          <View className="w-80 h-[132vw] relative mb-10">
            <TouchableOpacity onPress={handleFlip} style={styles.card}>
              <Animated.View
                style={[
                  { transform: [{ rotateY: interpolateFront }] },
                  styles.card,
                  flipped ? styles.hidden : null
                ]}>
                <View className="bg-white w-[100%] h-[100%] mb-10 justify-center items-center shadow-sm rounded-xl">
                  <Text className="font-[dangrek] text-5xl pt-5">{card.english_word}</Text>
                </View>
              </Animated.View>
              <Animated.View
                style={[
                  { transform: [{ rotateY: interpolateBack }] },
                  styles.card,
                  !flipped ? styles.hidden : null
                ]}>
                <View className="bg-white w-80 h-[132vw] mb-10 justify-center items-center shadow-sm rounded-xl">
                  <Text className="text-5xl pt-3 mb-5">{card.thai_word}</Text>
                  <Text className="text-5xl">{card.pronunciation}</Text>
                </View>
              </Animated.View>
            </TouchableOpacity>
          </View>
          <View className="flex-row justify-between mb-12">
            <TouchableOpacity onPress={() => {handleDelete(flashcardId)}} className="bg-red-600 w-80 py-3 rounded-xl items-center">
              <Text className="font-[dangrek] text-white pt-4 text-3xl">Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  hidden: {
    opacity: 0,
  },
  card: {
    backfaceVisibility: 'hidden',
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 10,
  }
});

AppRegistry.registerComponent("FlashcardAdmin", () => FlashcardAdmin);