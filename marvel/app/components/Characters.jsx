import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  ScrollView,
  StyleSheet
} from "react-native";
import axios from "axios";
import { Button, Dialog, Portal, ActivityIndicator } from "react-native-paper";
import { FontAwesome } from "@expo/vector-icons";
// Import the SavedContext for global saved items data
import { SavedContext } from "../context/savedContext";

export default function Characters() {
  const [characters, setCharacters] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [visibleCharacters, setVisibleCharacters] = useState(10);
  const [open, setOpen] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [recommendationsLoading, setRecommendationsLoading] = useState(false);

  // Consume global saved items and toggle function from context
  const { savedItems, toggleSaveItem } = useContext(SavedContext);

  // Toggle visible characters
  const toggleView = () => {
    setShowAll((prev) => {
      const newShowAll = !prev;
      setVisibleCharacters(newShowAll ? characters.length : 10);
      return newShowAll;
    });
  };

  // Fetch characters on mount
  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const response = await axios.get("https://hero.boltluna.io/api/characters");
        setCharacters(response.data);
      } catch (error) {
        console.error("Error fetching characters:", error);
      }
    };
    fetchCharacters();
  }, []);

  // Check if a character is saved from the global state
  const isCharacterSaved = (characterId) =>
    savedItems.some((character) => character.id === characterId);

  // Fetch character recommendations
  const fetchCharacterRecommendations = async (character) => {
    setRecommendationsLoading(true);
    try {
      const res = await axios.post(
        "https://hero.boltluna.io/api/characterrecommendation",
        {
          itemDetails: {
            title: character.name,
            type: "Character",
            description: character.description || ""
          }
        }
      );
      setRecommendations(res.data.recommendations);
    } catch (error) {
      console.error("Failed to fetch character recommendations:", error);
    } finally {
      setRecommendationsLoading(false);
    }
  };

  // Open the modal and fetch recommendations for the selected character
  const handleClickOpen = (character) => {
    setSelectedCharacter(character);
    setOpen(true);
    setRecommendations([]);
    fetchCharacterRecommendations(character);
  };

  // Close the modal and clear selected character and recommendations
  const handleClose = () => {
    setOpen(false);
    setSelectedCharacter(null);
    setRecommendations([]);
  };

  // Render an individual character card
  const renderCharacters = ({ item }) => (
    <TouchableOpacity onPress={() => handleClickOpen(item)}>
      <View style={{ width: 160, marginRight: 16 }}>
        <View style={styles.cardContainer}>
          <Image
            source={{ uri: `${item.thumbnail.path}.${item.thumbnail.extension}` }}
            style={styles.cardImage}
            resizeMode="cover"
          />

          {/* Overlay to darken the image slightly */}
          <View style={styles.overlay} />

          {/* Heart Icon Overlay for saving */}
          <TouchableOpacity
            onPress={() => toggleSaveItem(item)}
            style={styles.heartIconContainer}
          >
            {isCharacterSaved(item.id) ? (
              <FontAwesome name="heart" size={24} color="red" />
            ) : (
              <FontAwesome name="heart-o" size={24} color="red" />
            )}
          </TouchableOpacity>
        </View>

        <Text style={styles.cardTitle}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  // Determine characters to render
  const charactersToRender = characters.slice(0, visibleCharacters);

  return (
    <View style={{ padding: 16, flex: 1 }}>
      {/* Header */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Text style={{ fontSize: 24, fontWeight: "600", color: "#4A5568" }}>
          Discover <Text style={{ fontWeight: "700", color: "#000" }}>Characters</Text>
        </Text>
        <Button mode="contained" onPress={toggleView}>
          {showAll ? "View Less" : "View All"}
        </Button>
      </View>

      {/* Horizontal List of Characters */}
      <FlatList
        data={charactersToRender}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderCharacters}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, marginTop: 16 }}
        ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
      />

      {/* Modal / Dialog for character details and recommendations */}
      <Portal>
        <Dialog visible={open} onDismiss={handleClose}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16, paddingTop: 16 }}>
            <Dialog.Title>{selectedCharacter?.name}</Dialog.Title>
            {selectedCharacter && (
              <TouchableOpacity onPress={() => toggleSaveItem(selectedCharacter)}>
                {isCharacterSaved(selectedCharacter.id) ? (
                  <FontAwesome name="heart" size={24} color="red" />
                ) : (
                  <FontAwesome name="heart-o" size={24} color="red" />
                )}
              </TouchableOpacity>
            )}
          </View>
          <Dialog.Content>
            {selectedCharacter && (
              <ScrollView>
                <Image
                  source={{
                    uri: `${selectedCharacter.thumbnail.path}.${selectedCharacter.thumbnail.extension}`
                  }}
                  style={{ width: "100%", height: 200, borderRadius: 8 }}
                  resizeMode="cover"
                />
                <Text style={{ marginVertical: 8 }}>
                  {selectedCharacter.description || "No description available"}
                </Text>
                <Text style={{ fontSize: 18, fontWeight: "700", marginVertical: 8 }}>
                  You Might Also Like
                </Text>
                {recommendationsLoading ? (
                  <ActivityIndicator animating={true} />
                ) : (
                  <FlatList
                    data={recommendations}
                    keyExtractor={(_, index) => index.toString()}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => (
                      <TouchableOpacity onPress={() => handleClickOpen(item)}>
                        <View style={{ width: 120, marginRight: 16 }}>
                          <Image
                            source={{ uri: `${item.thumbnail.path}.${item.thumbnail.extension}` }}
                            style={{ width: "100%", height: 100, borderRadius: 8 }}
                            resizeMode="cover"
                          />
                          <Text style={{ marginTop: 4, textAlign: "center" }}>
                            {item.name}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    )}
                    contentContainerStyle={{ paddingHorizontal: 8 }}
                  />
                )}
              </ScrollView>
            )}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={handleClose}>Close</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    position: "relative",
    width: "100%",
    height: 240,
    borderRadius: 8,
    overflow: "hidden"
  },
  cardImage: {
    width: "100%",
    height: "100%"
  },
  overlay: {
    // Darken the image slightly
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.25)"
  },
  heartIconContainer: {
    position: "absolute",
    top: 8,
    right: 8
  },
  cardTitle: {
    marginTop: 8,
    textAlign: "center",
    fontWeight: "600",
    color: "#2D3748"
  }
});
