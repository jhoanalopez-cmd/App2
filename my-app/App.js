import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, View } from 'react-native';

export default function App() {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const getUsers = () => {
    setLoading(true);
    fetch(`https://randomuser.me/api/?page=${currentPage}&results=10`, {
      method: 'GET',
    })
    .then((response) => response.json())
    .then((json) => {
      setUsers((prevUsers) => [...prevUsers, ...json.results]);
      setLoading(false);
    })
    .catch(() => {
      setLoading(false);
      // Manejar el error si es necesario
    });
  };

  const renderItem = ({ item }) => {
    return (
      <View style={styles.itemWrapperStyle}>
        <Image source={{ uri: item.picture.large }} style={styles.itemImageStyle} />
        <View style={styles.contentWrapperStyle}>
          <Text style={styles.txtNameStyle}>{item.name.title} {item.name.first} {item.name.last}</Text>
          <Text style={styles.txtEmailStyles}>{item.email}</Text>
        </View>
      </View>
    );
  };

  const renderLoader = () => {
    return loading ? (
      <View style={styles.loaderStyle}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    ) : null;
  };

  const loadMoreItem = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  useEffect(() => {
    getUsers();
  }, [currentPage]);

  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        renderItem={renderItem}
        keyExtractor={(item) => item.email}
        ListFooterComponent={renderLoader}
        onEndReached={loadMoreItem}
        onEndReachedThreshold={0.2}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    paddingTop: 20,
  },
  itemWrapperStyle: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderColor: "#e0e0e0",
    backgroundColor: '#fff',
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 10,
    elevation: 2, // para añadir sombra en Android
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  itemImageStyle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  contentWrapperStyle: {
    justifyContent: 'center',
  },
  txtNameStyle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  txtEmailStyles: {
    fontSize: 16,
    color: "#666",
    marginTop: 4,
  },
  loaderStyle: {
    marginVertical: 16,
    alignItems: 'center',
  },
});
