// import React, { useEffect, useState, useContext } from "react";
// import {
//   View,
//   Text,
//   Image,
//   FlatList,
//   TouchableOpacity,
//   ScrollView,
//   StyleSheet
// } from "react-native";
// import axios from "axios";
// import { Button, Dialog, Portal, ActivityIndicator } from "react-native-paper";
// import { FontAwesome } from "@expo/vector-icons";
// // Import SavedContext from your context file:
// import { SavedContext } from "../context/savedContext";

// export default function Comics() {
//   const [comics, setComics] = useState([]);
//   const [showAll, setShowAll] = useState(false);
//   const [visibleComics, setVisibleComics] = useState(10);
//   const [open, setOpen] = useState(false);
//   const [selectedComic, setSelectedComic] = useState(null);
//   const [recommendations, setRecommendations] = useState([]);
//   const [recommendationsLoading, setRecommendationsLoading] = useState(false);

//   const { savedItems, toggleSaveItem } = useContext(SavedContext);

//   // Fetch comics on mount
//   useEffect(() => {
//     const fetchComics = async () => {
//       try {
//         const response = await axios.get("https://hero.boltluna.io/api/comics");
//         setComics(response.data);
//       } catch (error) {
//         console.error("Error fetching comics:", error);
//       }
//     };
//     fetchComics();
//   }, []);
// console.log(comics)
//   // Helper: Check if a comic is saved
//   const isComicSaved = (comicId) =>
//     savedItems.some((comic) => comic.id === comicId);

//   // Toggle the "View All" or first 10
//   const toggleView = () => {
//     setShowAll((prev) => {
//       const newShowAll = !prev;
//       setVisibleComics(newShowAll ? comics.length : 10);
//       return newShowAll;
//     });
//   };

//   // Fetch recommendations
//   const fetchComicRecommendations = async (comic) => {
//     setRecommendationsLoading(true);
//     try {
//       const res = await axios.post("https://hero.boltluna.io/api/comicrecommendation", {
//         itemDetails: {
//           title: comic?.title,
//           type: "Comic",
//           description: comic?.description || ""
//         }
//       });
//       setRecommendations(res.data.recommendations);
//     } catch (error) {
//       console.error("Failed to fetch comic recommendations:", error);
//     } finally {
//       setRecommendationsLoading(false);
//     }
//   };

//   // Open modal
//   const handleClickOpen = (comic) => {
//     setSelectedComic(comic);
//     setOpen(true);
//     setRecommendations([]);
//     fetchComicRecommendations(comic);
//   };

//   // Close modal
//   const handleClose = () => {
//     setOpen(false);
//     setSelectedComic(null);
//     setRecommendations([]);
//   };

//   // Determine which comics to display
//   const comicsToRender = comics.slice(0, visibleComics);

//   // Renders each comic card with overlay + heart icon
//   const renderComic = ({ item }) => (
//     <TouchableOpacity onPress={() => handleClickOpen(item)}>
//       <View style={{ width: 160, marginRight: 16 }}>
//         <View style={styles.cardContainer}>
//           <Image
//             source={{
//               uri: `${item?.thumbnail?.path}.${item?.thumbnail?.extension}`
//             }}
//             style={styles.cardImage}
//             resizeMode="contain"  // Changed to "contain" for full image visibility
//           />

//           {/* Semi-transparent overlay to darken the image */}
//           <View style={styles.overlay} />

//           {/* Heart icon overlay for saving/unsaving */}
//           <TouchableOpacity
//             onPress={() => toggleSaveItem(item)}
//             style={styles.heartIconContainer}
//           >
//             {isComicSaved(item.id) ? (
//               <FontAwesome name="heart" size={24} color="red" />
//             ) : (
//               <FontAwesome name="heart-o" size={24} color="red" />
//             )}
//           </TouchableOpacity>
//         </View>
//         <Text style={styles.cardTitle}>{item?.title}</Text>
//       </View>
//     </TouchableOpacity>
//   );

//   return (
//     <View style={{ padding: 16, flex: 1 }}>
//       {/* Header */}
//       <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
//         <Text style={{ fontSize: 24, fontWeight: "600", color: "#4A5568" }}>
//           Discover <Text style={{ fontWeight: "700", color: "#000" }}>Comics</Text>
//         </Text>
//         <Button mode="contained" onPress={toggleView}>
//           {showAll ? "View Less" : "View All"}
//         </Button>
//       </View>

//       {/* Horizontal list of comics */}
//       <FlatList
//         data={comicsToRender}
//         keyExtractor={(comic) => comic?.id?.toString()}
//         renderItem={renderComic}
//         horizontal
//         showsHorizontalScrollIndicator={false}
//         contentContainerStyle={{ paddingHorizontal: 16, marginTop: 16 }}
//         ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
//       />

//       {/* Modal for comic details and recommendations */}
//       <Portal>
//         <Dialog visible={open} onDismiss={handleClose}>
//           <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingTop: 16 }}>
//             <Text style={{ fontSize: 20, fontWeight: "600", color: "#000" }}>
//               {selectedComic?.title}
//             </Text>
//             {selectedComic && (
//               <TouchableOpacity onPress={() => toggleSaveItem(selectedComic)}>
//                 {isComicSaved(selectedComic.id) ? (
//                   <FontAwesome name="heart" size={24} color="red" />
//                 ) : (
//                   <FontAwesome name="heart-o" size={24} color="red" />
//                 )}
//               </TouchableOpacity>
//             )}
//           </View>
//           <Dialog.Content>
//             {selectedComic && (
//               <ScrollView>
//                 <Image
//                   source={{
//                     uri: `${selectedComic?.thumbnail?.path}.${selectedComic?.thumbnail?.extension}`
//                   }}
//                   style={{
//                     width: "100%",
//                     height: undefined,       // Remove the fixed height
//                     aspectRatio: 1.0,        // Adjust this value based on your image dimensions (1.0 is for a square image)
//                     borderRadius: 8
//                   }}
//                   resizeMode="contain"  // Ensures the full image is displayed
//                 />
//                 <Text style={{ marginVertical: 8 }}>
//                   {selectedComic?.description || "No description available"}
//                 </Text>
//                 <Text style={{ fontSize: 18, fontWeight: "700", marginVertical: 8 }}>
//                   You Might Also Like
//                 </Text>
//                 {recommendationsLoading ? (
//                   <ActivityIndicator animating={true} />
//                 ) : (
//                   <FlatList
//                     data={recommendations}
//                     keyExtractor={(_, index) => index.toString()}
//                     horizontal
//                     showsHorizontalScrollIndicator={false}
//                     renderItem={({ item }) => (
//                       <TouchableOpacity onPress={() => handleClickOpen(item)}>
//                         <View style={{ width: 120, marginRight: 16 }}>
//                           <Image
//                             source={{
//                               uri: `${item?.thumbnail?.path}.${item?.thumbnail?.extension}`
//                             }}
//                             style={{ width: "100%", height: 100, borderRadius: 8 }}
//                             resizeMode="contain"
//                           />
//                           <Text style={{ marginTop: 4, textAlign: "center" }}>
//                             {item?.title}
//                           </Text>
//                         </View>
//                       </TouchableOpacity>
//                     )}
//                     contentContainerStyle={{ paddingHorizontal: 8 }}
//                   />
//                 )}
//               </ScrollView>
//             )}
//           </Dialog.Content>
//           <Dialog.Actions>
//             <Button onPress={handleClose}>Close</Button>
//           </Dialog.Actions>
//         </Dialog>
//       </Portal>
//     </View>
//   );
// }

// // Updated styles for the comic card
// const styles = StyleSheet.create({
//   cardContainer: {
//     position: "relative",
//     width: "100%",
//     height: 240, // You may adjust this or consider using aspectRatio if needed
//     borderRadius: 8,
//     overflow: "hidden"
//   },
//   cardImage: {
//     width: "100%",
//     height: "100%",
//     // Optionally, you can add aspectRatio: 1 if your images are square:
//     // aspectRatio: 1,
//   },
//   overlay: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: "rgba(0, 0, 0, 0.25)"
//   },
//   heartIconContainer: {
//     position: "absolute",
//     top: 8,
//     right: 8
//   },
//   cardTitle: {
//     marginTop: 8,
//     textAlign: "center",
//     fontWeight: "600",
//     color: "#2D3748"
//   }
// });





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
// Import SavedContext from your context file:
import { SavedContext } from "../context/savedContext";

// Helper function to return a secure image URL
const getSecureImageUrl = (thumbnail) => {
  if (!thumbnail) return "";
  // Force HTTPS for the image URL
  const path = thumbnail.path.startsWith("http:")
    ? thumbnail.path.replace("http:", "https:")
    : thumbnail.path;
  return `${path}.${thumbnail.extension}`;
};

export default function Comics() {
  const [comics, setComics] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [visibleComics, setVisibleComics] = useState(10);
  const [open, setOpen] = useState(false);
  const [selectedComic, setSelectedComic] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [recommendationsLoading, setRecommendationsLoading] = useState(false);

  const { savedItems, toggleSaveItem } = useContext(SavedContext);

  // Fetch comics on mount
  useEffect(() => {
    const fetchComics = async () => {
      try {
        const response = await axios.get("https://hero.boltluna.io/api/comics");
        setComics(response.data);
      } catch (error) {
        console.error("Error fetching comics:", error);
      }
    };
    fetchComics();
  }, []);

  // Helper: Check if a comic is saved
  const isComicSaved = (comicId) =>
    savedItems.some((comic) => comic.id === comicId);

  // Toggle the "View All" or first 10 comics
  const toggleView = () => {
    setShowAll((prev) => {
      const newShowAll = !prev;
      setVisibleComics(newShowAll ? comics.length : 10);
      return newShowAll;
    });
  };

  // Fetch recommendations for a given comic
  const fetchComicRecommendations = async (comic) => {
    setRecommendationsLoading(true);
    try {
      const res = await axios.post("https://hero.boltluna.io/api/comicrecommendation", {
        itemDetails: {
          title: comic?.title,
          type: "Comic",
          description: comic?.description || ""
        }
      });
      setRecommendations(res.data.recommendations);
    } catch (error) {
      console.error("Failed to fetch comic recommendations:", error);
    } finally {
      setRecommendationsLoading(false);
    }
  };

  // Open modal to show comic details and recommendations
  const handleClickOpen = (comic) => {
    setSelectedComic(comic);
    setOpen(true);
    setRecommendations([]);
    fetchComicRecommendations(comic);
  };

  // Close modal
  const handleClose = () => {
    setOpen(false);
    setSelectedComic(null);
    setRecommendations([]);
  };

  // Decide which comics to render
  const comicsToRender = comics.slice(0, visibleComics);

  // Render each comic card with overlay and save icon
  const renderComic = ({ item }) => (
    <TouchableOpacity onPress={() => handleClickOpen(item)}>
      <View style={{ width: 160, marginRight: 16 }}>
        <View style={styles.cardContainer}>
          <Image
            source={{ uri: getSecureImageUrl(item?.thumbnail) }}
            style={styles.cardImage}
            resizeMode="contain"
          />

          {/* Semi-transparent overlay to darken the image */}
          <View style={styles.overlay} />

          {/* Heart icon overlay for saving/unsaving */}
          <TouchableOpacity
            onPress={() => toggleSaveItem(item)}
            style={styles.heartIconContainer}
          >
            {isComicSaved(item.id) ? (
              <FontAwesome name="heart" size={24} color="red" />
            ) : (
              <FontAwesome name="heart-o" size={24} color="red" />
            )}
          </TouchableOpacity>
        </View>
        <Text style={styles.cardTitle}>{item?.title}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ padding: 16, flex: 1 }}>
      {/* Header */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Text style={{ fontSize: 24, fontWeight: "600", color: "#4A5568" }}>
          Discover <Text style={{ fontWeight: "700", color: "#000" }}>Comics</Text>
        </Text>
        <Button mode="contained" onPress={toggleView}>
          {showAll ? "View Less" : "View All"}
        </Button>
      </View>

      {/* Horizontal list of comics */}
      <FlatList
        data={comicsToRender}
        keyExtractor={(comic) => comic?.id?.toString()}
        renderItem={renderComic}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, marginTop: 16 }}
        ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
      />

      {/* Modal for comic details and recommendations */}
      <Portal>
        <Dialog visible={open} onDismiss={handleClose}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingTop: 16 }}>
            <Text style={{ fontSize: 20, fontWeight: "600", color: "#000" }}>
              {selectedComic?.title}
            </Text>
            {selectedComic && (
              <TouchableOpacity onPress={() => toggleSaveItem(selectedComic)}>
                {isComicSaved(selectedComic.id) ? (
                  <FontAwesome name="heart" size={24} color="red" />
                ) : (
                  <FontAwesome name="heart-o" size={24} color="red" />
                )}
              </TouchableOpacity>
            )}
          </View>
          <Dialog.Content>
            {selectedComic && (
              <ScrollView>
                <Image
                  source={{ uri: getSecureImageUrl(selectedComic?.thumbnail) }}
                  style={{
                    width: "100%",
                    height: undefined,
                    aspectRatio: 1.0,
                    borderRadius: 8
                  }}
                  resizeMode="contain"
                />
                <Text style={{ marginVertical: 8 }}>
                  {selectedComic?.description || "No description available"}
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
                            source={{ uri: getSecureImageUrl(item?.thumbnail) }}
                            style={{ width: "100%", height: 100, borderRadius: 8 }}
                            resizeMode="contain"
                          />
                          <Text style={{ marginTop: 4, textAlign: "center" }}>
                            {item?.title}
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
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.25)"
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
