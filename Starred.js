import * as React from 'react';
import {
  View,
  FlatList,
  Image,
  Text,
  Button,
  Dimensions,
  Linking,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { store } from './App';
import { MaterialIcons } from '@expo/vector-icons';
import firebase from 'firebase';

export class Starred extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
      reload: false,
      ready: false,
    };
  }

  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      headerTitle: 'Starred Items',
      headerTintColor: '#fff',
      headerStyle: {
        backgroundColor: '#3bad2e',
      },
    };
  };

  componentDidMount = () => {
    this._onRefresh();
  };

  returnCard = item => {
    if (item.item.site == 'Etsy') {
      let title = item.item.title;
      let price = item.item.price;
      let currency_code = item.item.currency_code;
      let tags = item.item.tags;
      let category_path = item.item.category_path;
      let images =
        'Images' in item.item ? item.item.Images[0].url_fullxfull : null;
      let description = item.item.description;
      return (
        <View
          style={{
            padding: 5,
            borderWidth: 2,
            borderRadius: 5,
            flex: 1,
            width: '100%',
            alignSelf: 'center',
            marginTop: 10,
          }}>
          {'title' in item.item ? (
            <Text
              style={{
                textAlign: 'center',
                fontSize: 16,
                fontWeight: 'bold',
                flex: 1,
              }}
              numberOfLines={3}>
              {title}
            </Text>
          ) : null}
          <View
            style={{
              flexDirection: 'row',
              padding: 5,
            }}>
            {'Images' in item.item ? (
              <Image
                style={{
                  margin: 10,
                  height: this.state.width * 0.4,
                  width: this.state.width * 0.4,
                  alignSelf: 'center',
                }}
                source={{ uri: images }}
              />
            ) : null}
            {'description' in item.item ? (
              <Text numberOfLines={10} style={{ flex: 1 }}>
                {description}
              </Text>
            ) : null}
          </View>
          <TouchableOpacity
            onPress={() => {
              if (store.matches(item.item.url)) {
                store.removeList(item.item.url);
              } else {
                store.addList(item.item.url);
              }
              this.setState({ reload: !this.state.reload });
            }}>
            <MaterialIcons
              name={store.matches(item.item.url) ? 'star' : 'star-border'}
              size={30}
              color={store.matches(item.item.url) ? '#f9c116' : null}
            />
          </TouchableOpacity>
          <View
            style={{
              flexDirection: 'column',
              flex: 1,
              padding: 5,
              justifyContent: 'space-evenly',
            }}>
            <View
              style={{
                flexDirection: 'row',
                margin: 10,
              }}>
              <Text
                style={{
                  fontSize: 20,
                  color: '#29a329',
                  fontWeight: 'bold',
                  alignSelf: 'center',
                }}>
                {currency_code == 'USD'
                  ? '$' + price
                  : price + ' ' + currency_code}
              </Text>
              <Text
                style={{
                  backgroundColor: '#a4c639',
                  color: 'white',
                  borderRadius: 5,
                  padding: 5,
                  paddingLeft: 10,
                  paddingRight: 10,
                  marginLeft: 10,
                  fontWeight: 'bold',
                }}>
                {item.item.site}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
              }}>
              <Text
                style={{
                  alignSelf: 'center',
                  margin: 5,
                }}>
                {item.item.views} Views
              </Text>
              <Text
                style={{
                  alignSelf: 'center',
                  margin: 5,
                }}>
                {item.item.quantity} left
              </Text>
            </View>
            <View
              style={{
                flexWrap: 'wrap',
                alignItems: 'flex-start',
                flexDirection: 'row',
              }}>
              <Text
                style={{
                  alignSelf: 'center',
                }}>
                Categories:
              </Text>
              {category_path.map((category, index) => {
                return (
                  <Text
                    style={{
                      backgroundColor: '#a4c639',
                      color: 'white',
                      borderRadius: 20,
                      padding: 5,
                      paddingLeft: 15,
                      paddingRight: 15,
                      margin: 5,
                      fontWeight: 'bold',
                    }}>
                    {category}
                  </Text>
                );
              })}
            </View>
          </View>
          <View
            style={{
              margin: 5,
              width: '50%',
              alignSelf: 'center',
            }}>
            <Button
              title="View from source"
              color="green"
              onPress={() => {
                Linking.openURL(item.item.url);
              }}
            />
          </View>
        </View>
      );
    } else if (item.item.site == 'Ebay') {
      let title = item.item.title;
      let buyingOption = item.item.buyingOptions[0];
      let price;
      let currency_code;
      if (buyingOption == 'FIXED_PRICE') {
        price = item.item.price.value;
        currency_code = item.item.price.currency;
      } else {
        price = item.item.currentBidPrice.value;
        currency_code = item.item.currentBidPrice.currency;
      }
      let shipping = item.item.shippingOptions[0].shippingCost;
      let condition = item.item.condition;
      //let tags = item.item.tags;
      //let category_path = item.item.category_path;
      let images = 'image' in item.item ? item.item.image.imageUrl : null;
      //let description = item.item.description;
      let seller = item.item.seller;
      return (
        <View
          style={{
            padding: 5,
            borderWidth: 2,
            borderRadius: 5,
            flex: 1,
            width: '100%',
            alignSelf: 'center',
            marginTop: 10,
          }}>
          <Text
            style={{
              textAlign: 'center',
              fontSize: 16,
              fontWeight: 'bold',
              flex: 1,
            }}
            numberOfLines={3}>
            {title}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              padding: 5,
            }}>
            {'image' in item.item ? (
              <Image
                style={{
                  margin: 10,
                  height: this.state.width * 0.4,
                  width: this.state.width * 0.4,
                  alignSelf: 'center',
                }}
                source={{ uri: images }}
              />
            ) : null}
            <View
              style={{
                flexDirection: 'column',
                margin: 10,
                marginLeft: 0,
              }}>
              <Text
                style={{
                  alignSelf: 'center',
                  fontSize: 20,
                  fontWeight: 'bold',
                  textAlign: 'center',
                }}>
                Seller Info
              </Text>
              <View
                style={{
                  flexWrap: 'wrap',
                  alignItems: 'flex-start',
                  flexDirection: 'row',
                }}>
                <Text>Seller: </Text>
                <Text>{seller.username}</Text>
              </View>
              <Text>Feedback (%): {seller.feedbackPercentage}%</Text>
              {'condition' in item.item ? (
                <View
                  style={{
                    flexWrap: 'wrap',
                    alignItems: 'flex-start',
                    flexDirection: 'row',
                  }}>
                  <Text>Condition: </Text>
                  <Text>{condition}</Text>
                </View>
              ) : null}
            </View>
          </View>
          <View
            style={{
              flexDirection: 'column',
              flex: 1,
              padding: 5,
              justifyContent: 'space-evenly',
            }}>
            <TouchableOpacity
              onPress={() => {
                if (store.matches(item.item.item_id)) {
                  store.removeList(item.item.item_id);
                } else {
                  store.addList(item.item.item_id);
                }
                this.setState({ reload: !this.state.reload });
              }}>
              <MaterialIcons
                name={store.matches(item.item.item_id) ? 'star' : 'star-border'}
                size={30}
                color={store.matches(item.item.item_id) ? '#f9c116' : null}
              />
            </TouchableOpacity>
            <View
              style={{
                flexDirection: 'row',
                margin: 10,
              }}>
              {buyingOption == 'FIXED_PRICE' ? null : (
                <Text
                  style={{
                    alignSelf: 'center',
                  }}>
                  Current Bidding Price:{' '}
                </Text>
              )}
              <Text
                style={{
                  fontSize: 20,
                  color: '#29a329',
                  fontWeight: 'bold',
                  alignSelf: 'center',
                }}>
                {currency_code == 'USD'
                  ? '$' + price
                  : price + ' ' + currency_code}
              </Text>
              <Text
                style={{
                  backgroundColor: '#a4c639',
                  color: 'white',
                  borderRadius: 5,
                  padding: 5,
                  paddingLeft: 10,
                  paddingRight: 10,
                  marginLeft: 10,
                  fontWeight: 'bold',
                }}>
                {item.item.site}
              </Text>
              <Text
                style={{
                  backgroundColor: '#a4c639',
                  color: 'white',
                  borderRadius: 5,
                  padding: 5,
                  paddingLeft: 10,
                  paddingRight: 10,
                  marginLeft: 10,
                  fontWeight: 'bold',
                }}>
                {buyingOption == 'FIXED_PRICE'
                  ? 'Fixed Price'
                  : 'Current Auction Price'}
              </Text>
            </View>
            {'shippingOptions' in item.item &&
            'shippingCost' in item.item.shippingOptions[0] &&
            'value' in shipping &&
            shipping.value != null ? (
              <Text
                style={{
                  marginLeft: 10,
                }}>
                Shipping:{' '}
                {shipping.currency == 'USD'
                  ? '$' + shipping.value
                  : shipping.value + ' ' + shipping.currency}{' '}
              </Text>
            ) : null}
          </View>
          <View
            style={{
              margin: 5,
              width: '50%',
              alignSelf: 'center',
            }}>
            <Button
              title="View from source"
              color="green"
              onPress={() => {
                Linking.openURL(item.item.itemWebUrl);
              }}
            />
          </View>
        </View>
      );
    } else {
      return null;
    }
  };

  _onRefresh = async () => {
    this.setState({ ready: false });
    let data;
    for (let i = 0; i < this.list.length; i++) {
      if (this.list[i].site == 'Ebay') {
        let eBayLink =
          'https://api.ebay.com/buy/browse/v1/item/' + this.list[i].link;
        let responseEbay;
        let resultEbay;

        responseEbay = await fetch(eBayLink, {
          method: 'GET',
          headers: {
            Authorization: 'Bearer ' + this.state.apiData[1].access,
            'Content-Type': 'application/json',
          },
        });
        resultEbay = await responseEbay.json(); //itemSummaries has info as array
      } else {
        let etsyLink =
          'https://openapi.etsy.com/v2/listings/' + this.list[i].link;
        let responseEtsy;
        let resultEtsy;
        responseEtsy = await fetch(etsyLink);
        resultEtsy = await responseEtsy.json(); //results has info as array
        console.log(resultEtsy.results[0]);
      }
    }
  };

  render() {
    return (
      <View>
        <FlatList
          data={this.state.data}
          extraData={this.state}
          renderItem={item => this.returnCard(item)}
          keyExtractor={(item, index) => index}
          refreshControl={
            <RefreshControl
              refreshing={this.state.ready}
              onRefresh={this._onRefresh}
            />
          }
        />
      </View>
    );
  }
}
