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
  Share,
} from 'react-native';
import { store } from './App';
import { MaterialIcons, Entypo } from '@expo/vector-icons';
import firebase from 'firebase';

export class Results extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.navigation.getParam('data'),
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
      search: this.props.navigation.getParam('text'),
      reload: false,
    };
  }

  componentDidMount = () => {
    store.getList();
  };

  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      headerTitle: "Results for '" + navigation.getParam('text') + "'",
      headerTintColor: '#fff',
      headerStyle: {
        backgroundColor: '#3bad2e',
      },
    };
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
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity
              onPress={() => {
                if (store.matches(item.item.url)) {
                  store.removeList(item.item.url);
                } else {
                  store.addList(item.item.url, 'Etsy');
                }
                this.setState({ reload: !this.state.reload });
              }}>
              <MaterialIcons
                name={store.matches(item.item.url) ? 'star' : 'star-border'}
                size={30}
                color={store.matches(item.item.url) ? '#f9c116' : null}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                Share.share(
                  {
                    message:
                      'Check out this Etsy item I found on YouShop!\n' +
                      item.item.url,
                  },
                  { dialogTitle: 'Share this product' }
                );
              }}>
              <Entypo name="share" size={30} />
            </TouchableOpacity>
          </View>
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
            <View
              style={{
                flexDirection: 'row',
              }}>
              <TouchableOpacity
                onPress={() => {
                  if (store.matches(item.item.item_id)) {
                    store.removeList(item.item.item_id);
                  } else {
                    store.addList(item.item.item_id, 'Ebay');
                  }
                  this.setState({ reload: !this.state.reload });
                }}>
                <MaterialIcons
                  name={
                    store.matches(item.item.item_id) ? 'star' : 'star-border'
                  }
                  size={30}
                  color={store.matches(item.item.item_id) ? '#f9c116' : null}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  Share.share(
                    {
                      message:
                        'Check out this eBay item I found on YouShop!\n' +
                        item.item.itemWebUrl,
                    },
                    { dialogTitle: 'Share this product' }
                  );
                }}>
                <Entypo name="share" size={30} />
              </TouchableOpacity>
            </View>
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
    } else if (item.item.site == 'Best Buy') {
      let title = item.item.name;
      let price = item.item.salePrice;
      let currency_code = 'USD';
      let condition = item.item.condition;
      let images = item.item.image;
      let description = decodeURIComponent(item.item.longDescription);
      let seller = item.item.manufacturer;
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
                flex: 1,
                padding: 5,
              }}>
              <Text style={{ padding: 5, fontSize: 15 }}>
                Manufacturer: {seller}
              </Text>
              <Text style={{ padding: 5, fontSize: 15 }} numberOfLines={12}>
                Description: {description}
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
            }}>
            <TouchableOpacity
              onPress={() => {
                if (store.matches(item.item.sku)) {
                  store.removeList(item.item.sku);
                } else {
                  store.addList(item.item.sku, 'Best Buy');
                }
                this.setState({ reload: !this.state.reload });
              }}>
              <MaterialIcons
                name={store.matches(item.item.sku) ? 'star' : 'star-border'}
                size={30}
                color={store.matches(item.item.sku) ? '#f9c116' : null}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                Share.share(
                  {
                    message:
                      'Check out this Best Buy item I found on YouShop!\n' +
                      item.item.mobileUrl,
                  },
                  { dialogTitle: 'Share this product' }
                );
              }}>
              <Entypo name="share" size={30} />
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: 'row',
              margin: 10,
            }}>
            {price - item.item.regularPrice < 0 ? (
              <Text
                style={{
                  textDecorationLine: 'line-through',
                  textDecorationStyle: 'solid',
                  fontSize: 20,
                  color: '#9e0c0c',
                  fontWeight: 'bold',
                  alignSelf: 'center',
                  marginRight: 5,
                }}>
                ${item.item.regularPrice}
              </Text>
            ) : null}
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
              margin: 5,
              width: '50%',
              alignSelf: 'center',
            }}>
            <Button
              title="View from source"
              color="green"
              onPress={() => {
                Linking.openURL(item.item.mobileUrl);
              }}
            />
          </View>
        </View>
      );
    } else {
      return null;
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
        />
      </View>
    );
  }
}
