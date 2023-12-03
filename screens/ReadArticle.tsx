import {
    Text,
    View,
    TextInput,
    FlatList,
    TouchableOpacity,
    Image,
    RefreshControl,
  } from 'react-native';
  import {ArticleContext} from '../context/ArticleContext';
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
  
  const ReadArticle = (props: Props) => {
    const {navigation, route} = props;
    // get data article from route 
    const {articles : any} = route.params;

    const {userData} = useContext(UserContext);
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
 
  
    const [refreshing, setRefreshing] = useState<boolean>(false);
   
    
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

          </View>
  
          <View
            style={{
              //  backgroundColor: 'red',
              padding: 30,
            }}>
            
          </View>
          {/* Create button to create article */}
        </View>
       

      </View>
    );
  };
  
  export default ReadArticle;
  