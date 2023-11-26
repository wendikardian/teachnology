import {useContext, useState} from 'react';
import {firestore, storage} from '../config/FirebaseConfig';
import {ArticleContext} from './ArticleContext';
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
  fetchArticle?: () => Promise<any>;
  fetchUserPost?: () => Promise<any>;
  updates?: any;
  deleteArticle?: (articleId: any) => Promise<any>;
}
export const ArticleProvider: React.FC<Types> = ({children}) => {
  const [articles, setArticles] = useState<Posts[]>();
  const [users, setUsers] = useState<Posts[]>();
  const [userPosts, setUserPosts] = useState<Posts[]>();
  const [loading, setLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [deleted, setDeleted] = useState<boolean>(false);
  const {user} = useContext(AuthContext);

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
      const q = query(collection(firestore, 'users'), orderBy('id', 'desc'));
      onSnapshot(q, snapshot => {
        const list: any = [];
        snapshot.forEach(async doc => {
          const {email, fName, id, userImg} = doc.data();
          await Promise.all(
            list.push({
              userId: doc.id,
              email: email,
              fName: fName,
              userImg: userImg,
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

  const deleteArticle = async (articleId: any): Promise<any> => {
    const colRef = collection(firestore, 'articles');
    const docRef = doc(colRef, `${articleId}`);
    const snap = await getDoc(docRef);

    if (snap.exists()) {
      const {postImage} = snap.data();

      const storageRef = ref(storage, postImage);
      if (postImage !== null) {
        deleteObject(storageRef)
          .then(() => {
            deleteFirestoreData(articleId);
          })
          .catch(e => {
            console.log('error', e);
          });
      } else {
        console.log('else return');
        deleteFirestoreData(articleId);
      }
    }
  };
  const deleteFirestoreData = (articleId: any) => {
    const colRef = collection(firestore, 'articles');
    const docRef = doc(colRef, articleId);
    deleteDoc(docRef).then(() => {
      Alert.alert('Article has been Deleted');
      setDeleted(true);
      setIsOpen(false);
    });
  };

  return (
    <ArticleContext.Provider
      value={{
        fetchArticle,
        loading,
        setLoading,
        articles,
        deleteArticle,
        setIsOpen,
        isOpen,
        deleted,
        setDeleted,
        userPosts,
        users,
        setUsers,
        fetchUsers,
      }}>
      {children}
    </ArticleContext.Provider>
  );
};
