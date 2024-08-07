import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LogBox } from 'react-native';
import Login from '../screens/login';
import Register from '../screens/register';
import ForgetPassword from '../screens/forgetPassword';
import TopicSelect from '../screens/topicSelect';
import Flashcard from '../screens/flashcard';
import Game from '../screens/game';
import Leaderboard from '../screens/leaderboard';
import User from '../screens/user';
import PicSetting from '../screens/picSetting';
import SetSelect from '../screens/setSelect';
import WordDict from '../screens/wordDict';
import FlashcardAdmin from '../screens/flashcardAdmin';
import AddCategory from '../screens/addCategory';
import AddSet from '../screens/addSet';
import AddWord from '../screens/addWord';
import TopicSelectCustom from '../screens/topicSelectCustom';
import AddUserSet from '../screens/addUserSet';
import FlashcardCustom from '../screens/flashcardCustom';
import WordDictCustom from '../screens/wordDictCustom';
import AddWordCustom from '../screens/addWordCustom';
import FlashcardPlayer from '../screens/flashcardPlayer';
import GameCustom from '../screens/gameCustom';
import LeaderboardCustom from '../screens/leaderboardCustom';

const Stack = createNativeStackNavigator();

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

export default function AppNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login'>
        <Stack.Screen name="Login" options={{headerShown: false}} component={Login} />
        <Stack.Screen name="Register" options={{headerShown: false}} component={Register} />
        <Stack.Screen name="ForgetPassword" options={{headerShown: false}} component={ForgetPassword} />
        <Stack.Screen name="TopicSelect" options={{headerShown: false}} component={TopicSelect} />
        <Stack.Screen name="SetSelect" options={{headerShown: false}} component={SetSelect} />
        <Stack.Screen name="Flashcard" options={{headerShown: false}} component={Flashcard} />
        <Stack.Screen name="Game" options={{headerShown: false}} component={Game} />
        <Stack.Screen name="Leaderboard" options={{headerShown: false}} component={Leaderboard} />
        <Stack.Screen name="User" options={{headerShown: false}} component={User} />
        <Stack.Screen name="PicSetting" options={{headerShown: false}} component={PicSetting} />
        <Stack.Screen name="WordDict" options={{headerShown: false}} component={WordDict} />
        <Stack.Screen name="FlashcardAdmin" options={{headerShown: false}} component={FlashcardAdmin} />
        <Stack.Screen name="AddCategory" options={{headerShown: false}} component={AddCategory} />
        <Stack.Screen name="AddSet" options={{headerShown: false}} component={AddSet} />
        <Stack.Screen name="AddWord" options={{headerShown: false}} component={AddWord} />
        <Stack.Screen name="TopicSelectCustom" options={{headerShown: false}} component={TopicSelectCustom} />
        <Stack.Screen name="AddUserSet" options={{headerShown: false}} component={AddUserSet} />
        <Stack.Screen name="FlashcardCustom" options={{headerShown: false}} component={FlashcardCustom} />
        <Stack.Screen name="WordDictCustom" options={{headerShown: false}} component={WordDictCustom} />
        <Stack.Screen name="AddWordCustom" options={{headerShown: false}} component={AddWordCustom} />
        <Stack.Screen name="FlashcardPlayer" options={{headerShown: false}} component={FlashcardPlayer} />
        <Stack.Screen name="GameCustom" options={{headerShown: false}} component={GameCustom} />
        <Stack.Screen name="LeaderboardCustom" options={{headerShown: false}} component={LeaderboardCustom} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}