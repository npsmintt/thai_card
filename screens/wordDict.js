import React, { useEffect, useState, useCallback } from "react";
import {
  AppRegistry,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Text,
  View,
} from "react-native";
import { Dangrek_400Regular } from "@expo-google-fonts/dangrek";
import { useFonts } from "expo-font";
import axios from 'axios';
import { XCircleIcon, ChevronLeftIcon } from 'react-native-heroicons/solid';
import SearchInput, { createFilter } from 'react-native-search-filter';

export default function WordDict(props) {
  const navigation = props.navigation;
  const { user_id, username, email, categoryName, wordSetId, wordSetName, img, type } = props.route.params;
  const [flashcards, setFlashcards] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const filteredFlashcards = flashcards.filter(createFilter(searchTerm, 'english_word'));
  const [fontsLoaded] = useFonts({
    Dangrek_400Regular,
  });

  useEffect(() => {
    const fetchFlashcards = async () => {
        try {
            const response = await axios.get(`https://exciting-monster-living.ngrok-free.app/flashcards/${wordSetId}`);
            setFlashcards(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    fetchFlashcards();
  }, [wordSetId]);

  const handleDelete = async (id) => {
    try {
        await axios.post('https://exciting-monster-living.ngrok-free.app/wordDelete', { id });
        // Assuming successful deletion, update the state or refetch data
        const updatedFlashcards = flashcards.filter(card => card.id !== id);
        setFlashcards(updatedFlashcards);
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
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
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
            <View className="flex-1 bg-[#CCE0FF] items-center pt-8">
                <SearchInput 
                onChangeText={(term) => setSearchTerm(term)}
                placeholder="Search card..."
                style={{ width: '80%', height: 50, marginBottom: 20, paddingLeft: 10, borderRadius: '12px', fontFamily: 'Dangrek', fontSize: 20 }}
                inputViewStyles={{ backgroundColor: 'white', width: '80%', height: 50, marginBottom: 20, paddingLeft: 20, borderRadius: '12px', fontFamily: 'Dangrek', fontSize: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.10, shadowRadius: 3.84, elevation: 5 }}
                inputStyles={{ fontFamily: 'Dangrek', fontSize: 20 }}
                />
                {filteredFlashcards.map((item, index) => (
                    <TouchableOpacity 
                        key={index}
                        onPress={() => navigation.navigate('FlashcardAdmin', { user_id: user_id, username: username, email: email, categoryName: categoryName, img: img, type: type, flashcardId: item.id })} 
                        className="bg-white w-[80vw] h-16 justify-center mb-5 shadow-sm rounded-xl">
                        <Text className="font-[dangrek] text-4xl pt-6 pl-6">{item.english_word}</Text>
                        <TouchableOpacity onPress={handleDelete(item.id)} className="absolute right-0 mr-6">
                            <XCircleIcon size={36} color={'red'}/>
                        </TouchableOpacity>
                    </TouchableOpacity>
                ))}
                    
            </View>
        </ScrollView>
    </SafeAreaView>
  );
}


AppRegistry.registerComponent("WordDict", () => WordDict);