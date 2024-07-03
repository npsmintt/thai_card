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
import validation from "../validations/addCategoryValidation";

export default function AddCategory(props) {
  const navigation = props.navigation;
  const { user_id, username, email, img, password, type } = props.route.params
  const [ newCategoryName, setNewCategoryName ] = useState('')
  const [errors, setErrors] = useState({});
  const [fontsLoaded] = useFonts({
    Dangrek_400Regular,
  });

  const handleAddCategory = (event) => {
    const err = validation(newCategoryName);
      setErrors(err);
      if(err.categoryName === "") {
        console.log(newCategoryName)
        axios.post('https://exciting-monster-living.ngrok-free.app/addCategory', { newCategoryName })
        .then(async (res) => {
          if(res.data.status === "Success") {
            console.log('data', res.data)
            navigation.navigate("TopicSelect", { user_id, username, email, img, password, type });
          } else {
            setErrors(prev => ({ ...prev, categoryName: "This category is existed" }));
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
              <Text className="font-[dangrek] text-white pt-8 text-4xl">Add Category</Text>
            </View>
            <View className="flex-1 bg-[#CCE0FF] items-center pt-8">
              <Text className="font-[dangrek] text-3xl items-center justify-center pt-4">Category Name</Text>
              <View className="bg-white w-80 py-3 rounded-xl items-center">
                <TextInput
                  name="categoryName"
                  style={styles.inputText}
                  placeholder="category name..."
                  placeholderTextColor="rgba(0,0,0,0.5)"
                  returnKeyType="go"
                  keyboardType="text"
                  autoCapitalize="words"
                  autoCorrect={false}
                  value={newCategoryName}
                  onChangeText={(text) => setNewCategoryName(text)}
                  />
              </View>
              {errors.categoryName && <Text style={styles.text}>{errors.categoryName}</Text>}
              <View className="justify-between mb-12">
                <TouchableOpacity onPress={handleAddCategory} className="bg-[#3EC928] w-80 py-3 mt-5 rounded-xl items-center">
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
  text: {
    marginTop: 5,
    fontSize: "16",
    fontFamily: "dangrek",
    textAlign: "center",
    color: "red",
  }
});


AppRegistry.registerComponent("AddCategory", () => AddCategory);