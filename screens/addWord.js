import React, { useRef, useState } from "react";
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

export default function AddWord(props) {
  const navigation = props.navigation;
  const { user_id, username, email, categoryName, wordSetId, wordSetName, img, type } = props.route.params
  const thaiInputRef = useRef(null);
  const pronuciationInputRef = useRef(null);
  const urlInputRef = useRef(null);
  const [values, setValues] = useState({
    wordSetId: wordSetId,
    english_word: '',
    thai_word: '',
    pronunciation: '',
    image_url: ''
  });
  const [errors, setErrors] = useState({});
  const [fontsLoaded] = useFonts({
    Dangrek_400Regular,
  });

  const handleInput = (name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
  };

  const handleAddWord = (event) => {
    const err = validation(values);
      setErrors(err);
      if(err.english_word === "" && err.thai_word === "" && err.pronunciation === "") {
        axios.post('https://exciting-monster-living.ngrok-free.app/addWord', { values })
        .then(async (res) => {
          if(res.data.status === "Success") {
            console.log('data', res.data)
            navigation.navigate("WordDict", { user_id, username, email, categoryName, wordSetId, wordSetName, img, type });
          } else {
            console.log('values', values)
            setErrors(prev => ({ ...prev, english_word: "This word is existed" }));
          }
        })
        .catch(err => {
          console.log("Axios error:", err);
        });
      }
    };

  if (!fontsLoaded) {
    return <Text>Font Loading...</Text>;
  }
  return (
    <SafeAreaView className="flex-1 bg-[#397CE1]">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View className="flex-row px-4 mb-5 items-center justify-center">
              <TouchableOpacity 
                onPress={() => navigation.goBack()} 
                className="ml-5 absolute left-0 bg-white rounded-full p-3 shadow"
              >
                <ChevronLeftIcon size={23} stroke={50} color="#434343" />
              </TouchableOpacity>
              <Text className="font-[dangrek] text-white pt-8 text-4xl">Add Set</Text>
            </View>
            <View className="flex-1 bg-[#CCE0FF] items-center pt-8">
              <Text className="font-[dangrek] text-3xl items-center justify-center pt-4">Category Name</Text>
              <View className="bg-[#CCCCCC] w-80 py-3 mb-3 rounded-xl items-center">
                <TextInput
                  name="categoryName"
                  style={styles.fixText}
                  placeholder="category name..."
                  placeholderTextColor="rgba(0,0,0,0.5)"
                  returnKeyType="go"
                  keyboardType="text"
                  autoCapitalize="words"
                  autoCorrect={false}
                  value={categoryName}
                  editable="false"
                  />
              </View>
              <Text className="font-[dangrek] text-3xl items-center justify-center pt-4">Set Name</Text>
              <View className="bg-[#CCCCCC] w-80 py-3 mb-3 rounded-xl items-center">
                <TextInput
                  name="wordSetName"
                  style={styles.fixText}
                  placeholder="set name..."
                  placeholderTextColor="rgba(0,0,0,0.5)"
                  returnKeyType="go"
                  keyboardType="text"
                  autoCapitalize="words"
                  autoCorrect={false}
                  value={wordSetName}
                  editable="false"
                  />
              </View>
              <Text className="font-[dangrek] text-3xl items-center justify-center pt-4">English Word</Text>
              <View className="bg-white w-80 py-3 rounded-xl mb-3 items-center">
                <TextInput
                  name="englishWord"
                  style={styles.inputText}
                  placeholder="English word..."
                  placeholderTextColor="rgba(0,0,0,0.5)"
                  returnKeyType="next"
                  keyboardType="text"
                  autoCapitalize="words"
                  autoCorrect={false}
                  value={values.english_word}
                  onChangeText={(text) => handleInput('english_word', text)}
                  onSubmitEditing={() => thaiInputRef.current.focus()}
                  />
              </View>
              {errors.english_word && <Text style={styles.text}>{errors.english_word}</Text>}
              <Text className="font-[dangrek] text-3xl items-center justify-center pt-4">Thai Word</Text>
              <View className="bg-white w-80 py-3 mb-3 rounded-xl items-center">
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
                  ref={thaiInputRef}
                  onSubmitEditing={() => pronuciationInputRef.current.focus()}
                  />
              </View>
              {errors.thai_word && <Text style={styles.text}>{errors.thai_word}</Text>}
              <Text className="font-[dangrek] text-3xl items-center justify-center pt-4">Pronunciation</Text>
              <View className="bg-white w-80 py-3 mb-3 first-line:rounded-xl items-center">
                <TextInput
                  name="pronunciation"
                  style={styles.inputText}
                  placeholder="pronunciation..."
                  placeholderTextColor="rgba(0,0,0,0.5)"
                  returnKeyType="next"
                  keyboardType="text"
                  autoCapitalize="words"
                  autoCorrect={false}
                  value={values.pronunciation}
                  onChangeText={(text) => handleInput('pronunciation', text)}
                  ref={pronuciationInputRef}
                  onSubmitEditing={() => urlInputRef.current.focus()}
                  />
              </View>
              {errors.pronunciation && <Text style={styles.text}>{errors.pronunciation}</Text>}
              <Text className="font-[dangrek] text-3xl items-center justify-center pt-4">Image</Text>
              <View className="flex-row bg-white w-80 py-3 rounded-xl justify-center items-center">
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
                  ref={urlInputRef}
                  />
                <TouchableOpacity className="absolute right-0 mr-5">
                  <ArrowUpTrayIcon size={30} color={'#8D8D8D'} />
                </TouchableOpacity>
              </View>
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
    fontFamily: "Dangrek",
    fontSize: "25",
    textAlign: "center",
    color: "#000000"
  },
  fixText: {
    fontFamily: "Dangrek",
    fontSize: "25",
    textAlign: "center",
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


AppRegistry.registerComponent("AddWord", () => AddWord);