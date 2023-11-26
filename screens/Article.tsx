import {
  Text,
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
} from 'react-native';
import PostLoader from '../components/PostLoader';
import {ArticleContext} from '../context/ArticleContext';
import {PostContext} from '../context/PostContext';
import {UserContext} from '../context/UserContext';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from '../config/Styles';
import ArticleItem from '../components/ArticleItem';
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
import {useContext, useEffect, useState, useMemo} from 'react';
import {Alert} from 'react-native';
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
  const {userData} = useContext(UserContext);

  const {
    articles,
    fetchArticle,
    setLoading,
    loading,
    setIsOpen,
    deleteArticle,
  } = useContext(ArticleContext);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  // useEffect(() => {
  //   // event listener when screen is accessed
  //   const unsubscribe = navigation.addListener('focus', () => {
  //     fetchArticle();
  //     setTimeout(() => {
  //       console.log(articles);
  //     }, 2500);
  //   });
  //   return unsubscribe;
  // }, []);
  useEffect(() => {
    fetchArticle();
    setLoading(false);
  }, []);
  const handleDelete = (articleId: any) => {
    Alert.alert(
      'Delete Post',
      'Are you sure ?',
      [
        {
          text: 'Cancel',
          onPress: () => setIsOpen(false),
          style: 'cancel',
        },
        {
          text: 'Confirm',
          onPress: () => deleteArticle(articleId),
        },
      ],
      {cancelable: false},
    );
  };
  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    const data = fetchArticle();
    // console.log('data',data);
    setRefreshing(false);
  }, [refreshing]);
  const renderItem = ({item}: {item: Articles}) => (
    <ArticleItem
      item={item}
      onDelete={handleDelete}
      onPress={() => {
        navigation.navigate('User', {userId: item.userId});
        console.log(item.userId);
      }}
    />
  );
  const memoizedValue = useMemo(() => renderItem, [articles]);
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
        {/* <Text>

          { articles.length > 0 ?
          articles[0].articleTitle : 'No Articles'}
        </Text> */}
        {articles.length > 0 ? null : (
          <FlatList
            data={articles}
            keyExtractor={(item, index) => index.toString()}
            style={styles.postContainer}
            initialNumToRender={3}
            contentContainerStyle={{paddingBottom: 5}}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            renderItem={memoizedValue}
          />
        )}

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
