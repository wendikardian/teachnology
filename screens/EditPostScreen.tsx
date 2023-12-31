import {
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Text,
  Alert,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import Styles from '../config/Styles';
import {Timestamp, addDoc, collection} from 'firebase/firestore';
import {firestore, storage} from '../config/FirebaseConfig';
import {AuthContext} from '../context/AuthContext';
import {getDownloadURL, ref, uploadBytes} from 'firebase/storage';

interface Params {
  route: any;
  navigation: any;
}
const EditPostScreen: React.FC<Params> = ({route, navigation}) => {
  const {user} = useContext(AuthContext);
  const image = route.params?.param || null;
  const [loading, setLoading] = useState<boolean>(false);
  const [text, setText] = useState<string>('');
  const submitPost = async () => {
    navigation.navigate('Home');
    try {
      const imageUrl = await uploadImage();
     
      await addDoc(collection(firestore, 'posts'), {
        
        // createRandomgeneratedId int must unique
        id: Math.floor(Math.random() * 100000000),
        userId: user.uid,
        postImage: imageUrl,
        // postImage: 'https://marketplace.canva.com/EAFRWLkkJIU/1/0/1600w/canva-white-and-orange-minimalist-instagram-profile-picture-c90IYqhFSLI.jpg',
        post: text,
        postTime: Timestamp.fromDate(new Date()),
        likes: null,
        comments: null,
      });
      setText('');
    } catch (error) {
      console.log(error);
    } finally {
      navigation.replace('Tabs');
    }
  };
  const uploadImage = async () => {
    if (image === null) {
      return null;
    }
    const uploadUri = 'file://' + image;
    const fileName = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);
    const docRef = ref(storage, `images/${fileName}`);
    const img = await fetch(uploadUri);
    const bytes = await img.blob();
    setLoading(true);
    // clear data
 
    try {
      await uploadBytes(docRef, bytes);
      Alert.alert('Post published');
      const url = await getDownloadURL(docRef);
      console.log(url)
      return url;
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={submitPost} style={{right: '10%'}}>
          <Text style={Styles.addText}>Share</Text>
        </TouchableOpacity>
      ),
    });
  }, [text]);
  return (
    <View style={[Styles.flexContainer, {backgroundColor: '#fff'}]}>
      <View style={Styles.addInputContainer}>
        <Image
          source={{uri: 'file://' + image}}
          style={{width: 80, height: 80, alignSelf: 'center'}}
        />
        <TextInput
          placeholder="Write a caption..."
          placeholderTextColor={'lightgray'}
          onChange={() => text}
          onChangeText={setText}
          style={Styles.addInputStyle}
          multiline={true}
          numberOfLines={4}
        />
      </View>
    </View>
  );
};

export default EditPostScreen;
