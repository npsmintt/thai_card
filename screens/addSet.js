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
import { ChevronLeftIcon } from 'react-native-heroicons/solid';
import validation from "../validations/addSetValidation";

export default function AddSet(props) {
  const navigation = props.navigation;
  const { user_id, username, email, password, categoryId, categoryName, img, type } = props.route.params
  const [ setName, setSetName ] = useState('')
  const [errors, setErrors] = useState({});
  const [fontsLoaded] = useFonts({
    Dangrek_400Regular,
  });

  const handleAddSet = (event) => {
    const err = validation(setName);
      setErrors(err);
      if(err.setName === "") {
        console.log(setName)
        axios.post('https://exciting-monster-living.ngrok-free.app/addSet', { categoryId, setName })
        .then(async (res) => {
          if(res.data.status === "Success") {
            console.log('data', res.data)
            navigation.navigate("SetSelect", { user_id, username, email, password, categoryId, categoryName, img, type });
          } else {
            setErrors(prev => ({ ...prev, setName: "This category is existed" }));
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
              <View className="bg-white w-80 py-3 rounded-xl items-center">
                <TextInput
                  name="setName"
                  style={styles.inputText}
                  placeholder="set name..."
                  placeholderTextColor="rgba(0,0,0,0.5)"
                  returnKeyType="go"
                  keyboardType="text"
                  autoCapitalize="words"
                  autoCorrect={false}
                  value={setName}
                  onChangeText={(text) => setSetName(text)}
                  />
              </View>
              {errors.setName && <Text style={styles.text}>{errors.setName}</Text>}
              <View className="justify-between mb-12">
                <TouchableOpacity onPress={handleAddSet} className="bg-[#3EC928] w-80 py-3 mt-5 rounded-xl items-center">
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
    fontSize: "16",
    fontFamily: "dangrek",
    textAlign: "center",
    color: "red",
  }
});


AppRegistry.registerComponent("AddSet", () => AddSet);