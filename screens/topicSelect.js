import React, { useState, useCallback } from "react";
import {
  AppRegistry,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Dangrek_400Regular } from "@expo-google-fonts/dangrek";
import { useFonts } from "expo-font";
import axios from 'axios';
import { PlusIcon, Cog6ToothIcon } from 'react-native-heroicons/solid';

export default function TopicSelect(props) {
  const navigation = props.navigation;
  const { user_id, username: initialUsername, email, password, img: initialImg, type } = props.route.params;
  const [categories, setCategories] = useState([]);
  const [fontsLoaded] = useFonts({
    Dangrek_400Regular,
  });
  const [img, setImg] = useState(initialImg);
  const [username, setUsername] = useState(initialUsername)
  const imageSources = {
    'user-default.png': require('../assets/user-default.png'),
    'user1.png': require('../assets/user1.png'),
    'user2.png': require('../assets/user2.png'),
    'user3.png': require('../assets/user3.png'),
    'user4.png': require('../assets/user4.png'),
    'user5.png': require('../assets/user5.png'),
    'user6.png': require('../assets/user6.png'),
    'user7.png': require('../assets/user7.png'),
  }

  useFocusEffect(
    useCallback(() => {
      const fetchCategories = async () => {
        try {
          const response = await axios.get('https://exciting-monster-living.ngrok-free.app/categories');
          setCategories(response.data);
        } catch (error) {
          console.error('Error fetching categories:', error);
        }
      };

      const fetchUserData = async () => {
        try {
          const response = await axios.get(`https://exciting-monster-living.ngrok-free.app/getUser`, { params: { email } });
          setImg(response.data.img);
          setUsername(response.data.username);
        } catch (error) {
          console.log('email', email)
          console.error('Error fetching user data:', error);
        }
      };

      fetchCategories();
      fetchUserData();

    }, []) 
  );

  if (!fontsLoaded) {
    return <Text>Font Loading...</Text>;
  }
  return (
    <SafeAreaView className="flex-1 bg-[#397CE1]">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View className="h-20 px-4 mb-12 justfy-center items-center">
        {img ? (
          <Image source={imageSources[img]} className="w-20 h-20 mb-2"/>
        ) : (
        <Image source={require('../assets/user-blank.png')} className="w-20 h-20 mb-2"/>
        )}
        <Text className="font-[dangrek] text-white text-xl">
          {`Hello, ${username}`}
        </Text>
        <TouchableOpacity 
          onPress={()=> navigation.navigate('User', {user_id: user_id, username: username, email: email, password: password})} 
          className="absolute right-0 pr-5 pt-8 shadow-sm"
        >
          <Cog6ToothIcon size="50" color="#fff"/>
        </TouchableOpacity>
      </View>
      <View className="flex-1 bg-[#CCE0FF] items-center pt-8">
        <Text className="mb-5 font-[dangrek] text-3xl pt-1 text-white text-center shadow-sm">Please select the topic</Text>
        {categories.map(item => (
            <TouchableOpacity 
              key={item.id}
              onPress={() => navigation.navigate('SetSelect', { user_id: user_id, username: username, email: email, password: password, categoryId: item.id, categoryName: item.name, img: img, type: type })} 
              className="bg-white w-[80vw] h-32 mb-5 justify-center items-center shadow-sm rounded-xl">
              <Text className="font-[dangrek] text-4xl mt-4 p-10">{item.name}</Text>
            </TouchableOpacity>
          ))}
      </View>
      </ScrollView>
      {type === 'admin' && (
        <TouchableOpacity
          onPress={() => navigation.navigate("AddCategory", { user_id, username, email, password, type })}
          className="absolute right-0 bottom-0 mr-7 p-5 bg-[#397CE1] rounded-full mb-10"
        >
          <PlusIcon size={30} color={'white'} />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}


AppRegistry.registerComponent("TopicSelect", () => TopicSelect);