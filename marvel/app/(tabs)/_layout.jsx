// app/(tabs)/_layout.jsx
import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      {/* The tab bar will show these screens */}
      {/* The default route is now index.jsx */}
      <Tabs.Screen name="index" options={{ title: 'Home' }} />

      {/* And there's also an explore screen */}
      <Tabs.Screen name="explore" options={{ title: 'Explore' }} />
    </Tabs>
  );
}