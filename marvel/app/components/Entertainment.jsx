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
import YoutubePlayer from "react-native-youtube-iframe";
import { FontAwesome } from "@expo/vector-icons";
// Import SavedContext for global saved items functionality
import { SavedContext } from "../context/savedContext";

export default function Entertainment() {
  const [entertainment, setEntertainment] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [visibleEntertainment, setVisibleEntertainment] = useState(10);

  // Modal state
  const [open, setOpen] = useState(false);
  const [selectedEntertainment, setSelectedEntertainment] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [recommendationsLoading, setRecommendationsLoading] = useState(false);
  const [trailerKey, setTrailerKey] = useState(null);

  // Saved items context
  const { savedItems, toggleSaveItem } = useContext(SavedContext);

  // Toggle the number of visible items
  const toggleView = () => {
    setShowAll((prev) => {
      const newShowAll = !prev;
      setVisibleEntertainment(newShowAll ? entertainment.length : 10);
      return newShowAll;
    });
  };

  // Fetch on mount
  useEffect(() => {
    const fetchEntertainment = async () => {
      try {
        const response = await axios.get("https://hero.boltluna.io/api/entertainment");
        setEntertainment(response.data);
      } catch (error) {
        console.error("Error fetching entertainment:", error);
      }
    };
    fetchEntertainment();
  }, []);

  // Check if item is saved
  const isEntertainmentSaved = (id) => savedItems.some((item) => item.id === id);

  // Fetch recommendations for selected item
  const fetchEntertainmentRecommendations = async (item) => {
    setRecommendationsLoading(true);
    try {
      const res = await axios.post("https://hero.boltluna.io/api/entertainmentrecommendation", {
        itemDetails: {
          title: item?.title || item?.name,
          type: "Entertainment",
          description: item?.overview || ""
        }
      });
      setRecommendations(res.data.recommendations);
    } catch (error) {
      console.error("Failed to fetch recommendations:", error);
    } finally {
      setRecommendationsLoading(false);
    }
  };

  // Fetch trailer
  const fetchTrailerKey = async (item) => {
    try {
      const res = await axios.post("https://hero.boltluna.io/api/trailer", {
        media_type: item?.type,
        id: item?.id
      });
      setTrailerKey(res.data.trailerKey);
    } catch (error) {
      console.error("Error fetching trailer key:", error);
    }
  };

  // Open modal
  const handleClickOpen = (item) => {
    setSelectedEntertainment(item);
    setOpen(true);
    setRecommendations([]);
    setTrailerKey(null);
    fetchTrailerKey(item);
    fetchEntertainmentRecommendations(item);
  };

  // Close modal
  const handleClose = () => {
    setOpen(false);
    setSelectedEntertainment(null);
    setRecommendations([]);
    setTrailerKey(null);
  };

  // Render a single entertainment card
  const renderEntertainment = ({ item }) => (
    <TouchableOpacity onPress={() => handleClickOpen(item)}>
      <View style={{ width: 160, marginRight: 16 }}>
        <View style={styles.cardContainer}>
          <Image
            source={{ uri: `https://image.tmdb.org/t/p/original${item?.poster_path}` }}
            style={styles.cardImage}
            resizeMode="cover"
          />
          {/* Semi-transparent overlay */}
          <View style={styles.overlay} />
          {/* Heart icon */}
          <TouchableOpacity
            onPress={() => toggleSaveItem(item)}
            style={styles.heartIconContainer}
          >
            {isEntertainmentSaved(item.id) ? (
              <FontAwesome name="heart" size={24} color="red" />
            ) : (
              <FontAwesome name="heart-o" size={24} color="red" />
            )}
          </TouchableOpacity>
        </View>
        <Text style={styles.cardTitle}>{item?.title || item?.name}</Text>
      </View>
    </TouchableOpacity>
  );

  const entertainmentToRender = entertainment.slice(0, visibleEntertainment);

  return (
    <View style={{ padding: 16, flex: 1, backgroundColor: "#F7FAFC", paddingBottom: 60 }}>
      {/* Header with Title and Toggle Button */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Text style={{ fontSize: 24, fontWeight: "600", color: "#4A5568" }}>
          Browse Featured <Text style={{ fontWeight: "700", color: "#000" }}>Titles</Text>
        </Text>
        <Button mode="contained" onPress={toggleView}>
          {showAll ? "View Less" : "View All"}
        </Button>
      </View>

      {/* Entertainment List (horizontal) */}
      <FlatList
        data={entertainmentToRender}
        keyExtractor={(item) => item?.id?.toString()}
        renderItem={renderEntertainment}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, marginTop: 16 }}
        ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
      />

      {/* Modal / Dialog */}
      <Portal>
        <Dialog visible={open} onDismiss={handleClose}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingHorizontal: 16,
              paddingTop: 16
            }}
          >
            <Dialog.Title>
              {selectedEntertainment?.title || selectedEntertainment?.name}
            </Dialog.Title>
            {selectedEntertainment && (
              <TouchableOpacity onPress={() => toggleSaveItem(selectedEntertainment)}>
                {isEntertainmentSaved(selectedEntertainment.id) ? (
                  <FontAwesome name="heart" size={24} color="red" />
                ) : (
                  <FontAwesome name="heart-o" size={24} color="red" />
                )}
              </TouchableOpacity>
            )}
          </View>
          <Dialog.Content>
            {selectedEntertainment && (
              <ScrollView>
                {trailerKey ? (
                  <YoutubePlayer height={200} play={false} videoId={trailerKey} />
                ) : (
                  <Image
                    source={{ uri: `https://image.tmdb.org/t/p/original${selectedEntertainment?.poster_path}` }}
                    style={{ width: "100%", height: 200, borderRadius: 8 }}
                    resizeMode="cover"
                  />
                )}
                <Text style={{ marginVertical: 8 }}>
                  {selectedEntertainment?.overview || "No description available"}
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
                            source={{ uri: `https://image.tmdb.org/t/p/original${item?.poster_path}` }}
                            style={{ width: "100%", height: 100, borderRadius: 8 }}
                            resizeMode="cover"
                          />
                          <Text style={{ marginTop: 4, textAlign: "center" }}>
                            {item?.title || item?.name}
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

// Styles for overlay effect
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