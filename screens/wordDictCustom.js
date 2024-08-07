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
import { XMarkIcon, PencilIcon, XCircleIcon, ChevronLeftIcon } from 'react-native-heroicons/solid';
import SearchInput, { createFilter } from 'react-native-search-filter';
import { useFocusEffect } from '@react-navigation/native';

export default function WordDictCustom(props) {
  const navigation = props.navigation;
  const { user_id, username, email, userSetId, userSetName, img } = props.route.params;
  const [flashcards, setFlashcards] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editMode, setEditMode] = useState(false);
  const filteredFlashcards = flashcards.filter(createFilter(searchTerm, 'english_word'));
  const [fontsLoaded] = useFonts({
    Dangrek_400Regular,
  });

  
  useFocusEffect(
    useCallback(() => {
    const fetchFlashcards = async () => {
      try {
        const response = await axios.get(`https://exciting-monster-living.ngrok-free.app/userFlashcards/${userSetId}`);
        setFlashcards(response.data);
      } catch (error) {
        console.error(error);
      }
    };

      fetchFlashcards();
    }, [userSetId])
  );
  
  const handleEdit = () => {
    setEditMode(prevMode => !prevMode);
  };

  const handleDelete = async (id) => {
    try {
        await axios.post('https://exciting-monster-living.ngrok-free.app/wordDeleteCustom', { id });
        const updatedFlashcards = flashcards.filter(card => card.id !== id);
        setFlashcards(updatedFlashcards);
    } catch (error) {
      console.error('Error deleting word:', error);
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
                    {editMode ? (
                      <TouchableOpacity onPress={handleEdit} 
                      className="absolute right-0 mr-5 p-3">
                        <XMarkIcon size={35} color="#fff" />
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity onPress={handleEdit} 
                      className="absolute right-0 mr-5 p-3">
                        <PencilIcon size={25} color="#fff" />
                      </TouchableOpacity>
                    )}
                    <Text className="font-[dangrek] text-white pt-8 text-4xl">
                    {userSetName}
                    </Text>
                </View>
            <View className="flex-1 bg-[#CCE0FF] items-center pt-8">
                <SearchInput 
                onChangeText={(term) => setSearchTerm(term)}
                placeholder="Search card..."
                autoCapitalize="none"
                style={{ width: '80%', height: 50, marginBottom: 20, paddingLeft: 10, borderRadius: '12px', fontFamily: 'Dangrek', fontSize: 20 }}
                inputViewStyles={{ backgroundColor: 'white', width: '80%', height: 50, marginBottom: 20, paddingLeft: 20, borderRadius: '12px', fontFamily: 'Dangrek', fontSize: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.10, shadowRadius: 3.84, elevation: 5 }}
                inputStyles={{ fontFamily: 'Dangrek', fontSize: 20 }}
                />
                <TouchableOpacity 
                  onPress={() => navigation.navigate("AddWordCustom", { user_id, username, email, userSetId, userSetName, img })}
                  className="flex-row bg-[#397CE1] w-[80vw] rounded-xl shadow-sm items-center justify-center h-12 mb-5">
                  <Text className="font-[dangrek] text-xl text-white pt-2">Add more word</Text>
                </TouchableOpacity>
                {filteredFlashcards.map((item, index) => (
                    <TouchableOpacity 
                        key={index}
                        onPress={() => {
                          if (!editMode) {
                            navigation.navigate('FlashcardPlayer', 
                              { userSetName: userSetName, 
                                flashcardId: item.id });
                          }
                        }}
                        className="bg-white w-[80vw] h-16 justify-center mb-5 shadow-sm rounded-xl">
                        <Text className="font-[dangrek] text-4xl pt-6 pl-6">{item.english_word}</Text>
                        {editMode && (
                            <TouchableOpacity onPress={() => handleDelete(item.id)} className="absolute right-0 mr-6">
                                <XCircleIcon size={36} color={'red'}/>
                            </TouchableOpacity>
                        )}
                    </TouchableOpacity>
                ))}
                    
            </View>
        </ScrollView>
        <View className="bg-[#CCE0FF] flex-row justify-center items-center pb-5">
        <TouchableOpacity onPress={() => navigation.navigate('FlashcardCustom', {
          user_id: user_id,
          username: username,
          email: email,
          userSetId: userSetId,
          userSetName: userSetName,
          img: img})} 
          className="bg-[#397CE1] w-[30vw] py-3 rounded-xl items-center">
          <Text className="font-[dangrek] text-white pt-4 text-3xl">Learn</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}


AppRegistry.registerComponent("WordDictCustom", () => WordDictCustom);