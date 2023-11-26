import {
  Text,
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl
} from 'react-native';
import PostLoader from '../components/PostLoader';
import {ArticleContext} from '../context/ArticleContext';
import {UserContext} from '../context/UserContext';
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
  const {userData} = useContext(UserContext);
  const {fetchArticle, setLoading, loading, articles} =
    useContext(ArticleContext);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  useEffect(() => {
    fetchArticle();
    setLoading(false);
    console.log(articles);
  }, []);
  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    fetchArticle();
    setRefreshing(false);
  }, [refreshing]);
  const renderItem = ({item}: {item: Articles}) => 
{
  return (
    <TouchableOpacity
      style={styles.exploreAvatarContainer}
      onPress={() => {
        console.log(item.id);
        navigation.navigate('ArticleDetail', {articleId: item.id});
      }}>
      <View>
        <Image
          source={{
            uri: item.articleImg,
          }}
          style={styles.exploreAvatar}
        />
      </View>
      <View style={styles.exploreAvatarTextContainer}>
        <Text style={styles.exploreAvatarText}>{item.articleTitle}</Text>
        <Text style={styles.exploreAvatarText}>{item.articleDescription}</Text>
      </View>
    </TouchableOpacity>
  );
        
}
  ;
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
        {loading ? (
          <PostLoader />
        ) : (
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
