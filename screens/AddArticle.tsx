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
import {useContext, useEffect, useState, useMemo, useCallback} from 'react';
const AddArticle = () => {
  const [articleTitle, setArticleTitle] = useState<string>('');
  const [articleDescription, setArticleDescription] = useState<string>('');
  const snapPoints = useMemo(() => ['1%', '50%'], []);
  const handleSheetChanges = useCallback((index: number) => {}, []);

  const [image, setImage] = useState<any>(null);
  return (
    <View style={[styles.flexContainer, {paddingTop: '20%'}]}>
      <View>
        <Text style={styles.xxlText}>Create Article</Text>
      </View>
      {/* create 3 text input one for article title, article description */}
      <View
        style={{
          marginBottom: 30,
        }}>
        <TextInput
          style={styles.exploreSearchInput}
          placeholder={'Article Title'}
          placeholderTextColor={'#AEAEAE'}
          value={articleTitle}
          onChangeText={text => setArticleTitle(text)}
        />
      </View>
      {/* large input for article description */}
      <View
        style={{
          marginBottom: 30,
        }}>
        <TextInput
          style={[styles.exploreSearchInput, {height: 300}]}
          placeholder={'Article Description'}
          placeholderTextColor={'#AEAEAE'}
          value={articleDescription}
          onChangeText={text => setArticleDescription(text)}
        />
      </View>
    </View>
  );
};

export default AddArticle;
