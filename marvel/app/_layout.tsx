import { Stack } from "expo-router";
import './global.css'
import { PaperProvider } from 'react-native-paper';
import {SavedProvider} from "./context/savedContext";

export default function RootLayout() {
  return (
    <PaperProvider>
      <SavedProvider>
  <Stack screenOptions={{headerShown: false}}> 
    <Stack.Screen name="(tabs)"/>
  </Stack>
  </SavedProvider>
  </PaperProvider>
  )
}
