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
import { EllipsisHorizontalIcon, PencilIcon, PlusIcon, XMarkIcon, XCircleIcon, Bars3Icon, Cog6ToothIcon } from 'react-native-heroicons/solid';

export default function TopicSelectCustom(props) {
  const navigation = props.navigation;
  const { user_id, username: initialUsername, email, password, img: initialImg, type } = props.route.params;
  const [userSets, setUserSets] = useState([]);
  const [fontsLoaded] = useFonts({
    Dangrek_400Regular,
  });
  const [img, setImg] = useState(initialImg);
  const [username, setUsername] = useState(initialUsername)
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isIconsVisible, setIsIconsVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
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
      const fetchUserData = async () => {
        try {
          const response = await axios.get('https://exciting-monster-living.ngrok-free.app/getUser', { params: { email } });
          setImg(response.data.img);
          setUsername(response.data.username);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };
  
      const fetchUserSet = async () => {
        try {
          const response = await axios.get('https://exciting-monster-living.ngrok-free.app/userSets', { params: { user_id } });
          setUserSets(response.data);
        } catch (error) {
          console.error('Error fetching user sets:', error);
        }
      };
  
      fetchUserData();
      fetchUserSet();
    }, [email, user_id])
  );

  const handleDelete = async (id) => {
    try {
        await axios.post('https://exciting-monster-living.ngrok-free.app/setDeleteCustom', { id });
        const updatedsets = userSets.filter(card => card.id !== id);
        setUserSets(updatedsets);
    } catch (error) {
      console.error('Error deleting word:', error);
    }
  };

  const handleAddNavigate = () => {
    setIsIconsVisible(!isIconsVisible);
    setEditMode(false);
    navigation.navigate("AddUserSet", { user_id, username, email, img, password, type })
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleIcons = () => {
    setIsIconsVisible(!isIconsVisible);
  };

  const handleEdit = () => {
    setEditMode(prevMode => !prevMode);
    setIsIconsVisible(false);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
  }

  const SideMenu = () => (
    <View className="w-full h-auto bg-[#397CE1] items-center">
      <TouchableOpacity onPress={() => navigation.navigate('TopicSelect', {user_id: user_id, username: username, email: email, password: password, img: img, type: type})}>
        <Text className="font-[dangrek] text-white text-2xl my-3 pt-3">Challenge Mode</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={toggleMenu} className="bg-white w-full items-center">
        <Text className="font-[dangrek] text-[#397CE1] text-2xl my-3 pt-3">Custom Mode</Text>
      </TouchableOpacity>
    </View>
  );

  if (!fontsLoaded) {
    return <Text>Font Loading...</Text>;
  }
  return (
    <SafeAreaView className="flex-1 bg-[#397CE1]">
      <View className="h-20 px-4 mb-12 justfy-center items-center">
        {isMenuOpen ? ( 
        <TouchableOpacity
          onPress={toggleMenu}
          className="absolute left-0 pl-5 pt-8 shadow-sm">
          <XMarkIcon size={50} color={'white'}/>
        </TouchableOpacity>
         ) : (
        <TouchableOpacity
          onPress={toggleMenu}
          className="absolute left-0 pl-5 pt-8 shadow-sm">
          <Bars3Icon size={50} color={'white'}/>
        </TouchableOpacity>
        )}
        {img ? (
          <Image source={imageSources[img]} className="w-20 h-20 mb-2"/>
        ) : (
        <Image source={require('../assets/user-blank.png')} className="w-20 h-20 mb-2"/>
        )}
        <Text className="font-[dangrek] text-white text-xl">
          {`Hello, ${username}`}
        </Text>
        {!editMode ? (
          <TouchableOpacity 
          onPress={()=> navigation.navigate('User', {user_id: user_id, username: username, email: email, password: password})} 
          className="absolute right-0 pr-5 pt-8 shadow-sm"
        >
          <Cog6ToothIcon size="50" color="#fff"/>
        </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={handleCancelEdit} 
            className="absolute right-0 pr-5 pt-8 shadow-sm">
              <XMarkIcon size={50} color="#fff" />
          </TouchableOpacity>
        )}
      </View>
      {isMenuOpen && <SideMenu />}
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View className="flex-1 bg-[#CCE0FF] items-center pt-8">
      {userSets && userSets.length > 0 ? (
        <>
          <Text className="mb-5 font-[dangrek] text-3xl pt-1 text-white text-center shadow-sm">Custom Mode</Text>
          {userSets.map(item => (
            <TouchableOpacity 
              key={item.id}
              onPress={() => navigation.navigate('WordDictCustom', {user_id: user_id,
                username: username,
                email: email,
                userSetId: item.id,
                userSetName: item.name,
                img: img})} 
              className="bg-white w-[80vw] h-32 mb-5 justify-center items-center shadow-sm rounded-xl">
              <Text className="font-[dangrek] text-4xl mt-4 p-10">{item.name}</Text>
              {editMode && (
                <TouchableOpacity onPress={() => handleDelete(item.id)} className="absolute right-0 mr-6">
                    <XCircleIcon size={36} color={'red'}/>
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          ))}
        </>
      ) : (
        <View className="justify-center items-center flex-1 mt-[-20vw]">
          <Text className="font-[dangrek] text-white shadow-sm text-2xl pt-2">No set available</Text>
          <Text className="font-[dangrek] text-white shadow-sm text-2xl pt-2">Please add your vocabulary set</Text>
        </View>
      )}
      </View>
      </ScrollView>
      {!isIconsVisible ? (
        <TouchableOpacity
          onPress={toggleIcons} // Toggle icons on EllipsisHorizontalIcon press
          className="absolute right-0 bottom-0 mr-7 p-5 bg-[#397CE1] rounded-full mb-10"
        >
          <EllipsisHorizontalIcon size={30} color={'white'} />
        </TouchableOpacity>
      ) : (
        <>
          <TouchableOpacity
            onPress={toggleIcons} // Toggle icons on XMarkIcon press
            className="absolute right-0 bottom-0 mr-7 p-5 bg-white rounded-full mb-10 shadow-lg"
          >
            <XMarkIcon size={30} color={'#397CE1'} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleAddNavigate}
            className="absolute right-0 bottom-0 mr-7 p-5 bg-[#397CE1] rounded-full mb-[30vw] shadow-lg"
          >
            <PlusIcon size={30} color={'white'} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleEdit}
            className="absolute right-0 bottom-0 mr-7 p-5 bg-[#397CE1] rounded-full mb-[50vw] shadow-lg"
          >
            <PencilIcon size={30} color={'white'} />
          </TouchableOpacity>
        </>
      )}
    </SafeAreaView>
  );
}


AppRegistry.registerComponent("TopicSelectCustom", () => TopicSelectCustom);