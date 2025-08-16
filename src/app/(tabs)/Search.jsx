
import { AntDesign } from "@expo/vector-icons";
import { Video } from "expo-av";
import { Image } from "expo-image";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useFile } from "../../context/fileProvider";
import FileService from "../../service/fileService";

const Search = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const { dispatch } = useFile();

  useEffect(() => {
    if (query.length > 0) {
      setLoading(true);
      setNotFound(false);
      const debounce = setTimeout(() => {
        FileService.getAllFiles(dispatch).then(({ data }) => {
          const filtered = data.filter(
            (item) =>
              item.title.toLowerCase().includes(query.toLowerCase()) ||
              item.prompt.toLowerCase().includes(query.toLowerCase())
          );
          setResults(filtered);
          setLoading(false);
          if (filtered.length === 0) {
            setNotFound(true);
          }
        });
      }, 500);
      return () => clearTimeout(debounce);
    } else {
      setResults([]);
      setNotFound(false);
    }
  }, [query]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      //onPress={() => router.push(`/post/${item._id}`)}
    >
      {item.path ? (
        <Video
          source={{ uri: item.path }}
          style={styles.video}
          useNativeControls
          resizeMode="cover"
          isLooping
        />
      ) : (
        <Image source={{ uri: item.thumbnail }} style={styles.image} />
      )}
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.prompt}>{item.prompt}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <AntDesign name="search1" size={24} color="black" />
        <TextInput
          style={styles.input}
          placeholder="Search by title or prompt"
          placeholderTextColor="#888"
          value={query}
          onChangeText={setQuery}
        />
      </View>
      {loading && <ActivityIndicator size="large" color="#FFD700" />}
      {notFound && (
        <Text style={styles.notFound}>No results found for "{query}"</Text>
      )}
      <FlatList
        data={results}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        style={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 10,
    paddingTop:20
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    color: "#000",
    fontSize: 16,
  },
  list: {
    flex: 1,
  },
  itemContainer: {
    backgroundColor: "#111",
    borderRadius: 10,
    marginBottom: 10,
    overflow: "hidden",
  },
  video: {
    width: "100%",
    height: 200,
  },
  image: {
    width: "100%",
    height: 200,
  },
  textContainer: {
    padding: 10,
  },
  title: {
    color: "#FFD700",
    fontSize: 18,
    fontWeight: "bold",
  },
  prompt: {
    color: "#fff",
    fontSize: 14,
  },
  notFound: {
    color: "#fff",
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
});

export default Search;
