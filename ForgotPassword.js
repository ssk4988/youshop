import React from 'react';
import {
  AppRegistry,
  TextInput,
  View,
  Text,
  Style,
  ImageBackground,
  Dimensions,
  Button,
  StyleSheet,
} from 'react-native';
import { styles } from './App';
import firebase from 'firebase';

export class ForgotPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      validForm: false,
    };
  }

  componentDidUpdate = () => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!re.test(String(this.state.email).toLowerCase())) {
      if (!this.state.validForm) {
      } else {
        this.setState({ validForm: false });
      }
    } else if (!this.state.validForm) {
      this.setState({ validForm: true });
    } else {
    }
  };

  static navigationOptions = {
    headerTitle: 'Forgot Password?',
    headerTintColor: '#fff',
    headerStyle: {
      backgroundColor: '#3bad2e',
    },
  };

  forgotPassword = () => {
    firebase
      .auth()
      .sendPasswordResetEmail(this.state.email)
      .then(() => {
        // Email sent.
        alert(
          'We have sent information regarding your password to your email.'
        );
        this.props.navigation.popToTop();
      })
      .catch(function(error) {
        // An error happened.
      });
  };

  onChangeText = (text, key) => {
    this.setState({ [key]: text });
  };

  render() {
    return (
      <View>
        <ImageBackground
          source={require('assets/buy.jpg')}
          style={{
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height,
            resizeMode: 'cover',
            alignItems: 'center',
          }}>
          <Text style={styles.container2}>
            {' '}
            Please enter your email so that we can send you an email regarding a
            change of password
          </Text>

          <TextInput
            style={styles.container3}
            placeholder="Email"
            autoCapitalize="none"
            value={this.state.email}
            onChangeText={text => this.onChangeText(text, 'email')}
            onSubmitEditing={this.forgotPassword}
          />
          <View style={{ width: '60%' }}>
            <Button
              title="submit"
              color="green"
              disabled={!this.state.validForm}
              onPress={this.forgotPassword}
            />
          </View>
        </ImageBackground>
      </View>
    );
  }
}
