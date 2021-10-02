import * as React from 'react';
import {
  Text,
  View,
  ImageBackground,
  Dimensions,
  TextInput,
  SectionList,
  Image,
  ScrollView,
  Button,
  RefreshControl,
  TouchableOpacity,
  Modal,
  CheckBox,
  WebView,
  Linking,
  Share,
} from 'react-native';
import { styles } from './App';
import { Entypo, MaterialIcons } from '@expo/vector-icons';
import { store } from './App';
import * as qs from 'querystring';
var CryptoJS = require('crypto-js');
import firebase from 'firebase';

export class Initial extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      height: Dimensions.get('window').height,
      width: Dimensions.get('window').width,
      data: [
        {
          title: 'Loading...',
          data: [
            {
              title: 'item',
            },
          ],
        },
      ],
      ready: false,
      readyInitial: false,
      filterModal: false,
      ebayTokenModal: false,
      text: '',
      siteOpen: true,
      sites: [
        {
          name: 'Amazon',
          ready: false,
          selected: true,
        },
        {
          name: 'Ebay',
          ready: false,
          selected: true,
        },
        {
          name: 'Etsy',
          ready: false,
          selected: true,
        },
        {
          name: 'Best Buy',
          ready: false,
          selected: true,
        },
      ],
      sortPrice: false,
      useMinPrice: false,
      useMaxPrice: false,
      minPrice: '1',
      maxPrice: '100',
      apiData: null,
    };
  }
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: 'Home',
      headerRight: (
        <View
          style={{
            padding: 10,
            flexDirection: 'row',
          }}>
          {/*<TouchableOpacity
            onPress={() => {
              navigation.navigate('Starred');
            }}>
            <MaterialIcons
              name="stars"
              size={35}
              color="white"
              style={{
                marginRight: 5,
              }}
            />
          </TouchableOpacity>*/}
          <Button
            title="Sign Out"
            color="green"
            onPress={() => {
              firebase
                .auth()
                .signOut()
                .then(() => {
                  navigation.replace('Login');
                })
                .catch(function(error) {
                  console.log(error);
                });
            }}
          />
        </View>
      ),
      headerTintColor: '#fff',
      headerStyle: {
        backgroundColor: '#3bad2e',
      },
    };
  };
  refresh = () => {
    this.setState({ ready: false });
    this.getBestBuy();
    this.getEbay();
    this.getEtsy();
  };
  getEtsy = async () => {
    try {
      //consider listings/trending or listings/interesting
      let response = await fetch(
        'https://openapi.etsy.com/v2/listings/trending?includes=Images&location=US&api_key=' +
          this.state.apiData[2].key
      );
      let result = await response.json();
      let data = this.state.data;
      data[1] = {
        title: 'Trending on Etsy',
        data: result.results,
      };
      let sites = this.state.sites;
      sites[2].ready = true;
      this.setState({
        data,
        ready: true,
        sites,
        readyInitial: true,
        search: '',
        filterModal: false,
      });
    } catch (error) {
      console.error(error);
    }
  };

  getEbay = async () => {
    try {
      let elapsedBeforeAccess =
        new Date().getTime() / 1000 -
        parseInt(this.state.apiData[1].accessTimeStamp);
      if (
        this.state.apiData[1].access.length == 0 ||
        elapsedBeforeAccess > 6900
      ) {
        let response = await (await fetch(
          'https://api.ebay.com/identity/v1/oauth2/token',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              Authorization: 'Basic ' + this.state.apiData[1].base64,
            },
            body: qs.stringify({
              grant_type: 'client_credentials',
              redirect_uri: this.state.apiData[1].runame,
              scope: 'https://api.ebay.com/oauth/api_scope',
            }),
          }
        )).json();
        console.log(response);
        let apiData = this.state.apiData;
        apiData[1].access = response.access_token;
        apiData[1].accessTimeStamp = new Date().getTime() / 1000 + '';
        //expires in 2 hours 7200
        apiData[1].refresh = response.refresh_token;
        apiData[1].refreshTimeStamp = new Date().getTime() / 1000 + '';
        //expires in 13140 hours 47304000
        this.setState({ apiData });
        store.setAPIData(apiData);
      } else {
        /*let response = await fetch(
          'https://api.ebay.com/buy/browse/v1/item_summary/search?q=shirt',
          {
            method: 'GET',
            headers: {
              Authorization: 'Bearer ' + this.state.apiData[1].access,
              'Content-Type': 'application/json',
            }
          }
        );
        let result = await response.json();
        console.log(JSON.stringify(result) + " f")
        alert(JSON.stringify(response));*/
      }
    } catch (error) {
      console.error(error);
    }
  };

  getBestBuy = async () => {
    try {
      let response = await fetch(
        'https://api.bestbuy.com/v1/products?sort=bestSellingRank.asc&show=bestSellingRank,categoryPath.id,categoryPath.name,condition,customerReviewAverage,customerReviewCount,description,dollarSavings,freeShipping,image,longDescription,manufacturer,mobileUrl,name,onSale,percentSavings,preowned,regularPrice,salePrice,shipping,shippingCost,shortDescription,sku,thumbnailImage,type,upc,url&pageSize=10&format=json&apiKey=' +
          this.state.apiData[3].key
      );
      let result = await response.json();
      let data = this.state.data;
      data[0] = {
        title: 'Trending on Best Buy',
        data: result.products,
      };
      let sites = this.state.sites;
      sites[3].ready = true;
      this.setState({
        data,
        ready: true,
        sites,
        readyInitial: true,
        search: '',
        filterModal: false,
      });
    } catch (error) {
      console.log(error);
    }
  };

  generateAmazonSignature = async () => {
    let d = new Date();
    let n = d.toISOString();
    let requestbody = encodeURIComponent(
      'Service=AWSECommerceService&AWSAccessKeyId=KIAITLWKUDQZJP72I4A&AssociateTag=tsabartowib-20&Operation=ItemSearch&Brand=Lacoste&Availability=Available&SearchIndex=FashionWomen&Keywords=shirts&Timestamp=' +
        n
    );
    let request2 = requestbody;
    let paramarray = requestbody.split('&');
    paramarray.sort();
    requestbody = paramarray.join('&');
    requestbody = 'GET\nwebservices.amazon.com\n/onca/xml' + requestbody;
    let signature2 = CryptoJS.HmacSHA256(
      requestbody,
      'Qu2QDvp21QaN/E5We4C+Rul2KnSOWoprL67iQvgO'
    ).toString(CryptoJS.enc.Base64);
    signature2 = encodeURI(signature2);
    request2 =
      'http://webservices.amazon.com/onca/xml?' +
      request2 +
      '&Signature=' +
      signature2;
    console.log(request2);
    let response = await fetch(request2);
    console.log(response);
  };

  componentDidMount = () => {
    store.getList();
    store.getAPIData(data => {
      this.setState(
        {
          apiData: data,
        },
        () => {
          this.refresh();
        }
      );
    });
  };

  returnCard = item => {
    if ((this.state.ready || this.state.readyInitial) && 'title' in item.item) {
      let title = item.item.title;
      let price = item.item.price;
      let currency_code = item.item.currency_code;
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
              justifyContent: 'center',
            }}>
            <View
              style={{
                flexDirection: 'column',
                padding: 5,
              }}>
              {'Images' in item.item ? (
                <Image
                  style={{
                    margin: 10,
                    height: 80,
                    width: 80,
                  }}
                  source={{ uri: images }}
                />
              ) : null}
              <Button
                title="View"
                color="green"
                onPress={() => {
                  Linking.openURL(item.item.url);
                }}
              />
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 'auto',
                }}>
                <TouchableOpacity
                  onPress={() => {
                    if (store.matches(item.item.listing_id)) {
                      store.removeList(item.item.listing_id);
                    } else {
                      store.addList(item.item.listing_id, 'Etsy');
                    }
                    this.setState({ reload: !this.state.reload });
                  }}>
                  <MaterialIcons
                    name={
                      store.matches(item.item.listing_id)
                        ? 'star'
                        : 'star-border'
                    }
                    size={30}
                    color={
                      store.matches(item.item.listing_id) ? '#f9c116' : null
                    }
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
            </View>
            <View
              style={{
                flexDirection: 'column',
                flex: 1,
                padding: 5,
                justifyContent: 'space-evenly',
              }}>
              <Text style={{ flex: 1 }}>
                {currency_code == 'USD'
                  ? '$' + price
                  : price + ' ' + currency_code}
              </Text>

              <Text numberOfLines={10} style={{ flex: 1 }}>
                {description}
              </Text>
            </View>
          </View>
        </View>
      );
    } else if (
      (this.state.ready || this.state.readyInitial) &&
      'name' in item.item
    ) {
      let title = item.item.name;
      let price = item.item.salePrice;
      let currency_code = 'USD';
      let images = item.item.image;
      let description = item.item.longDescription;
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
              justifyContent: 'center',
            }}>
            <View
              style={{
                flexDirection: 'column',
                padding: 5,
              }}>
              <Image
                style={{
                  margin: 10,
                  height: 80,
                  width: 80,
                }}
                source={{ uri: images }}
              />
              <Button
                title="View"
                color="green"
                onPress={() => {
                  Linking.openURL(item.item.mobileUrl);
                }}
              />
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 'auto',
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
            </View>
            <View
              style={{
                flexDirection: 'column',
                flex: 1,
                padding: 5,
                justifyContent: 'space-evenly',
              }}>
              <Text style={{ flex: 1 }}>
                {currency_code == 'USD'
                  ? '$' + price
                  : price + ' ' + currency_code}
              </Text>
              <Text numberOfLines={10} style={{ flex: 1 }}>
                {description}
              </Text>
            </View>
          </View>
        </View>
      );
    } else {
      return null;
    }
  };

  search = async text => {
    this.setState({ ready: false });
    let etsyLink =
      'https://openapi.etsy.com/v2/listings/active?includes=Images&limit=50&location=US&api_key=' +
      this.state.apiData[2].key +
      '&keywords=' +
      encodeURI(text);
    let eBayLink =
      'https://api.ebay.com/buy/browse/v1/item_summary/search?q=' +
      encodeURI(text);
    let splitQuery = text.split(' ');
    let bestBuyQuery = '((';
    for (let i = 0; i < splitQuery.length; i++) {
      if (i != 0) bestBuyQuery += '&';
      bestBuyQuery += 'search=' + encodeURI(splitQuery[i]);
    }
    bestBuyQuery += ')';
    if (this.state.useMaxPrice)
      bestBuyQuery += '&salePrice<=' + encodeURIComponent(this.state.maxPrice);
    if (this.state.useMinPrice)
      bestBuyQuery += '&salePrice>=' + encodeURIComponent(this.state.minPrice);
    bestBuyQuery += ')';
    let bestBuyLink =
      'https://api.bestbuy.com/v1/products' +
      bestBuyQuery +
      '?show=bestSellingRank,categoryPath.id,categoryPath.name,condition,customerReviewAverage,customerReviewCount,description,dollarSavings,freeShipping,image,longDescription,manufacturer,mobileUrl,name,onSale,percentSavings,preowned,regularPrice,salePrice,shipping,shippingCost,shortDescription,sku,thumbnailImage,type,upc,url&pageSize=50&format=json&apiKey=' +
      this.state.apiData[3].key +
      '&sort=' +
      (this.state.sortPrice ? 'salePrice' : 'bestSellingRank') +
      '.asc';
    if (this.state.sortPrice) {
      etsyLink += '&sort_on=price&sort_order=up';
      eBayLink += '&sort=price';
    }
    if (this.state.useMaxPrice && this.state.useMinPrice) {
      etsyLink += '&max_price=' + encodeURIComponent(this.state.maxPrice);
      etsyLink += '&min_price=' + encodeURIComponent(this.state.minPrice);
      eBayLink +=
        '&' +
        ('filter=deliveryCountry:US,priceCurrency:USD,price:[' +
          this.state.minPrice +
          '..' +
          this.state.maxPrice +
          ']');
    } else if (this.state.useMinPrice) {
      etsyLink += '&min_price=' + encodeURIComponent(this.state.minPrice);
      eBayLink +=
        '&' +
        ('filter=deliveryCountry:US,priceCurrency:USD,price:[' +
          this.state.minPrice +
          ']');
    } else if (this.state.useMaxPrice) {
      etsyLink += '&max_price=' + encodeURIComponent(this.state.maxPrice);
      eBayLink +=
        '&' +
        ('filter=deliveryCountry:US,priceCurrency:USD,price:[..' +
          this.state.maxPrice +
          ']');
    }
    etsyLink = encodeURI(etsyLink);
    eBayLink = encodeURI(eBayLink);
    bestBuyLink = encodeURI(bestBuyLink);
    let responseEbay;
    let resultEbay;
    let responseEtsy;
    let resultEtsy;
    let responseBestBuy;
    let resultBestBuy;
    if (this.state.sites[3].selected) {
      responseBestBuy = await fetch(bestBuyLink);
      resultBestBuy = await responseBestBuy.json(); //products has info as array
    }
    if (this.state.sites[2].selected) {
      responseEtsy = await fetch(etsyLink);
      resultEtsy = await responseEtsy.json(); //results has info as array
    }
    if (this.state.sites[1].selected) {
      responseEbay = await fetch(eBayLink, {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + this.state.apiData[1].access,
          'Content-Type': 'application/json',
        },
      });
      resultEbay = await responseEbay.json(); //itemSummaries has info as array
    }
    if (
      this.state.sites[1].selected ||
      this.state.sites[2].selected ||
      this.state.sites[3].selected
    ) {
      this.setState({ ready: true });
      let data = [];
      let ebayItem;
      let etsyItem;
      let bestBuyItem;
      let ebayLength = this.state.sites[1].selected
        ? resultEbay.itemSummaries.length
        : 0;
      let etsyLength = this.state.sites[2].selected
        ? resultEtsy.results.length
        : 0;
      let bestBuyLength = this.state.sites[3].selected
        ? resultBestBuy.products.length
        : 0;
      let count = Math.max(ebayLength, etsyLength, bestBuyLength);
      for (let i = 0; i < count; i++) {
        if (this.state.sites[1].selected) {
          if (resultEbay.itemSummaries.length - 1 >= i) {
            ebayItem = resultEbay.itemSummaries[i];
            ebayItem.site = 'Ebay';
            data.push(ebayItem);
          }
        }
        if (this.state.sites[3].selected) {
          if (resultBestBuy.products.length - 1 >= i) {
            bestBuyItem = resultBestBuy.products[i];
            bestBuyItem.site = 'Best Buy';
            data.push(bestBuyItem);
          }
        }
        if (this.state.sites[2].selected) {
          if (resultEtsy.results.length - 1 >= i) {
            etsyItem = resultEtsy.results[i];
            etsyItem.site = 'Etsy';
            data.push(etsyItem);
          }
        }
      }
      if (this.state.sortPrice) {
        let sortData = (item1, item2) => {
          let price1;
          if (item1.site == 'Etsy') {
            price1 = parseFloat(item1.price);
          } else if (item1.site == 'Best Buy') {
            price1 = parseFloat(item1.salePrice);
          } else {
            price1 = parseFloat(item1.price.value);
          }

          let price2;
          if (item2.site == 'Etsy') {
            price2 = parseFloat(item2.price);
          } else if (item2.site == 'Best Buy') {
            price2 = parseFloat(item2.salePrice);
          } else {
            price2 = parseFloat(item2.price.value);
          }
          return price1 - price2;
        };
        data.sort(sortData);
      }

      this.setState({ ready: true, text: '' });
      //navigate to results screen
      this.props.navigation.navigate('Results', {
        data,
        text,
      });
    } else {
      this.setState({ ready: true });
      alert(
        'No sites have been included in the search. Please check the search filters.'
      );
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Modal
          visible={this.state.ebayTokenModal}
          transparent={true}
          onRequestClose={() => {}}>
          <View
            style={{
              flex: 1,
              backgroundColor: '#000000cc',
            }}>
            <View
              style={{
                flex: 1,
                marginTop: 70,
                marginLeft: 10,
                marginRight: 10,
                marginBottom: 20,
                borderWidth: 2,
                backgroundColor: '#ffffff',
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 15,
                }}>
                Please sign in to eBay. eBay will not grant this app your
                password or secure account information.
              </Text>
              <WebView
                source={{
                  uri:
                    'https://auth.ebay.com/oauth2/authorize?client_id=SachinSi-TSASoftw-PRD-1c22b8256-03d91dd1&response_type=code&redirect_uri=Sachin_Sivakuma-SachinSi-TSASof-undmm&prompt=login&scope=https://api.ebay.com/oauth/api_scope ',
                }}
                onNavigationStateChange={async event => {
                  var vars = {};
                  var parts = event.url.replace(
                    /[?&]+([^=&]+)=([^&]*)/gi,
                    function(m, key, value) {
                      vars[key] = value;
                    }
                  );
                  if ('isAuthSuccessful' in vars && vars['isAuthSuccessful']) {
                    let response = await (await fetch(
                      'https://api.ebay.com/identity/v1/oauth2/token',
                      {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/x-www-form-urlencoded',
                          Authorization:
                            'Basic ' + this.state.apiData[1].base64,
                        },
                        body: qs.stringify({
                          grant_type: 'authorization_code',
                          code: decodeURIComponent(vars['code']),
                          redirect_uri: this.state.apiData[1].runame,
                        }),
                      }
                    )).json();
                    console.log(response);
                    let apiData = this.state.apiData;
                    apiData[1].access = response.access_token;
                    apiData[1].accessTimeStamp =
                      new Date().getTime() / 1000 + '';
                    //expires in 2 hours 7200
                    apiData[1].refresh = response.refresh_token;
                    apiData[1].refreshTimeStamp =
                      new Date().getTime() / 1000 + '';
                    //expires in 13140 hours 47304000
                    this.setState({ apiData, ebayTokenModal: false });
                    store.setAPIData(apiData);
                  }
                }}
              />
            </View>
          </View>
        </Modal>
        <Modal
          visible={this.state.filterModal && this.state.ready}
          onRequestClose={() => {
            this.setState({ filterModal: false });
          }}
          transparent={true}
          animationType="slide"
          swipeDirection="bottom"
          onSwipe={() => {
            this.setState({ filterModal: false });
          }}>
          <TouchableOpacity
            style={{
              height: this.state.height * 0.4,
              backgroundColor: '#000000a0',
            }}
            onPress={() => {
              this.setState({ filterModal: false });
            }}
            activeOpacity={1}
          />
          <View
            style={{
              backgroundColor: '#e0e0eb',
              flex: 1,
              alignItems: 'center',
            }}>
            <View
              style={{
                flexDirection: 'row',
              }}>
              <MaterialIcons
                name="close"
                color="transparent"
                style={{
                  padding: 5,
                }}
              />
              <Text
                style={{
                  fontSize: 25,
                  fontWeight: 'bold',
                  flex: 1,
                  textAlign: 'center',
                }}>
                Filters
              </Text>
              <TouchableOpacity
                style={{
                  padding: 5,
                }}
                onPress={() => {
                  this.setState({ filterModal: false });
                }}>
                <MaterialIcons name="close" size={25} />
              </TouchableOpacity>
            </View>
            <ScrollView
              style={{
                width: '100%',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                style={{
                  alignItems: 'center',
                  width: '90%',
                  backgroundColor: '#aaaaaf',
                  marginTop: 10,
                  borderRadius: 5,
                  flexDirection: 'row',
                }}
                onPress={() => {
                  let open = this.state.siteOpen;
                  this.setState({ siteOpen: !open });
                }}>
                <View
                  style={{
                    paddingLeft: 5,
                  }}>
                  <Entypo
                    name={this.state.siteOpen ? 'minus' : 'plus'}
                    size={25}
                  />
                </View>
                <Text
                  style={{
                    fontSize: 20,
                    textAlign: 'center',
                    margin: 5,
                    flex: 1,
                  }}>
                  Sites
                </Text>
                <View
                  style={{
                    paddingRight: 5,
                  }}>
                  <Entypo name="plus" color="transparent" size={25} />
                </View>
              </TouchableOpacity>
              {this.state.sites.map((site, index) => {
                if (this.state.siteOpen && index != 0) {
                  return (
                    <TouchableOpacity
                      style={{
                        alignItems: 'center',
                        width: '80%',
                        backgroundColor: '#aaaaaf',
                        borderWidth: 0.5,
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        alignSelf: 'center',
                      }}
                      onPress={() => {
                        let sites = this.state.sites;
                        sites[index].selected = !sites[index].selected;
                        this.setState({ sites });
                      }}>
                      <CheckBox
                        value={this.state.sites[index].selected}
                        checkedColor="red"
                        onValueChange={() => {
                          let sites = this.state.sites;
                          sites[index].selected = !sites[index].selected;
                          this.setState({ sites });
                        }}
                      />
                      <Text
                        style={{
                          textAlign: 'center',
                          padding: 5,
                          marginRight: 'auto',
                        }}>
                        {site.name}
                      </Text>
                    </TouchableOpacity>
                  );
                }
              })}
              <TouchableOpacity
                style={{
                  alignItems: 'center',
                  width: '90%',
                  backgroundColor: '#aaaaaf',
                  marginTop: 10,
                  borderRadius: 5,
                  flexDirection: 'row',
                }}
                onPress={() => {
                  let sortPrice = this.state.sortPrice;
                  this.setState({ sortPrice: !sortPrice });
                }}>
                <CheckBox
                  value={this.state.sortPrice}
                  onValueChange={() => {
                    let sortPrice = this.state.sortPrice;
                    this.setState({ sortPrice: !sortPrice });
                  }}
                />
                <Text
                  style={{
                    textAlign: 'center',
                    padding: 5,
                    marginRight: 'auto',
                  }}>
                  Sort By Price
                </Text>
              </TouchableOpacity>
              <View
                style={{
                  width: '90%',
                  backgroundColor: '#aaaaaf',
                  marginTop: 10,
                  borderRadius: 5,
                  flexDirection: 'row',
                }}>
                <CheckBox
                  value={this.state.useMinPrice}
                  onValueChange={() => {
                    let useMinPrice = !this.state.useMinPrice;
                    this.setState({ useMinPrice });
                  }}
                />
                <Text
                  style={{
                    textAlign: 'center',
                    padding: 5,

                    alignSelf: 'center',
                  }}>
                  Minimum Price: $
                </Text>
                <TextInput
                  value={this.state.minPrice}
                  style={{
                    marginRight: 'auto',
                    alignSelf: 'center',
                  }}
                  onBlur={() => {
                    if (this.state.minPrice.length == 0) {
                      this.setState({
                        minPrice: '1',
                      });
                    }
                  }}
                  onChangeText={val => {
                    if (val.length == 0) return;
                    this.setState({
                      minPrice:
                        val.length == 0
                          ? '1'
                          : parseInt(val.replace(/[^0-9]/g, '')).toString(),
                    });
                    return;
                  }}
                  keyboardType="numeric"
                />
              </View>
              <View
                style={{
                  width: '90%',
                  backgroundColor: '#aaaaaf',
                  marginTop: 10,
                  borderRadius: 5,
                  flexDirection: 'row',
                }}>
                <CheckBox
                  value={this.state.useMaxPrice}
                  onValueChange={() => {
                    let useMaxPrice = !this.state.useMaxPrice;
                    this.setState({ useMaxPrice });
                  }}
                />
                <Text
                  style={{
                    textAlign: 'center',
                    padding: 5,

                    alignSelf: 'center',
                  }}>
                  Maximum Price: $
                </Text>
                <TextInput
                  value={this.state.maxPrice}
                  style={{
                    marginRight: 'auto',
                    alignSelf: 'center',
                  }}
                  onBlur={() => {
                    if (this.state.maxPrice.length == 0) {
                      this.setState({
                        maxPrice: '100',
                      });
                    }
                  }}
                  onChangeText={val => {
                    if (val.length == 0) return;
                    this.setState({
                      maxPrice:
                        val.length == 0
                          ? '100'
                          : parseInt(val.replace(/[^0-9]/g, '')).toString(),
                    });
                    return;
                  }}
                  keyboardType="numeric"
                />
              </View>
            </ScrollView>
          </View>
        </Modal>
        <ImageBackground
          style={{
            height: this.state.height - 55,
            width: this.state.width,
            alignItems: 'center',
            //opacity: this.state.filterModal ? 0.5 : 1
          }}
          resizeMode="cover"
          source={require('/assets/shopping.jpg')}>
          <View
            style={{
              width: this.state.width * 0.8,
              height: this.state.height * 0.07,
              backgroundColor: '#fff',
              borderWidth: 1,
              borderRadius: 5,
              alignItems: 'center',
              marginTop: this.state.height * 0.03,
              flexDirection: 'row',
              justifyContent: 'space-evenly',
            }}>
            <TextInput /* search bar */
              style={{
                flex: 1,
                width: '100%',
                paddingLeft: 15,
              }}
              underlineColorAndroid="transparent"
              autoCapitalize="sentences"
              autoCorrect={true}
              selectTextOnFocus={true}
              placeholder="Search for your goods"
              onChangeText={text => {
                if (/^[\w\-\s]+$/.test(text)) {
                  this.setState({ text });
                }
              }}
              value={this.state.text}
              onSubmitEditing={() => {
                console.log('Searching for: ' + this.state.text);
                if (this.state.text.length !== 0) {
                  this.search(this.state.text);
                }
              }}
            />
            <TouchableOpacity
              style={{
                margin: 5,
              }}
              onPress={() => {
                this.setState(prevState => {
                  return {
                    filterModal: !prevState.filterModal,
                  };
                });
              }}>
              <MaterialIcons name="filter-list" size={25} />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                margin: 5,
              }}
              onPress={() => {
                console.log('Searching for: ' + this.state.text);
                if (this.state.text.length !== 0) {
                  this.search(this.state.text);
                }
              }}>
              <MaterialIcons name="search" size={25} />
            </TouchableOpacity>
          </View>
          <View
            style={{
              backgroundColor: '#fff',
              alignItems: 'center',
              padding: 10,
              width: '85%',
              marginTop: this.state.height * 0.034,
              borderWidth: 1,
              borderRadius: 5,
              flex: 1,
              marginBottom: this.state.height * 0.08,
            }}>
            <SectionList
              style={{
                width: '100%',
              }}
              refreshControl={
                <RefreshControl
                  refreshing={!this.state.ready}
                  onRefresh={this.refresh}
                />
              }
              renderItem={item => this.returnCard(item)}
              keyExtractor={(item, index) => item + index}
              renderSectionHeader={({ section: { title } }) => (
                <View
                  style={{
                    padding: 7,
                    backgroundColor: '#a4c639',
                    borderRadius: 100,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <MaterialIcons name="refresh" color="transparent" size={25} />
                  <Text
                    style={{
                      textAlign: 'center',
                      color: 'white',
                      fontWeight: 'bold',
                      alignSelf: 'center',
                    }}>
                    {title}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      this.refresh();
                    }}>
                    <MaterialIcons name="refresh" color="white" size={25} />
                  </TouchableOpacity>
                </View>
              )}
              sections={this.state.data}
            />
          </View>
        </ImageBackground>
      </View>
    );
  }
}
