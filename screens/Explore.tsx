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
import {useContext, useEffect, useState} from 'react';
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

  return (
    <View style={[styles.flexContainer, {paddingTop: '20%'}]}>
      <View>
        <Text style={styles.xxlText}>Explore</Text>
        <View>
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
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.exploreAvatarContainer}
                onPress={() => {
                  console.log(item.userId);
                  navigation.navigate('User', {userId: item.userId});
                }}>
                <View>
                  <Image
                    source={{
                      uri: 'https://www.shareicon.net/data/512x512/2016/05/24/770117_people_512x512.png',
                    }}
                    style={styles.exploreAvatar}
                  />
                </View>
                <View style={styles.exploreAvatarTextContainer}>
                  <Text style={styles.exploreAvatarText}>{item.fName}</Text>
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={item => item.userId}
          />
        </View>
      </View>
    </View>
  );
};

export default Explore;
