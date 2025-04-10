import { View, Text, Image, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Comics() {
  const [comics, setComics] = useState([]);

  useEffect(() => {
    const fetchComics = async () => {
      try {
        const response = await axios.get('https://hero.boltluna.io/api/comics');
        setComics(response.data);
      } catch (error) {
        console.error('Error fetching comics:', error);
      }
    };
    fetchComics();
  }, []);

  const renderComic = ({ item }) => (
    <View className="mb-4">
      <Image
        source={{ uri: `${item.thumbnail.path}.${item.thumbnail.extension}` }}
        className="w-full h-60 rounded-lg"
        resizeMode="cover"
      />
      <Text className="mt-2 font-medium text-gray-800 dark:text-gray-100">
        {item.title}
      </Text>
    </View>
  );

  return (
    <View className="p-4 w-full h-full">
      <Text className="font-semibold text-2xl text-gray-600 dark:text-gray-300">
        Discover{' '}
        <Text className="font-bold text-black dark:text-gray-100">
          Comics
        </Text>
      </Text>

      {/* Use FlatList for more efficient rendering */}
      <FlatList
        className="mt-4"
        data={comics}
        keyExtractor={(comic) => comic.id.toString()}
        renderItem={renderComic}
      />
    </View>
  );
}
