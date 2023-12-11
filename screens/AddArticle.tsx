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
import {Timestamp, addDoc, collection} from 'firebase/firestore';
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

const AddArticle = (props: any) => {
  const {navigation, route} = props;
  const {userData, getUser, setUserData} = useContext(UserContext);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const {user} = useContext(AuthContext);
  const [articleTitle, setArticleTitle] = useState<string>('');
  const [articleDescription, setArticleDescription] = useState<string>('');
  const snapPoints = useMemo(() => ['1%', '50%'], []);
  const handleSheetChanges = useCallback((index: number) => {}, []);

  const [image, setImage] = useState<any>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [transferred, setTransferred] = useState<number>(0);
  const takePhoto = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
    }).then(image => {
      const imagePath = Platform.OS === 'ios' ? image.sourceURL : image.path;
      setImage(imagePath);
      bottomSheetRef.current?.close();
    });
  };
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
  const handleSubmit = async () => {
    navigation.goBack();
    let imgUrl = await uploadImage();

    if (imgUrl == null && userData.userImg) {
      imgUrl = userData.userImg;
    }

    await addDoc(collection(firestore, 'articles'), {

      id: Math.random().toString(36).substr(2, 9),
      userId: user?.uid,
      email: user?.email,
      articleImg: imgUrl,
      articleTitle: articleTitle,
      articleDescription: articleDescription,
      postTime: Timestamp.fromDate(new Date()),
    }).then(() => {
      // clear data
      setArticleTitle('');
      setArticleDescription('');
      setImage(null);
      // navigate to home
      console.log('Articles has been published!');
      Alert.alert(
        'Article Published!',
        'Your article has been published successfully!',
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

    let docRef = ref(storage, `article/${fileName}`);
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
    <View style={[styles.flexContainer, {paddingTop: '20%'}]}>
      <View>
        <Text style={styles.xxlText}>Create Article</Text>
      </View>
      <View style={styles.imageContainer}>
        <TouchableOpacity onPress={() => bottomSheetRef.current?.expand()}>
          <View
            style={{
              height: 100,
              width: 100,
              borderRadius: 15,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <ImageBackground
              source={{
                uri: image
                  ? image
                  : 
                    'https://images.vexels.com/media/users/3/151890/isolated/preview/a2c9a6511c7fe41751f5a026fa0f0d48-newspaper-article-line-icon.png'
               
              }}
              style={{height: 100, width: 100}}
              imageStyle={{borderRadius: 50}}>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  opacity: 0.7,
                }}>
                <Ionicons name="camera-outline" size={25} />
              </View>
            </ImageBackground>
          </View>
        </TouchableOpacity>
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
      <View style={styles.panelButtonContainer}>
          <TouchableOpacity
            style={[styles.panelButton, {width: '40%', height: 40}]}
            onPress={handleSubmit}>
            <Text style={[styles.panelTitle, {fontSize: 18}]}>Publish</Text>
          </TouchableOpacity>
        </View>
      <BottomSheet
        ref={bottomSheetRef}
        index={1}
        enablePanDownToClose={true}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}>
        <BottomSheetView style={styles.panel}>
          <View style={{alignItems: 'center'}}>
            <Text style={[styles.panelTitle,{color:'black'}]}>Upload Photo</Text>
            <Text style={styles.panelSubtitle}>
              Choose Your Profile Picture
            </Text>
          </View>
          <TouchableOpacity style={styles.panelButton} onPress={takePhoto}>
            <Text style={styles.panelButtonTitle}>Take Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.panelButton} onPress={choosePhoto}>
            <Text style={styles.panelButtonTitle}>Choose From Library</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.panelButton}
            onPress={() => bottomSheetRef.current?.close()}>
            <Text style={styles.panelButtonTitle}>Cancel</Text>
          </TouchableOpacity>
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
};

export default AddArticle;
