import {Text, View, TouchableOpacity, Image, Dimensions} from 'react-native';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  memo,
} from 'react';
import {PostContext} from '../context/PostContext';
import {ArticleContext} from '../context/ArticleContext';
import Entypo from 'react-native-vector-icons/Entypo';
// book icon

import moment from 'moment';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {AuthContext} from '../context/AuthContext';
import {collection, doc, getDoc} from 'firebase/firestore';
import {firestore} from '../config/FirebaseConfig';
import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet';
import styles from '../config/Styles';

var width = Dimensions.get('window').width;

interface Types {
  onDelete?: any;
  props?: any;
  onPress?: () => void;
  item?: any;
}
const ArticleItem: React.FC<Types> = ({item, onDelete, props, onPress}) => {
  const {isOpen, setIsOpen} = useContext(ArticleContext);
  const {navigation} = props;
  const {user} = useContext(AuthContext);

  const [userData, setUserData] = useState<any>(null);

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['1%', '50%'], []);
  const handleSheet = useCallback(
    (input: any) => {
      !isOpen
        ? bottomSheetRef.current?.expand()
        : bottomSheetRef.current?.close() && setIsOpen(false);
      if (input) {
        bottomSheetRef.current?.expand();
        setIsOpen(true);
      }
    },
    [isOpen],
  );
  const handleSheetChanges = useCallback((index: number) => {}, []);

  const getUser = async () => {
    const refCol = collection(firestore, 'users');
    const refDoc = doc(refCol, item.userId);
    await getDoc(refDoc).then(snap => {
      if (snap.exists()) {
        setUserData(snap.data());
      }
    });
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <View key={item.index}>
      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        enablePanDownToClose={true}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}>
        <BottomSheetView style={styles.panel}>
          {user.uid == item.userId ? (
            <TouchableOpacity
              style={[styles.panelButton, {backgroundColor: 'crimson'}]}
              onPress={() => onDelete(item.id)}>
              <Text style={styles.panelButtonTitle}>Delete Article</Text>
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity
            style={styles.panelButton}
            onPress={(input: any) => handleSheet(input)}>
            <Text style={styles.panelButtonTitle}>Cancel</Text>
          </TouchableOpacity>
        </BottomSheetView>
      </BottomSheet>
      <View style={styles.postTopContainer}>
        <TouchableOpacity onPress={onPress}>
          <Image
            source={{
              uri: userData
                ? userData?.userImg ||
                  'https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg'
                : 'https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg',
            }}
            style={styles.avatarImages}
          />
        </TouchableOpacity>
        <View style={styles.postHeaderTextContainer}>
          <View style={styles.postTextInnerContainer}>
            <TouchableOpacity onPress={onPress}>
              <Text style={styles.postUserNameText}>
                {' '}
                {userData ? userData.fName || 'Test' : 'Test'}{' '}
                {userData ? userData.lName || 'User' : 'User'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.postIconContainer}>
          <TouchableOpacity
            style={styles.postIconStyle}
            onPress={(input: any) => handleSheet(input)}>
            <Entypo name={'dots-three-horizontal'} color={'gray'} size={20} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.postText}>
        <Text
          style={{
            color: 'black',
            fontWeight: 'bold',
            fontSize: 20,
            marginBottom: 10,
            marginTop: 10,
          }}>
          {item.articleTitle}
        </Text>
        {/* <Text style={{color: 'black'}}>{item.articleDescription}</Text> */}
      </View>
      <View style={{alignSelf: 'center', marginTop: 12, zIndex: -1}}>
        {item.postImage !== null ? (
          <Image
            source={{
              uri: item.articleImg,
            }}
            style={{borderRadius: 20, width: width * 0.9, height: 350}}
          />
        ) : null}
      </View>

      <View style={styles.postBottom}>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('ReadArticle', {articles: {
                articleTitle: item.articleTitle,
                articleDescription: item.articleDescription,
                articleImg: item.articleImg,
                articleId: item.id,
                userId: item.userId,
                likes: item.likes,
                comments: item.comments,
                postTime : item.postTime,
              }})
            }}>
            <Ionicons name={'newspaper-outline'} color={'gray'} size={24} />
          </TouchableOpacity>
          
        </View>
       
       {
        user.uid == item.userId ? (
          <TouchableOpacity>
          <Ionicons name={'pencil'} color={'gray'} size={24} />
        </TouchableOpacity>
        ) : null
       }
        
      </View>
    </View>
  );
};

export default memo(ArticleItem);
