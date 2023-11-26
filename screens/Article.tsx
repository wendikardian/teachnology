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
type Props = {
  navigation: any; 
  route: any; 
};

const Article = (props: Props) => {
  const {navigation, route} = props;
  return (
    <View style={[styles.flexContainer, {paddingTop: '20%'}]}>
      <View>
        <Text style={styles.xxlText}>Find Article</Text>
        <View
          style={{
            marginBottom: 30,
          }}>
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
          />
        </View>
        {/* Create button to create article */}
      </View>
        <TouchableOpacity
          style={styles.buttonCreate}
          onPress={() => {
            console.log('Create Article');
            navigation.navigate('AddArticle');
          }}>
         
            <Ionicons
              name="add-circle"
              color={'black'}
              size={56}
              style={styles.exploreAvatar}
            />

        </TouchableOpacity>
    </View>
  );
};

export default Article;
