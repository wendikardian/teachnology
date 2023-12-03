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
import moment from 'moment';
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
  addDoc,
  Timestamp,
} from 'firebase/firestore';
import {AuthContext} from '../context/AuthContext';
import {useContext, useEffect, useState, useMemo} from 'react';
import {Alert} from 'react-native';
interface Types {
  navigation: any;
  route: any;
}
type Props = {
  navigation: any;
  route: any;
  articles: any;
};

const ReadArticle = (props: Props) => {
  const {navigation, route} = props;
  // get data article from route
  const {articles} = route.params;
  const {user} = useContext(AuthContext);
  const [inputComment, setInputComment] = useState<string>('');
    console.log(articles)
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

  const handleSubmit = async () => {
    await addDoc(collection(firestore, 'comment_articles'), {
      id: Math.random().toString(36).substr(2, 9),
      userId: user?.uid,
      email: user?.email,
      comment: inputComment,
      postTime: Timestamp.fromDate(new Date()),
      articlesId : articles.articleId,
    }).then(() => {
        setInputComment('');
      console.log('Comment has been published!');
      Alert.alert(
        'Comment Published!',
        'Your Comment has been published successfully!',
      );
    });
  };

  return (
    <View style={[styles.flexContainer, {paddingTop: '20%'}]}>
      <View>
        <Text style={styles.xxlText}>{articles.articleTitle}</Text>
        <Text
          style={[
            styles.xxlText,
            {
              color: 'black',
              marginTop: 20,
              fontSize: 15,
            },
          ]}>
          {moment(articles.postTime.toDate()).format('DD/MM/YYYY HH:mm')}
        </Text>
        <View
          style={{
            marginBottom: 30,
          }}></View>

        <View
          style={{
            //  backgroundColor: 'red',
            padding: 30,
          }}>
          <Image
            source={{uri: articles.articleImg}}
            style={{
              width: '100%',
              height: 200,
              borderRadius: 10,
            }}
          />
          <Text
            style={[
              styles.panelSubtitle,
              {
                color: 'black',
                marginTop: 20,
              },
            ]}>
            {articles.articleDescription}
          </Text>
        </View>
        <View>
          {/* input comment */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 10,
              backgroundColor: '#F5F5F5',
              borderRadius: 10,
              marginBottom: 10,
            }}>
            <TextInput
              style={{
                flex: 1,
                fontSize: 15,
                fontWeight: 'bold',
                color: 'black',
              }}
              placeholder={'Write a comment...'}
              placeholderTextColor={'gray'}
              value={inputComment}
              onChangeText={text => setInputComment(text)}
            />
            <TouchableOpacity
                onPress={() => {
                    handleSubmit();
                }}
            >
              <Ionicons name={'send-outline'} color={'gray'} size={24} />
            </TouchableOpacity>
          </View>
          <View>
            {/* comment section */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 10,
                backgroundColor: '#F5F5F5',
                borderRadius: 10,
                marginBottom: 10,
                marginLeft: 10,
              }}>
              <View style={{flexDirection: 'row'}}>
                <Image
                  source={{
                    uri: 'https://picsum.photos/200/300',
                  }}
                  style={{
                    height: 40,
                    width: 40,
                    borderRadius: 20,
                    marginRight: 10,
                  }}
                />
                <View>
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: 'bold',
                      color: 'black',
                    }}>
                    Wendi
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: '600',
                      color: 'gray',
                    }}>
                    2 hours ago
                  </Text>
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: '300',
                      color: 'black',
                      width: 250,
                    }}>
                    lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua.
                  </Text>
                </View>
              </View>
              <TouchableOpacity>
                <Ionicons name={'trash-outline'} color={'gray'} size={24} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ReadArticle;
