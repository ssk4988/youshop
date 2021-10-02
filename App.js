/*
The term 'Etsy' is a trademark of Etsy, Inc. This application uses the Etsy API but is not endorsed or certified by Etsy. b7pqxr519w5rhl44ieeht3md pwlbu33zzl
*/
/*
Ebay App ID (Client ID) SachinSi-TSASoftw-PRD-1c22b8256-03d91dd1
Dev ID 941bdadf-6412-4ca5-9384-932237dd84d1
Cert ID (Client Secret) PRD-c22b8256be24-0d56-429c-bdd6-fb96
RuName Sachin_Sivakuma-SachinSi-TSASof-undmm
*/
/*
Amazon Associates tsabartowib-20
*/
import * as React from 'react';
import { StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Constants } from 'expo';
import {
  createDrawerNavigator,
  createStackNavigator,
  createSwitchNavigator,
  createAppContainer,
} from 'react-navigation';
import { Login } from './Login';
import { Register } from './Register';
import { ForgotPassword } from './ForgotPassword';
import { Initial } from './Initial';
import { MaterialIcons } from '@expo/vector-icons';
import { Results } from './Results';
import { Store } from './Store';
import { Starred } from './Starred';
import firebase from 'firebase';

export class App extends React.Component {
  render() {
    return <AppNavigator />;
  }
}

try {
  if (firebase.apps.length === 0) {
    var config = {
      apiKey: 'REDACTED',
      authDomain: 'tsa-software.firebaseapp.com',
      databaseURL: 'https://tsa-software.firebaseio.com',
      projectId: 'tsa-software',
      storageBucket: '',
      messagingSenderId: 'REDACTED',
    };
    firebase.initializeApp(config);
  }
} catch (error) {
  console.log(error);
}
var user = firebase.auth().currentUser;

export let store = new Store();

const AppNavigator = createStackNavigator(
  {
    Register,
    Initial,
    ForgotPassword,
    Login,
    Results,
    Starred,
  },
  {
    initialRouteName: user ? 'Initial' : 'Login',
  }
);
const AppContainer = createAppContainer(AppNavigator);

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  container1: {
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: 'black',
    backgroundColor: 'lightblue',
    margin: 10,
    fontSize: 30,
    padding: 5,
  },
  container2: {
    color: 'white',
    margin: 10,
    padding: 5,
    textAlign: 'center',
  },
  container3: {
    borderRadius: 5,
    borderWidth: 0.5,
    borderColor: 'black',
    width: '60%',
    backgroundColor: 'gray',
    margin: 20,
    padding: 5,
    color: 'white',
  },
});

export default AppContainer;
