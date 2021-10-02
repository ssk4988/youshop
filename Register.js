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
  AppRegistry,
} from 'react-native';
import firebase from 'firebase';
import { Feather } from '@expo/vector-icons';
var CryptoJS = require('crypto-js');

export class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      first: '',
      last: '',
      email: '',
      password: '',
      validForm: false,
      error: '',
    };
  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: 'Register',
      headerTintColor: '#fff',
      headerStyle: {
        backgroundColor: '#3bad2e',
      },
    };
  };

  register = () => {
    if (this.state.validForm) {
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then(() => {
          var user = firebase.auth().currentUser;
          if (user == null) {
          } else {
            user
              .updateProfile({
                displayName: this.state.first + ' ' + this.state.last,
              })
              .then(() => {
                this.props.navigation.popToTop();
              })
              .catch(error => {
                this.setState({ error: error.message });
              });
          }
        })
        .catch(error => {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          this.setState({ error: errorMessage });
          // ...
        });
    } else {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (this.state.first.length == 0) {
        this.setState({ error: 'First name is a required field' });
      } else if (this.state.last.length == 0) {
        this.setState({ error: 'Last name is a required field' });
      } else if (this.state.password.length < 8) {
        this.setState({
          error: 'Password must be at least 8 characters',
        });
      } else if (!re.test(String(this.state.email).toLowerCase())) {
        this.setState({ error: 'Please enter a valid email' });
      } else if (!this.state.validForm) {
      } else {
        this.setState({ error: '' });
      }
    }
  };

  onChangeText = (text, key) => {
    if (text.indexOf(' ') > -1 && key == 'password') {
    } else {
      this.setState({ [key]: text });
    }
  };

  componentDidUpdate = (prevProps, prevState) => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (
      !this.state.validForm &&
      this.state.first.length != 0 &&
      this.state.last.length != 0 &&
      re.test(String(this.state.email).toLowerCase()) &&
      this.state.password.length >= 8
    ) {
      this.setState({ validForm: true });
    } else if (
      this.state.validForm &&
      this.state.first.length != 0 &&
      this.state.last.length != 0 &&
      re.test(String(this.state.email).toLowerCase()) &&
      this.state.password.length >= 8
    ) {
    } else if (this.state.validForm) {
      this.setState({ validForm: false });
    }
  };

  render() {
    return (
      <ImageBackground
        source={require('assets/ecommerce.jpg')}
        style={{
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').height - 50,
          resizeMode: 'cover',
          alignItems: 'center',
        }}>
        <KeyboardAvoidingView
          style={{
            flex: 1,
            width: Dimensions.get('window').width,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          behavior="padding">
          <View style={{ padding: 10 }} />
          {this.state.error.length != 0 ? (
            <View
              style={{
                padding: 10,
                margin: 10,
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
            style={{
              backgroundColor: '#ffffff',
              padding: 5,
              margin: 5,
              borderWidth: 1,
              borderRadius: 3,
              width: '60%',
            }}
            placeholder="First Name"
            autoCapitalize="words"
            value={this.state.first}
            onChangeText={text => this.onChangeText(text, 'first')}
          />
          <TextInput
            style={{
              backgroundColor: '#ffffff',
              padding: 5,
              margin: 5,
              borderWidth: 1,
              borderRadius: 3,
              width: '60%',
            }}
            placeholder="Last Name"
            autoCapitalize={true}
            value={this.state.last}
            onChangeText={text => this.onChangeText(text, 'last')}
          />
          <TextInput
            style={{
              backgroundColor: '#ffffff',
              padding: 5,
              margin: 5,
              borderWidth: 1,
              borderRadius: 3,
              width: '60%',
            }}
            autoCapitalize="none"
            placeholder="Email"
            value={this.state.email}
            onChangeText={text => this.onChangeText(text, 'email')}
          />
          <TextInput
            style={{
              backgroundColor: '#ffffff',
              padding: 5,
              margin: 5,
              borderWidth: 1,
              borderRadius: 3,
              width: '60%',
            }}
            placeholder="Password"
            secureTextEntry={true}
            value={this.state.password}
            onChangeText={text => this.onChangeText(text, 'password')}
            onSubmitEditing={this.register}
          />
          <View
            style={{
              padding: 25,
            }}>
            <Button
              title="Make a new account"
              color="#3bad2e"
              onPress={this.register}
            />
          </View>
        </KeyboardAvoidingView>
      </ImageBackground>
    );
  }
}
