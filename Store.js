import { SQLite } from 'expo';
import { AsyncStorage } from 'react-native';
import firebase from 'firebase';

export const db = SQLite.openDatabase('AppData.db');

export class Store {
  constructor() {
    this.user = firebase.auth().currentUser;
    this.list = [];
    this.getAPIData(() => {});
    this.getList();
  }

  getList = () => {
    this.user = firebase.auth().currentUser;
    if (this.user) {
      firebase
        .database()
        .ref('/users/' + this.user.uid)
        .once('value')
        .then(snapshot => {
          if (snapshot.val()) {
            this.list = JSON.parse(snapshot.val().list);
          }
        });
    }
  };

  addList = (link, site) => {
    this.user = firebase.auth().currentUser;
    this.list.push({
      link,
      site,
    });
    firebase
      .database()
      .ref('/users/' + this.user.uid)
      .set({
        list: JSON.stringify(this.list),
      });
  };

  removeList = link => {
    this.user = firebase.auth().currentUser;
    for (let i = 0; i < this.list.length; i++) {
      if (this.list[i].link == link) {
        this.list.splice(i, 1);
        break;
      }
    }
    firebase
      .database()
      .ref('/users/' + this.user.uid)
      .set({
        list: JSON.stringify(this.list),
      });
  };

  matches = link => {
    for (let l in this.list) {
      if (this.list[l].link == link) {
        return true;
      }
    }
    return false;
  };

  getAPIData = async callback => {
    try {
      let data = await AsyncStorage.getItem('AnyShopAPIDataSecure');
      if (data !== null) {
        callback(JSON.parse(data));
      } else {
        await AsyncStorage.setItem(
          'AnyShopAPIDataSecure',
          JSON.stringify([
            {
              name: 'Amazon',
              associateId: 'REDACTED',
            },
            {
              name: 'Ebay',
              appId: 'REDACTED',
              devID: 'REDACTED',
              certID: 'REDACTED',
              runame: 'REDACTED',
              base64:
                'REDACTED',
              access: '',
              accessTimeStamp: '',
              refresh: '',
              refreshTimeStamp: '',
            },
            {
              name: 'Etsy',
              key: 'REDACTED',
            },
            {
              name: 'Best Buy',
              key: 'REDACTED',
            },
          ])
        );
        callback([
          {
            name: 'Amazon',
            associateId: 'REDACTED',
          },
          {
            name: 'Ebay',
            appId: 'REDACTED',
            devID: 'REDACTED',
            certID: 'REDACTED',
            runame: 'REDACTED',
            base64:
              'REDACTED',
            access: '',
            accessTimeStamp: '',
            refresh: '',
            refreshTimeStamp: '',
          },
          {
            name: 'Etsy',
            key: 'REDACTED',
          },
          {
            name: 'Best Buy',
            key: 'REDACTED',
          },
        ]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  setAPIData = async data => {
    try {
      await AsyncStorage.setItem('AnyShopAPIDataSecure', JSON.stringify(data));
    } catch (error) {
      console.log(error);
    }
  };

  refreshAPIData = async () => {
    try {
      await AsyncStorage.removeItem('AnyShopAPIDataSecure');
      return this.getAPIData();
    } catch (error) {
      console.log(error);
      return error;
    }
  };
}
