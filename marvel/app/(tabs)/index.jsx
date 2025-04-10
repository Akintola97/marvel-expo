import { View, ScrollView, SafeAreaView } from "react-native";
import React from "react";

import Comics from "../components/Comics";
import Hero from "../components/Hero";

const Home = () => {
  return (
<View>

        <Hero />
        <Comics />
</View>
  );
};

export default Home;