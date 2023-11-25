import {
  Text,
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from '../config/Styles';
import {firestore} from '../config/FirebaseConfig';
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import {PostContext} from '../context/PostContext';
import {useContext, useEffect, useState, useMemo} from 'react';
interface Types {
  navigation: any;
  route: any;
}

const Explore: React.FC<Types> = ({navigation, route}) => {
  const [userData, setUserData] = useState<any>([]);
  const {users, setUsers, fetchUsers, setLoading, loading, avatarApi} =
    useContext(PostContext);
  useEffect(() => {
    fetchUsers();
    setLoading(false);
  }, []);

  // create function to filter based on users
  const filterUsers = text => {
    if(text === ''){
      fetchUsers();
      return;
    }
    const newData = users.filter(item => {
      const itemData = item.fName ? item.fName.toUpperCase() : ''.toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    setUsers(newData);
  };
  const renderItem = ({item}: {item: Users}) => (
    <TouchableOpacity
    style={styles.exploreAvatarContainer}
    onPress={() => {
      console.log(item.userId);
      navigation.navigate('User', {userId: item.userId});
    }}>
    <View>
      <Image
         source={{
          uri: item
            ? item?.userImg ||
              'https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg'
            : 'https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg',
        }}
        style={styles.exploreAvatar}
      />
    </View>
    <View style={styles.exploreAvatarTextContainer}>
      <Text style={styles.exploreAvatarText}>{item.fName}</Text>
    </View>
  </TouchableOpacity>
  );
  const memoizedValue = useMemo(() => renderItem, [users]);

  return (
    <View style={[styles.flexContainer, {paddingTop: '20%'}]}>
      <View>
        <Text style={styles.xxlText}>Explore</Text>
        <View
          style={{
            marginBottom: 30
          }}
        >
          <Ionicons
            name="ios-search-outline"
            color={'#AEAEAE'}
            size={20}
            style={styles.exploreSearchIcon}
          />
          <TextInput
            style={styles.exploreSearchInput}
            placeholder={'What are you looking for?'}
            placeholderTextColor={'#AEAEAE'}
            onChangeText={text => filterUsers(text)}
          />
        </View>
        <View>
          <FlatList
            data={users}
            renderItem={memoizedValue}
          
            keyExtractor={item => item.userId}
          />
        </View>
      </View>
    </View>
  );
};

export default Explore;
