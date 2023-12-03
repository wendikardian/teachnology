import React, {useContext} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import Tabs from './Tabs';
import Auth from './Auth';
import {AuthContext} from '../context/AuthContext';
import {ActivityIndicator} from 'react-native';
import {UserProvider} from '../context/UserProvider';
import {createStackNavigator} from '@react-navigation/stack';
import EditProfileScreen from '../screens/EditProfileScreen';
import EditPostScreen from '../screens/EditPostScreen';
import AddArticle from '../screens/AddArticle';
import ReadArticle from '../screens/ReadArticle';
import {ArticleProvider} from '../context/ArticleProvider';

const stack = createStackNavigator();
function Routes() {
  const {user, isLoading} = useContext(AuthContext);
  return (
    <ArticleProvider>
      <UserProvider>
        {isLoading ? (
          <ActivityIndicator
            color={'white'}
            style={{flex: 1, alignSelf: 'center'}}
            size={24}
          />
        ) : (
          <NavigationContainer>
            {user ? (
              <>
                <stack.Navigator screenOptions={{headerShown: false}}>
                  <stack.Screen name="Tabs" component={Tabs} />
                  <stack.Screen
                    name="EditProfile"
                    component={EditProfileScreen}
                  />
                  <stack.Screen
                    name="EditPost"
                    component={EditPostScreen}
                    options={{headerShown: true, headerTitle: 'Edit'}}
                  />
                  <stack.Screen
                    name="AddArticle"
                    component={AddArticle}
                    options={{headerShown: false, headerTitle: 'Edit'}}
                  />
                  <stack.Screen
                    name="ReadArticle"
                    component={ReadArticle}
                    options={{headerShown: false, headerTitle: 'Edit'}}
                  />
                </stack.Navigator>
              </>
            ) : (
              <>
                <Auth />
              </>
            )}
          </NavigationContainer>
        )}
      </UserProvider>
    </ArticleProvider>
  );
}

export default Routes;
