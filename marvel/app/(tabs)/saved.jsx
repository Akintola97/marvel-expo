// import React, { useContext, useState, useEffect, useCallback } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   FlatList,
//   TouchableOpacity,
//   Image,
//   Modal,
//   SafeAreaView,
//   Dimensions,
// } from "react-native";
// import { FontAwesome } from "@expo/vector-icons";
// import { Button, ActivityIndicator } from "react-native-paper";
// import { SavedContext } from "../context/savedContext";

// const Saved = () => {
//   const { savedItems, toggleSaveItem } = useContext(SavedContext);
//   const [filteredItems, setFilteredItems] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [selectedItem, setSelectedItem] = useState(null);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const itemsPerPage = 6;

//   // Update filtered items when savedItems changes
//   useCallback(() => {
//     setFilteredItems(savedItems);
//   }, [savedItems]);

//   // Filter items by query
//   useEffect(() => {
//     if (!searchQuery.trim()) {
//       setFilteredItems(savedItems);
//     } else {
//       const lowerQuery = searchQuery.toLowerCase();
//       const filtered = savedItems.filter((item) => {
//         const title = (item.title || item.name || "").toLowerCase();
//         const description = (item.overview || item.description || "").toLowerCase();
//         return title.includes(lowerQuery) || description.includes(lowerQuery);
//       });
//       setFilteredItems(filtered);
//       setCurrentPage(1);
//     }
//   }, [searchQuery, savedItems]);

//   const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const paginatedItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);

//   const handlePageChange = (page) => {
//     setCurrentPage(page);
//   };

//   const getImageUrl = (item) => {
//     if (item.poster_path) {
//       return `https://image.tmdb.org/t/p/original${item.poster_path}`;
//     } else if (item.thumbnail) {
//       return `${item.thumbnail.path}.${item.thumbnail.extension}`;
//     }
//     return null;
//   };

//   // Determine number of columns based on screen width.
//   const screenWidth = Dimensions.get("window").width;
//   const numColumns = screenWidth > 600 ? 4 : 2;

//   const renderItem = ({ item }) => (
//     <TouchableOpacity
//       onPress={() => {
//         setSelectedItem(item);
//         setModalVisible(true);
//       }}
//       className="m-2 w-40 bg-white rounded-xl overflow-hidden shadow-md"
//     >
//       {getImageUrl(item) ? (
//         <Image
//           source={{ uri: getImageUrl(item) }}
//           className="w-full h-40"
//           resizeMode="cover"
//         />
//       ) : (
//         <View className="w-full h-40 bg-gray-300 items-center justify-center">
//           <Text className="text-gray-700">No Image</Text>
//         </View>
//       )}

//       <TouchableOpacity
//         onPress={() => toggleSaveItem(item)}
//         className="absolute top-2 right-2 bg-white bg-opacity-80 p-1 rounded-full"
//       >
//         <FontAwesome name="heart" size={22} color="red" />
//       </TouchableOpacity>

//       <View className="p-3">
//         <Text className="text-base font-semibold text-gray-800">
//           {item.title || item.name}
//         </Text>
//       </View>
//     </TouchableOpacity>
//   );

//   if (loading) {
//     return (
//       <SafeAreaView className="flex-1">
//         <View className="flex-1 items-center justify-center">
//           <ActivityIndicator animating={true} />
//         </View>
//       </SafeAreaView>
//     );
//   }

//   return (
//     <SafeAreaView className="flex-1 bg-gray-50">
//       {/* Add bottom padding so the pagination row won't be blocked by the tab bar */}
//       <View className="flex-1 p-5 pb-20">
//         {/* Header */}
//         <Text className="text-3xl font-bold text-gray-900 mb-5">
//           Saved Items
//         </Text>

//         {/* Search Input */}
//         <View className="mb-5">
//           <TextInput
//             placeholder="Search saved items..."
//             value={searchQuery}
//             onChangeText={setSearchQuery}
//             className="border border-gray-300 bg-white rounded-lg px-4 py-3 shadow"
//             placeholderTextColor="#a0aec0"
//           />
//         </View>

//         {filteredItems.length === 0 ? (
//           <View className="flex-1 items-center justify-center">
//             <Text className="text-lg text-gray-600">No saved items found</Text>
//           </View>
//         ) : (
//           <>
//             <FlatList
//               data={paginatedItems}
//               keyExtractor={(item) => item.id.toString()}
//               renderItem={renderItem}
//               numColumns={numColumns}
//               // Set key to column count to force remount when numColumns changes.
//               key={numColumns}
//               showsVerticalScrollIndicator={false}
//               contentContainerStyle={{
//                 alignItems: "center",
//                 paddingBottom: 80,
//               }}
//               className="mb-6"
//             />

//             {/* Pagination Row */}
//             <View className="flex-row justify-center items-center space-x-6">
//               <Button
//                 mode="text"
//                 disabled={currentPage === 1}
//                 onPress={() => handlePageChange(currentPage - 1)}
//               >
//                 Prev
//               </Button>
//               <Text className="text-base text-gray-800">
//                 {currentPage} / {totalPages}
//               </Text>
//               <Button
//                 mode="text"
//                 disabled={currentPage === totalPages}
//                 onPress={() => handlePageChange(currentPage + 1)}
//               >
//                 Next
//               </Button>
//             </View>
//           </>
//         )}

//         {/* Modal for item details */}
//         <Modal visible={modalVisible} transparent={true} animationType="slide">
//           <View className="flex-1 bg-black bg-opacity-60 justify-center p-4">
//             <View className="bg-white rounded-xl p-6">
//               {selectedItem && (
//                 <>
//                   <Text className="text-2xl font-bold text-gray-900 mb-4">
//                     {selectedItem.title || selectedItem.name}
//                   </Text>
//                   {getImageUrl(selectedItem) && (
//                     <Image
//                       source={{ uri: getImageUrl(selectedItem) }}
//                       style={{
//                         width: "100%",
//                         height: undefined,         // Dynamic height
//                         aspectRatio: 1.0,            // Adjust as needed
//                         borderRadius: 8,
//                         marginBottom: 16,
//                       }}
//                       resizeMode="contain"           // Show full image
//                     />
//                   )}
//                   <Text className="text-base text-gray-700 mb-4">
//                     {selectedItem.overview ||
//                       selectedItem.description ||
//                       "No description available"}
//                   </Text>
//                   <Button mode="contained" onPress={() => setModalVisible(false)}>
//                     Close
//                   </Button>
//                 </>
//               )}
//             </View>
//           </View>
//         </Modal>
//       </View>
//     </SafeAreaView>
//   );
// };

// export default Saved;

import React, { useContext, useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  Modal,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Button, ActivityIndicator } from "react-native-paper";
import { SavedContext } from "../context/savedContext";

const Saved = () => {
  const { savedItems, toggleSaveItem } = useContext(SavedContext);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  // Determine the screen width
  const screenWidth = Dimensions.get("window").width;
  // Set itemsPerPage: if screen width exceeds 600, show 16 items per page; otherwise, show 6.
  const itemsPerPage = screenWidth > 600 ? 24 : 6;

  // Update filtered items when savedItems changes
  useCallback(() => {
    setFilteredItems(savedItems);
  }, [savedItems]);

  // Filter items by search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredItems(savedItems);
    } else {
      const lowerQuery = searchQuery.toLowerCase();
      const filtered = savedItems.filter((item) => {
        const title = (item.title || item.name || "").toLowerCase();
        const description = (
          item.overview ||
          item.description ||
          ""
        ).toLowerCase();
        return title.includes(lowerQuery) || description.includes(lowerQuery);
      });
      setFilteredItems(filtered);
      setCurrentPage(1);
    }
  }, [searchQuery, savedItems]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = filteredItems.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getImageUrl = (item) => {
    if (item.poster_path) {
      return `https://image.tmdb.org/t/p/original${item.poster_path}`;
    } else if (item.thumbnail) {
      return `${item.thumbnail.path}.${item.thumbnail.extension}`;
    }
    return null;
  };

  const numColumns = screenWidth > 600 ? 6 : 2;

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        setSelectedItem(item);
        setModalVisible(true);
      }}
      className="m-2 w-40 bg-white rounded-xl overflow-hidden shadow-md"
    >
      {getImageUrl(item) ? (
        <Image
          source={{ uri: getImageUrl(item) }}
          className="w-full h-40"
          resizeMode="cover"
        />
      ) : (
        <View className="w-full h-40 bg-gray-300 items-center justify-center">
          <Text className="text-gray-700">No Image</Text>
        </View>
      )}

      <TouchableOpacity
        onPress={() => toggleSaveItem(item)}
        className="absolute top-2 right-2 bg-white bg-opacity-80 p-1 rounded-full"
      >
        <FontAwesome name="heart" size={22} color="red" />
      </TouchableOpacity>

      <View className="p-3">
        <Text className="text-base font-semibold text-gray-800">
          {item.title || item.name}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView className="flex-1">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator animating={true} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Add bottom padding so the pagination row won't be blocked by the tab bar */}
      <View className="flex-1 p-5 pb-20">
        {/* Header */}
        <Text className="text-3xl font-bold text-gray-900 mb-5">
          Saved Items
        </Text>

        {/* Search Input */}
        <View className="mb-5">
          <TextInput
            placeholder="Search saved items..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="border border-gray-300 bg-white rounded-lg px-4 py-3 shadow"
            placeholderTextColor="#a0aec0"
          />
        </View>

        {filteredItems.length === 0 ? (
          <View className="flex-1 items-center justify-center">
            <Text className="text-lg text-gray-600">No saved items found</Text>
          </View>
        ) : (
          <>
            <FlatList
              data={paginatedItems}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderItem}
              numColumns={numColumns}
              // You may force a fresh render if needed by setting the key prop dynamically.
              key={numColumns + "-" + itemsPerPage}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                alignItems: "center",
                paddingBottom: 80,
              }}
              className="mb-6"
            />

            {/* Pagination Row */}
            <View className="flex-row justify-center items-center space-x-6">
              <Button
                mode="text"
                disabled={currentPage === 1}
                onPress={() => handlePageChange(currentPage - 1)}
              >
                Prev
              </Button>
              <Text className="text-base text-gray-800">
                {currentPage} / {totalPages}
              </Text>
              <Button
                mode="text"
                disabled={currentPage === totalPages}
                onPress={() => handlePageChange(currentPage + 1)}
              >
                Next
              </Button>
            </View>
          </>
        )}

        {/* Modal for item details */}
        <Modal visible={modalVisible} transparent={true} animationType="slide">
          <View className="flex-1 bg-black bg-opacity-60 justify-center p-4">
            <View className="bg-white rounded-xl p-6">
              {selectedItem && (
                <>
                  <Text className="text-2xl font-bold text-gray-900 mb-4">
                    {selectedItem.title || selectedItem.name}
                  </Text>
                  {getImageUrl(selectedItem) && (
                    <Image
                      source={{ uri: getImageUrl(selectedItem) }}
                      style={{
                        width: "100%",
                        height: undefined, // Dynamic height
                        aspectRatio: 1.0, // Adjust based on your image dimensions
                        borderRadius: 8,
                        marginBottom: 16,
                      }}
                      resizeMode="contain" // Ensures the full image is displayed
                    />
                  )}
                  <Text className="text-base text-gray-700 mb-4">
                    {selectedItem.overview ||
                      selectedItem.description ||
                      "No description available"}
                  </Text>
                  <Button
                    mode="contained"
                    onPress={() => setModalVisible(false)}
                  >
                    Close
                  </Button>
                </>
              )}
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

export default Saved;
