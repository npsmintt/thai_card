import React, { useState } from "react";
import {
  AppRegistry,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Text,
  View,
  StyleSheet,
  TextInput,
} from "react-native";
import { Dangrek_400Regular } from "@expo-google-fonts/dangrek";
import { useFonts } from "expo-font";
import axios from 'axios';
import { ArrowUpTrayIcon, ChevronLeftIcon } from 'react-native-heroicons/solid';
import validation from "../validations/addWordValidation";
import * as Speech from 'expo-speech';

export default function AddWordCustom(props) {
  const navigation = props.navigation;
  const { user_id, username, email, userSetId, userSetName, img, type } = props.route.params
  const [values, setValues] = useState({
    userSetId: userSetId,
    english_word: '',
    thai_word: '',
    pronunciation: '',
    image_url: ''
  });
  const [errors, setErrors] = useState({});
  const [fontsLoaded] = useFonts({
    Dangrek_400Regular,
  });

  const handleGenerate = (event) => {
    if (values.english_word) {
      axios.post('https://exciting-monster-living.ngrok-free.app/translate', { english_word: values.english_word })
        .then(response => {
          setValues(prev => ({
            ...prev,
            thai_word: response.data.thai_word,
            pronunciation: response.data.pronunciation
          }));
        })
        .catch(error => {
          console.error("Translation error:", error);
        });
    }
  }

  const handlePronounce = (event) => {
    if (values.thai_word) {
      axios.post('https://exciting-monster-living.ngrok-free.app/pronounce', { thai_word: values.thai_word })
        .then(response => {
          setValues(prev => ({
            ...prev,
            pronunciation: response.data.pronunciation
          }));
          speakThai(values.thai_word)
        })
        .catch(error => {
          console.error("Error making request:", error);
        });
    }
  }

  const handleInput = (name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
  };

  const speakThai = (text) => {
    Speech.speak(text, { 
      language: 'th-TH',
      voice: 'com.apple.ttsbundle.Kanya-premium',
    });
  };

  const handleAddWord = (event) => {
    const err = validation(values);
      setErrors(err);
      if (err.english_word === "" && err.thai_word === "" && err.pronunciation === "") {
        axios.post('https://exciting-monster-living.ngrok-free.app/addWordCustom', { values })
          .then(async (res) => {
            if (res.data.status === "Success") {
              console.log('data', res.data)
              navigation.navigate("WordDictCustom", { user_id, username, email, userSetId, userSetName, img, type });
            } else {
              setErrors(prev => ({ ...prev, limit: res.data.status }));
              // console.log('limit error', errors.limit)
            }
        })
        .catch(err => {
          console.log('limit error', errors.limit)
          console.log("Axios error:", err);
        });
      }
    };

  if (!fontsLoaded) {
    return <Text>Font Loading...</Text>;
  }
  return (
    <SafeAreaView className="flex-1 bg-[#397CE1]">
      <View className="flex-row px-4 mb-5 items-center justify-center">
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          className="ml-5 absolute left-0 bg-white rounded-full p-3 shadow"
        >
          <ChevronLeftIcon size={23} stroke={50} color="#434343" />
        </TouchableOpacity>
        <Text className="font-[dangrek] text-white pt-8 text-4xl">Add Card</Text>
      </View>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View className="flex-1 bg-[#CCE0FF] items-center pt-8">
        <Text className="font-[dangrek] text-3xl items-center justify-center pt-4">Set Name</Text>
        <View className="bg-[#CCCCCC] w-80 py-3 mb-3 rounded-xl">
          <TextInput
            name="userSetName"
            style={styles.fixText}
            placeholder="category name..."
            placeholderTextColor="rgba(0,0,0,0.5)"
            returnKeyType="go"
            keyboardType="text"
            autoCapitalize="words"
            autoCorrect={false}
            value={userSetName}
            editable="false"
            />
        </View>
        <Text className="font-[dangrek] text-3xl items-center justify-center pt-4">English Word</Text>
        <View className="bg-white w-80 py-3 rounded-xl mb-3 justify-center">
          <TextInput
            name="englishWord"
            style={styles.inputText}
            placeholder="English word..."
            placeholderTextColor="rgba(0,0,0,0.5)"
            returnKeyType="go"
            keyboardType="text"
            autoCapitalize="none"
            autoCorrect={false}
            value={values.english_word}
            onChangeText={(text) => handleInput('english_word', text)}
            />
            <TouchableOpacity 
              onPress={handleGenerate}
              className="absolute bg-[#397CE1] w-20 py-2 mb-3 right-0 mr-3 rounded-xl justify-center items-center"
            >
              <Text className="font-[dangrek] text-white pt-2 text-base items-center justify-center">Translate</Text>
            </TouchableOpacity>
        </View>
        {errors.english_word && <Text style={styles.text}>{errors.english_word}</Text>}
        <Text className="font-[dangrek] text-3xl items-center justify-center pt-4">Thai Word</Text>
        <View className="bg-white w-80 py-3 mb-3 rounded-xl justify-center">
          <TextInput
            name="thaiWord"
            style={styles.inputText}
            placeholder="Thai word..."
            placeholderTextColor="rgba(0,0,0,0.5)"
            returnKeyType="next"
            keyboardType="text"
            autoCapitalize="words"
            autoCorrect={false}
            value={values.thai_word}
            onChangeText={(text) => handleInput('thai_word', text)}
            />
            <TouchableOpacity 
              onPress={handlePronounce}
              className="absolute bg-[#397CE1] w-20 py-2 mb-3 right-0 mr-3 rounded-xl justify-center items-center"
            >
              <Text className="font-[dangrek] text-white pt-2 text-base items-center justify-center">pronounce</Text>
            </TouchableOpacity>
        </View>
        {errors.thai_word && <Text style={styles.text}>{errors.thai_word}</Text>}
        <Text className="font-[dangrek] text-3xl items-center justify-center pt-4">Pronunciation</Text>
        <View className="bg-white w-80 py-3 mb-3 rounded-xl justify-center">
          <TextInput
            name="pronunciation"
            style={styles.pronunciationText}
            placeholder="pronunciation..."
            placeholderTextColor="rgba(0,0,0,0.5)"
            returnKeyType="next"
            keyboardType="text"
            autoCapitalize="words"
            autoCorrect={false}
            value={values.pronunciation}
            onChangeText={(text) => handleInput('pronunciation', text)}
            />
        </View>
        {errors.pronunciation && <Text style={styles.text}>{errors.pronunciation}</Text>}
        {/* <Text className="font-[dangrek] text-3xl items-center justify-center pt-4">Image</Text>
        <View className="bg-white w-80 py-3 mb-3 rounded-xl justify-center">
          <TextInput
            name="imgUrl"
            style={styles.inputText}
            placeholder="upload image"
            placeholderTextColor="rgba(0,0,0,0.5)"
            returnKeyType="go"
            keyboardType="text"
            autoCapitalize="words"
            autoCorrect={false}
            value={values.image_url}
            onChangeText={(text) => handleInput('image_url', text)}
            />
          <TouchableOpacity className="absolute bg-[#397CE1] w-20 py-2 mb-3 right-0 mr-3 rounded-xl justify-center items-center">
            <ArrowUpTrayIcon size={30} color={'#fff'} className="items-center justify-center"/>
          </TouchableOpacity>
        </View> */}
        {errors.limit && <Text style={styles.text}>{errors.limit}</Text>}
        <View className="justify-between mb-12">
          <TouchableOpacity onPress={handleAddWord} className="bg-[#3EC928] w-80 py-3 mt-5 rounded-xl items-center">
            <Text className="font-[dangrek] text-white pt-4 text-3xl">Add</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  inputText: {
    width: '60%',
    fontFamily: "Dangrek",
    fontSize: "25",
    marginLeft: 20,
    textAlign: "left",
    color: "#000000"
  },
  pronunciationText: {
    fontFamily: "Dangrek",
    fontSize: "25",
    marginLeft: 20,
    textAlign: "left",
    color: "#000000"
  },
  fixText: {
    fontFamily: "Dangrek",
    fontSize: "25",
    marginLeft: 20,
    textAlign: "left",
    color: "#8D8D8D"
  },
  text: {
    marginTop: -10,
    fontSize: "16",
    fontFamily: "dangrek",
    textAlign: "center",
    color: "red",
  }
});


AppRegistry.registerComponent("AddWordCustom", () => AddWordCustom);