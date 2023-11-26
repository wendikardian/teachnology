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
  const [search, setSearch] = useState<string>('');
  const [data, setData] = useState<any>([
    {
      id: '1',
      userId: '1',
      email: 'wendi',
      articleTitle: 'title',
      articleDescription: 'description',
      articleImg: 'https://picsum.photos/200/300',
      postTime: 'time',
    },
  ]);
  const {
    articles,
    fetchArticle,
    setLoading,
    loading,
    setIsOpen,
    deleteArticle,
    setArticles,
  } = useContext(ArticleContext);

  const [refreshing, setRefreshing] = useState<boolean>(false);
  useEffect(() => {
    // event listener when screen is accessed
    const unsubscribe = navigation.addListener('focus', () => {
      fetchArticle();
      setTimeout(() => {
        console.log(articles);
      }, 2500);
      setArticles([
        {
          id: 1,
          userId: '1',
          email: 'wendi',
          articleTitle: 'title',
          articleDescription: 'description',
          articleImg: 'https://picsum.photos/200/300',
          postTime: 'time',
        },
        {
          id: 2,
          userId: '2',
          email: 'wendi',
          articleTitle: 'title',
          articleDescription: 'description',
          articleImg: 'https://picsum.photos/200/300',
          postTime: 'time',
        },
      ]);
    });
    return unsubscribe;
  }, []);
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
  const filterData = (text: string) => {
    if(text.length === 0){
      fetchArticle();
    }
    const newData = articles.filter((item: any) => {
      const itemData = item.articleTitle
        ? item.articleTitle.toUpperCase()
        : ''.toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    setArticles(newData);
    setSearch(text);
  }
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
    // <Text>{item.articleTitle}</Text>
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
            value={search}
            // onChangeText={text => setSearch(text)}
            onChangeText={text => {filterData(text)}}
          />
          {/* {data.length > 0 ? null : ( */}

          {/* )} */}
        </View>
        {/* <Text>

          { articles.length > 0 ?
          articles[0].articleTitle : 'No Articles'}
        </Text> */}

        <View
          style={{
            //  backgroundColor: 'red',
            padding: 30,
          }}>
          <FlatList
            data={articles}
            keyExtractor={item => item.id}
            // initialNumToRender={3}
            // contentContainerStyle={{paddingBottom: 5}}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            renderItem={memoizedValue}
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
