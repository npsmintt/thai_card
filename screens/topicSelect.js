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
import { EllipsisHorizontalIcon, XCircleIcon, PencilIcon, PlusIcon, Cog6ToothIcon, XMarkIcon, Bars3Icon } from 'react-native-heroicons/solid';

export default function TopicSelect(props) {
  const navigation = props.navigation;
  const { user_id, username: initialUsername, email, password, img: initialImg, type: initialType } = props.route.params;
  const [categories, setCategories] = useState([]);
  const [fontsLoaded] = useFonts({
    Dangrek_400Regular,
  });
  const [img, setImg] = useState(initialImg);
  const [type, setType] = useState(initialType)
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
          setType(response.data.type);
        } catch (error) {
          console.log('email', email)
          console.error('Error fetching user data:', error);
        }
      };

      fetchCategories();
      fetchUserData();

    }, []) 
  );

  const handleDelete = async (id) => {
    try {
        await axios.post('https://exciting-monster-living.ngrok-free.app/categoryDelete', { id });
        const updatedcategories = categories.filter(card => card.id !== id);
        setCategories(updatedcategories);
    } catch (error) {
      console.error('Error deleting word:', error);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleIcons = () => {
    setIsIconsVisible(!isIconsVisible);
  };

  const handleEdit = () => {
    setEditMode(prevMode => !prevMode);
    setIsIconsVisible(!isIconsVisible);
  };

  const handleCancelEdit = () => {
    setEditMode(prevMode => !prevMode);
  }

  const handlePress = () => {
    navigation.navigate('TopicSelectCustom', {
      user_id: user_id,
      username: username,
      email: email,
      password: password,
      img: img,
      type: type
    });
  
    toggleMenu();
  };

  const SideMenu = () => (
    <View className="w-full h-auto bg-[#397CE1] items-center">
      <TouchableOpacity onPress={toggleMenu} className="bg-white w-full items-center">
        <Text className="font-[dangrek] text-[#397CE1] text-2xl my-3 pt-3">Challenge Mode</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handlePress}>
        <Text className="font-[dangrek] text-white text-2xl my-3 pt-3">Custom Mode</Text>
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
        <Text className="mb-5 font-[dangrek] text-3xl pt-1 text-white text-center shadow-sm">Please select the topic</Text>
        {categories.map(item => (
            <TouchableOpacity 
              key={item.id}
              onPress={() => navigation.navigate('SetSelect', { user_id: user_id, username: username, email: email, password: password, categoryId: item.id, categoryName: item.name, img: img, type: type })} 
              className="bg-white w-[80vw] h-32 mb-5 justify-center items-center shadow-sm rounded-xl">
              <Text className="font-[dangrek] text-4xl mt-4 p-10">{item.name}</Text>
              {editMode && (
                <TouchableOpacity onPress={() => handleDelete(item.id)} className="absolute right-0 mr-6">
                    <XCircleIcon size={36} color={'red'}/>
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          ))}
      </View>
      </ScrollView>
      {type === 'admin' && (
        !isIconsVisible ? (
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
              onPress={() => navigation.navigate("AddCategory", { user_id, username, email, password, type })}
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
        )
      )}
    </SafeAreaView>
  );
}


AppRegistry.registerComponent("TopicSelect", () => TopicSelect);