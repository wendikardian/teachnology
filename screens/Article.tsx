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
type Props = {}

const Article = (props: Props) => {
  return (
    <View style={[styles.flexContainer, {paddingTop: '20%'}]}>
    <View>
      <Text style={styles.xxlText}>Explore Article</Text>
      
    </View>
  </View>
  )
}

export default Article

