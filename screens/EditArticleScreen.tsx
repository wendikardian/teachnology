import {
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {AuthContext} from '../context/AuthContext';
import ImagePicker from 'react-native-image-crop-picker';
import {doc, setDoc} from 'firebase/firestore';
import {firestore, storage} from '../config/FirebaseConfig';
import {getDownloadURL, ref, uploadBytes} from 'firebase/storage';
import {UserContext} from '../context/UserContext';
import styles from '../config/Styles';

const EditArticleScreen = (props: any) => {
  const {navigation, route} = props;
  const {article} = route.params;
  const [articleTitle, setArticleTitle] = useState<string>(article.articleTitle);
  const [articleDescription, setArticleDescription] = useState<string>(article.articleDescription);
  const {user} = useContext(AuthContext);
  const {userData, getUser, setUserData} = useContext(UserContext);

  const bottomSheetRef = useRef<BottomSheet>(null);


  const [image, setImage] = useState<any>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [transferred, setTransferred] = useState<number>(0);

  
  const choosePhoto = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    }).then(image => {
      const imagePath = Platform.OS === 'ios' ? image.sourceURL : image.path;
      setImage(imagePath);
      bottomSheetRef.current?.close();
    });
  };
  const handleUpdate = async () => {
    navigation.goBack();
    setDoc(doc(firestore, 'articles', article.articleId), {
        articleTitle: articleTitle,
        articleDescription: articleDescription,
        articleImg : article.articleImg,
        email : article.email,
        postTime : article.postTime,
        userId : article.userId,
    }).then(() => {
      
      console.log('Article has beed updated!');
      Alert.alert(
        'Article has beed updated!',
        'Your articles has been updated successfully.',
      );
    });
  };
  useEffect(() => {
    getUser();
  }, []);
  const uploadImage = async () => {
    if (image == null) {
      return null;
    }
    const uploadUri = image;
    let fileName = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);

    // Add timestamp to File Name
    const extension = fileName.split('.').pop();
    const name = fileName.split('.').slice(0, -1).join('.');
    fileName = name + Date.now() + '.' + extension;

    setUploading(true);
    setTransferred(0);

    let docRef = ref(storage, `profile/${fileName}`);
    const img = await fetch(uploadUri);
    const bytes = await img.blob();

    try {
      await uploadBytes(docRef, bytes);

      const url = await getDownloadURL(docRef);

      setUploading(false);
      return url;
    } catch (e) {
      console.log(e);
      return null;
    }
  };
  return (
    <View style={[styles.flexContainer, {padding: 24}]}>
      <ScrollView
        style={styles.inputsContainer}
        showsVerticalScrollIndicator={false}>
            <Text style={styles.xxlText}>Edit Article </Text>
        <View style={[styles.action, {
            marginTop:50,
        }]}>
          <FontAwesome name="user-o" color="#333333" size={20} />
          <TextInput
            placeholder="Title"
            placeholderTextColor="#666666"
            autoCorrect={false}
            value={articleTitle ? articleTitle : ''}
            onChangeText={txt => setArticleTitle(txt)}
            style={styles.textInput}
          />
        </View>

        <View style={styles.action}>
          <Ionicons name="ios-clipboard-outline" color="#333333" size={20} />
          <TextInput
            placeholder="About Me"
            placeholderTextColor="#666666"
            autoCorrect={true}
            multiline={true}
            value={articleDescription ? articleDescription : ''}
            onChangeText={txt => setArticleDescription(txt)}
            style={[styles.textInput, {height: 250}]}
          />
        </View>
        
        <View style={styles.panelButtonContainer}>
          <TouchableOpacity
            style={[styles.panelButton, {width: '40%', height: 40}]}
            onPress={handleUpdate}>
            <Text style={[styles.panelTitle, {fontSize: 18}]}>Update</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default EditArticleScreen;
