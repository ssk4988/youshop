import React from 'react';
import {
  KeyboardAvoidingView,
  Text,
  TextInput,
  View,
  Button,
  ImageBackground,
  Linking,
  ImageResizeMode,
  Dimensions,
  StyleSheet,
  Image,
} from 'react-native';
import firebase from 'firebase';
var CryptoJS = require('crypto-js');
import { Feather } from '@expo/vector-icons';

export class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      validForm: false,
      error: '',
    };
  }
  componentDidMount = () => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.props.navigation.replace('Initial');
      } else {
        // No user is signed in.
      }
    });
  };

  componentDidUpdate = () => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (
      !re.test(String(this.state.email).toLowerCase()) ||
      this.state.password.length < 8
    ) {
      if (!this.state.validForm) {
      } else {
        this.setState({ validForm: false });
      }
    } else if (!this.state.validForm) {
      this.setState({ validForm: true });
    } else {
    }
  };

  login = async () => {
    if (this.state.validForm) {
      firebase
        .auth()
        .signInWithEmailAndPassword(this.state.email, this.state.password)
        .then(() => {
          var user = firebase.auth().currentUser;
          if (user) {
            this.props.navigation.replace('Initial');
          }
        })
        .catch(error => {
          var errorCode = error.code;
          var errorMessage = error.message;
          this.setState({ error: errorMessage });
        });
    } else {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (!re.test(String(this.state.email).toLowerCase())) {
        this.setState({ error: 'Please enter a valid email' });
      } else if (this.state.password.length < 8) {
        this.setState({
          error: 'Password must be at least 8 characters',
        });
      }
    }
  };

  onChangeText = (text, key) => {
    if (text.indexOf(' ') > -1 && key == 'email') {
    } else if (text.indexOf(' ') > -1 && key == 'password') {
    } else {
      this.setState({ [key]: text });
    }
  };

  static navigationOptions = ({ navigation }) => {
    return {
      header: null,
    };
  };

  render() {
    return (
      <ImageBackground
        source={require('assets/pattern.jpg')}
        style={{
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').height,
          alignItems: 'center',
        }}>
        <KeyboardAvoidingView
          style={{
            width: '100%',
            alignItems: 'center',
            flex: 1,
            paddingTop: 50,
            justifyContent: 'center',
          }}
          behavior="padding">
          <Image
            source={require('assets/logo.PNG')}
            resizeMode="contain"
            style={{
              width: 200,
              height: 200,
            }}
          />
          {this.state.error.length != 0 ? (
            <View
              style={{
                padding: 10,
                backgroundColor: '#ff4d4d',
                borderWidth: 1,
                width: '60%',
                alignItems: 'center',
              }}>
              <Feather
                name="alert-triangle"
                size={25}
                style={{ marginRight: 5 }}
              />
              <Text
                style={{
                  textAlign: 'center',
                }}>
                {this.state.error}
              </Text>
            </View>
          ) : null}
          <TextInput
            placeholder="Email"
            value={this.state.email}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholderTextColor="grey"
            style={{
              backgroundColor: '#ffffffb0',
              padding: 5,
              margin: 5,
              borderWidth: 1,
              borderRadius: 3,
              width: '60%',
            }}
            onChangeText={text => this.onChangeText(text, 'email')}
          />
          <TextInput
            placeholder="Password"
            secureTextEntry={true}
            value={this.state.password}
            placeholderTextColor="grey"
            style={{
              backgroundColor: '#ffffffb0',
              padding: 5,
              margin: 5,
              borderWidth: 1,
              borderRadius: 3,
              width: '60%',
            }}
            onChangeText={text => this.onChangeText(text, 'password')}
            onSubmitEditing={this.login}
          />
          <View style={{ margin: 7 }} />
          <View
            style={{
              width: '60%',
            }}>
            <Button title="Login" color="#3bad2eb0" onPress={this.login} />
          </View>
          <View
            style={{
              width: '60%',
              margin: 25,
            }}>
            <Button
              title="Register"
              color="#3bad2eb0"
              onPress={() => {
                this.props.navigation.navigate('Register');
              }}
            />
          </View>
          <Text
            style={{ color: 'white', padding: 20 }}
            onPress={() => this.props.navigation.navigate('ForgotPassword')}>
            Forgot Password?
          </Text>
        </KeyboardAvoidingView>
      </ImageBackground>
    );
  }
}
