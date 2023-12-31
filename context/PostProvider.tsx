import {useContext, useState} from 'react';
import {firestore, storage} from '../config/FirebaseConfig';
import {PostContext} from './PostContext';
import {AuthContext} from './AuthContext';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore';
import {deleteObject, ref} from 'firebase/storage';
import {Alert} from 'react-native';

interface Types {
  children: React.ReactNode;
  fetchPost?: () => Promise<any>;
  fetchUserPost?: () => Promise<any>;
  updates?: any;
  deletePost?: (postId: any) => Promise<any>;
}
export const PostProvider: React.FC<Types> = ({children}) => {
  const [posts, setPosts] = useState<Posts[]>();
  const [users, setUsers] = useState<Posts[]>();
  const [articles, setArticles] = useState<Posts[]>();
  const [userPosts, setUserPosts] = useState<Posts[]>();
  const [loading, setLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [deleted, setDeleted] = useState<boolean>(false);
  const {user} = useContext(AuthContext);

  const fetchPost = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(firestore, 'posts'),
        orderBy('postTime', 'desc'),
      );
      onSnapshot(q, snapshot => {
        const list: any = [];
        snapshot.forEach(async doc => {
          const {post, postImage, postTime, userId} = doc.data();
          await Promise.all(
            list.push({
              id: doc.id,
              userId: userId,
              userName: user?.displayName,
              postTime: postTime,
              post: post,
              postImage: postImage,
              liked: false,
              likes: 0,
              comments: 0,
            }),
          );
          setPosts(list);
          setLoading(false);
        });
      });
    } catch (error) {
      console.log(error);
    }
  };
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(firestore, 'users'),
        orderBy('id', 'desc'),
      );
      onSnapshot(q, snapshot => {
        const list: any = [];
        snapshot.forEach(async doc => {
          const {email, fName, id, userImg} = doc.data();
          await Promise.all(
            list.push({
              userId: doc.id,
              email : email,
              fName: fName,
              userImg : userImg
            }),
          );
          setUsers(list);
          setLoading(false);
        });
      });
    } catch (error) {
      console.log(error);
    }
  };

  const deletePost = async (postId: any): Promise<any> => {
    const colRef = collection(firestore, 'posts');
    const docRef = doc(colRef, `${postId}`);
    const snap = await getDoc(docRef);

    if (snap.exists()) {
      const {postImage} = snap.data();

      const storageRef = ref(storage, postImage);
      if (postImage !== null) {
        deleteObject(storageRef)
          .then(() => {
            deleteFirestoreData(postId);
          })
          .catch(e => {
            console.log('error', e);
          });
      } else {
        console.log('else return');
        deleteFirestoreData(postId);
      }
    }
  };
  const deleteFirestoreData = (postId: any) => {
    const colRef = collection(firestore, 'posts');
    const docRef = doc(colRef, postId);
    deleteDoc(docRef).then(() => {
      Alert.alert('Post Deleted');
      setDeleted(true);
      setIsOpen(false);
    });
  };

  const fetchArticle = async () => {
    setLoading(true);
    console.log('fetching');
    try {
      const q = query(
        collection(firestore, 'articles'),
        orderBy('postTime', 'desc'),
      );
      onSnapshot(q, snapshot => {
        const list: any = [];
        snapshot.forEach(async doc => {
          const {
            articleDescription,
            articleImg,
            postTime,
            articleTitle,
            email,
            id,
            userId,
          } = doc.data();
            console.log('doc', doc.data());
          await Promise.all(
            list.push({
              id: id,
              userId: userId,
              email: email,
              articleTitle: articleTitle,
              articleDescription: articleDescription,
              articleImg: articleImg,
              postTime: postTime,
            }),
          );

          setArticles(list);
          console.log(articles);
          setLoading(false);
        });
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <PostContext.Provider
      value={{
        fetchPost,
        loading,
        setLoading,
        posts,
        deletePost,
        setIsOpen,
        isOpen,
        deleted,
        setDeleted,
        userPosts,
        users,
        setUsers,
        fetchUsers,
        articles,
        fetchArticle,

      }}>
      {children}
    </PostContext.Provider>
  );
};
