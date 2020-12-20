import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  Alert,
  BackHandler,
  ImageBackground,
  Dimensions,
  Modal,
} from "react-native";
import Button from "react-native-button";
import StarRating from "react-native-star-rating";
import FastImage from "react-native-fast-image";
import { firebaseListing } from "../firebase";
import { connect } from "react-redux";
import ActionSheet from "react-native-actionsheet";
import {
  AppIcon,
  AppStyles,
  HeaderButtonStyle,
  TwoColumnListStyle,
} from "../AppStyles";
import { Configuration } from "../Configuration";
import { IMLocalized } from "../Core/localization/IMLocalization";
import DynamicAppStyles from "../DynamicAppStyles";
import ListingAppConfig from "../ListingAppConfig";
import Carousel, { ParallaxImage } from "react-native-snap-carousel";
import HeaderButton from "../components/HeaderButton";
import HomeSkeletonLoader from "../Core/truly-native/HomeSkeletonLoader/HomeSkeletonLoader";
import CategoryResourceLoader from "../Core/truly-native/HomeSkeletonLoader/CategoryResourceLoader";
import TransactionResourceLoader from "../Core/truly-native/HomeSkeletonLoader/TransactionResourceLoader";
import { addTokenToHeader } from "../API/requestManager";
import OperationsLoader from "../Core/truly-native/OperationsLoader/OperationsLoader";
import {
  getCardsByUserId,
  getResourcesByCardId,
  getTransactionByCategoryId,
} from "../API/requestManager";
import SInfo from "react-native-sensitive-info";

const { width, height } = Dimensions.get("window");
class HomeScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    headerTransparent: true,
    headerTintColor: "#fff",
    headerMode: "screen",
    headerLeft: () => {
      return (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("MyProfile");
          }}
        >
          {navigation.state.params && navigation.state.params.menuIcon ? (
            <FastImage
              style={styles.userPhoto}
              resizeMode={FastImage.resizeMode.cover}
              source={{ uri: navigation.state.params.menuIcon }}
            />
          ) : (
            <FastImage
              style={styles.userPhoto}
              resizeMode={FastImage.resizeMode.cover}
              source={DynamicAppStyles.iconSet.userAvatar}
            />
          )}
        </TouchableOpacity>
      );
    },
    headerRight: (
      <View style={HeaderButtonStyle.multi}>
        <HeaderButton
          customStyle={styles.composeButton}
          icon={DynamicAppStyles.iconSet.notifications}
          // onPress={() => {
          //   navigation.state.params.onPressPost();
          // }}
        />
        {/* <HeaderButton
          customStyle={styles.mapButton}
          icon={DynamicAppStyles.iconSet.map}
          onPress={() => {
            navigation.navigate("Map");
          }}
        /> */}
      </View>
    ),
  });

  constructor(props) {
    super(props);

    this.listingItemActionSheet = React.createRef();
    // this.requestsManager = new RequestsManager();

    this.state = {
      activeCardId: 0,
      categories: [],
      listings: [],
      allListings: [],
      savedListings: [],
      selectedItem: null,
      showedAll: false,
      postModalVisible: false,
      cardsData: [],
      isLoading: false,
      isCategoryLoading: false,
      isTransactionLoading: false,
      userHasNoData: true,
      categoryResources: [],
      transactionResources: [],
      categoriesActiveSlide: 0,
    };

    this.didFocusSubscription = props.navigation.addListener(
      "didFocus",
      (payload) =>
        BackHandler.addEventListener(
          "hardwareBackPress",
          this.onBackButtonPressAndroid
        )
    );
  }

  async fetchCards() {
    await addTokenToHeader();
    getCardsByUserId(this.props.user.id)
      .then((response) => {
        if (response && response.data && response.data.length > 0) {
          const cardsData = response.data.map((cardsData) => ({
            cardId: cardsData.id,
            bankName: cardsData.bankNameAr,
            cardNumber: cardsData.cardNNumber,
            incomingAmount: cardsData.incomingAmount,
            outcomingAmount: cardsData.outcomingAmount,
            bankBackground: cardsData.bank.icon,
            bankLogo: cardsData.bank.icon2,
            currency: cardsData.currency,
            // bankLogo: "https://theinpaint.com/editor/1292720853/TNARd6Gze/",
          }));
          this.getAllCategoriesResources(cardsData[0].cardId);
          this.setState({
            cardsData,
            userHasNoData: false,
            activeCardId: cardsData[0].cardId,
          });
        } else {
          this.setState({ userHasNoData: true, isLoading: false });
        }
      })
      .catch((err) => {
        debugger;
      });
  }

  getAllCategoriesResources(cardId) {
    this.setState({ isCategoryLoading: true });
    getResourcesByCardId(cardId)
      .then((response) => {
        const categoriesData =
          response.data.length > 0 &&
          response.data.map((resourcesData) => ({
            categoryId: resourcesData.id,
            descAr: resourcesData.descAr,
            nameAr: resourcesData.nameAr,
            totalAmount: resourcesData.totalAmount,
            logo: resourcesData.logo,
          }));
        this.setState({ isCategoryLoading: false });
        if (categoriesData && categoriesData.length > 0) {
          this.getAllTransactionsResourcesByCategoryId(
            categoriesData[0].categoryId
          );
          this.setState({
            categoryResources: categoriesData,
          });
        }
      })
      .catch((err) => {
        debugger;
        this.setState({ isCategoryLoading: false });
      });
  }

  getAllTransactionsResourcesByCategoryId(categoryId) {
    this.setState({ isTransactionLoading: true });
    getTransactionByCategoryId(
      this.props.user.id,
      this.state.activeCardId,
      categoryId
    )
      .then((response) => {
        const transactionResources = response.data.content.map(
          (transactionData) => ({
            // descAr: transactionData.descAr,
            nameAr: transactionData.nameAr,
            amount: transactionData.amount,
            createdDate: new Date(transactionData.createdDate).toGMTString(),
          })
        );
        this.setState({
          transactionResources,
          isTransactionLoading: false,
          isLoading: false,
        });
      })
      .catch((err) => {
        this.setState({ isTransactionLoading: false, isLoading: false });
      });
  }

  async componentDidMount() {
    this.setState({ isLoading: true, userHasNoData: true });
    await this.fetchCards();

    this.willBlurSubscription = this.props.navigation.addListener(
      "willBlur",
      (payload) =>
        BackHandler.removeEventListener(
          "hardwareBackPress",
          this.onBackButtonPressAndroid
        )
    );
  }

  componentWillUnmount() {
    // this.listingsUnsubscribe();
    // this.didFocusSubscription && this.didFocusSubscription.remove();
    // this.willBlurSubscription && this.willBlurSubscription.remove();
  }

  onBackButtonPressAndroid = () => {
    BackHandler.exitApp();
    return true;
  };

  onPostCancel = () => {
    this.setState({ postModalVisible: false });
  };
  onPressListingItem = (item) => {
    this.props.navigation.navigate("Detail", {
      item: item,
      customLeft: true,
      routeName: "Home",
    });
  };

  saveCardData = (userId) => {
    SInfo.setItem(
      userId,
      JSON.stringify(this.state.cardsData[0].cardNumber),
      {}
    ).then(() => {
      Alert.alert(
        "cards data saved locally with sensitive info",
        this.state.cardsData[0].cardNumber,
        [{ text: IMLocalized("OK") }],
        {
          cancelable: false,
        }
      );
    });
  };

  getCardData = () => {
    const activeCardID = SInfo.getItem(this.props.user.id, {});
    Alert.alert(activeCardID, [{ text: IMLocalized() }], {
      cancelable: false,
    });
  };

  _renderBankCard = ({ item }, parallaxProps) => {
    if (!item) {
      return null;
    }
    return (
      <View style={styles.cardsSliderShadow}>
        <FastImage
          style={styles.parallaxPhotoItem}
          containerStyle={[styles.parallaxImageContainer]}
          source={{
            uri: item.bankBackground,
          }}
          resizeMode={FastImage.resizeMode.stretch}
        />
        <FastImage
          style={styles.bankLogo}
          source={{
            uri: item.bankLogo,
          }}
          resizeMode={FastImage.resizeMode.cover}
          {...parallaxProps}
        />
        {/* <View> */}
        <Text style={styles.accountNumber}>{item.cardNumber}</Text>
        <Text style={styles.bankIncome}>
          {Number(item.incomingAmount).toFixed(2)}
        </Text>
        <FastImage
          style={styles.incomeIndicator}
          source={DynamicAppStyles.iconSet.incomeLogo}
        />

        <Text style={styles.bankOutcome}>
          {Number(item.outcomingAmount).toFixed(2)}
        </Text>
        <FastImage
          style={styles.outcomeIndicator}
          source={DynamicAppStyles.iconSet.outcomeLogo}
        />
      </View>
    );
  };

  _changeCard = (index) => {
    const cardId = this.state.cardsData[index].cardId;
    this.getAllCategoriesResources(cardId);
    this.setState({ activeCardId: cardId });
  };

  _changeTransactionResource = (index) => {
    const categoryId = this.state.categoryResources[index].categoryId;
    this.setState({ categoriesActiveSlide: index, isTransactionLoading: true });
    this.getAllTransactionsResourcesByCategoryId(categoryId);
  };

  _renderCategories = ({ item, index }) => {
    if (!item) {
      return null;
    }
    return (
      <View style={styles.categoryResourceWrapper}>
        <View style={styles.categoryPhotoWrapper}>
          <FastImage
            style={styles.categoryPhoto}
            resizeMode={FastImage.resizeMode.cover}
            source={DynamicAppStyles.iconSet.foodRestaurants}
          />
        </View>
        <View style={{ flex: 4 }}>
          <Text style={styles.categoryResourceTitle}>{item.nameAr}</Text>
          <Text style={styles.categoryResourceExamples}>{item.descAr}</Text>
        </View>
        <View style={styles.categoryResourceAmount}>
          <Text style={styles.categoryResourceAmount}>
            {Number(item.totalAmount).toFixed(2)}
          </Text>
        </View>
      </View>
    );
  };

  render() {
    const {
      activeCardId,
      isLoading,
      isCategoryLoading,
      isTransactionLoading,
      userHasNoData,
    } = this.state;
    const { user } = this.props;

    return (
      <ScrollView style={styles.container} nestedScrollEnabled={true}>
        <ImageBackground
          style={{
            height: height - 100,
            width: width,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: -1,
          }}
          source={DynamicAppStyles.iconSet.homeBackground}
        >
          {userHasNoData && !isLoading && (
            <OperationsLoader appStyles={DynamicAppStyles}></OperationsLoader>
          )}
          <>
            {!userHasNoData && (
              <View style={styles.savingsWrapper}>
                <Text numberOfLines={3} style={styles.savingsTitle}>
                  مجموع المدفوعات
                </Text>
                <View style={styles.savingsCountWrapper}>
                  <Text numberOfLines={3} style={styles.savingsCount}>
                    {Number(user.totalSavings).toFixed(2)}
                  </Text>
                  <Text style={styles.savingsCurrency}>ريال </Text>
                </View>
                <View style={styles.savingsCountWrapper}>
                  <FastImage
                    style={styles.savingsImage}
                    resizeMode={FastImage.resizeMode.contain}
                    source={DynamicAppStyles.iconSet.savingsLogo}
                  />
                </View>
              </View>
            )}

            <View style={styles.carouselContainer}>
              <Carousel
                ref={(c) => {
                  this._cardsSliderRef = c;
                }}
                layout={"default"}
                data={this.state.cardsData}
                renderItem={this._renderBankCard}
                sliderWidth={width}
                itemWidth={width * 0.9}
                decelerationRate={"fast"}
                loop={false}
                autoplay={false}
                autoplayDelay={500}
                autoplayInterval={3000}
                onSnapToItem={this._changeCard}
                firstItem={0}
                keyExtractor={(item) => item.cardId}
                inactiveSlideScale={0.99}
                // hasParallaxImages={true}
                // inactiveSlideOpacity={1}
                // containerCustomStyle={{ flex: 0 }}
                // contentContainerCustomStyle={{ height: 200 }}
                // enableMomentum={false}
                // loopClonesPerSide={2}
                // windowSize={1}
              />
            </View>
            {!isCategoryLoading && !userHasNoData && (
              <>
                <Text style={styles.title}>العمليات</Text>
                <Button
                  // containerStyle={styles.loginContainer}
                  // style={styles.loginText}
                  onPress={() => this.saveCardData(this.props.user.id)}
                  disabledContainerStyle={{ backgroundColor: "#ccc" }}
                >
                  save current card sensitive data
                </Button>
                <View style={styles.categoryCarouselContainer}>
                  <Carousel
                    ref={(c) => {
                      this._categoriesSliderRef = c;
                    }}
                    layout={"default"}
                    data={this.state.categoryResources}
                    renderItem={this._renderCategories}
                    onSnapToItem={this._changeTransactionResource}
                    sliderWidth={width}
                    itemWidth={width}
                    decelerationRate={"fast"}
                    hasParallaxImages={true}
                    loop={false}
                    autoplay={false}
                    autoplayDelay={500}
                    autoplayInterval={3000}
                    firstItem={0}
                  />
                </View>
                {!isTransactionLoading && (
                  <View style={{ maxHeight: 250 }}>
                    <ScrollView
                      onTouchStart={(ev) => {}}
                      onMomentumScrollEnd={(e) => {}}
                      onScrollEndDrag={(e) => {}}
                      nestedScrollEnabled={true}
                    >
                      {this.state.transactionResources.length === 0 && (
                        <Text style={styles.noOperations}>لا توجد عمليات</Text>
                      )}
                      {this.state.transactionResources.map((item, key) => (
                        <View key={key} style={{ height: 70 }}>
                          <View style={styles.transactionRow}>
                            <View style={styles.transactionItem}>
                              <Text style={styles.transactionItemTitle}>
                                {item.nameAr}
                              </Text>
                              <Text style={styles.transactionItemDate}>
                                {item.createdDate}
                              </Text>
                            </View>
                            <View style={styles.transactionAmount}>
                              <Text style={styles.transactionAmountValue}>
                                - {Number(item.amount).toFixed(2)}
                              </Text>
                              <Text style={styles.transactionAmountCurrency}>
                                ريال
                              </Text>
                            </View>
                          </View>
                        </View>
                      ))}
                    </ScrollView>
                  </View>
                )}
                {isTransactionLoading && <TransactionResourceLoader />}
              </>
            )}
            {isCategoryLoading && <CategoryResourceLoader />}
          </>
        </ImageBackground>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    // fontFamily: AppStyles.arabicFont.main,
    fontFamily: "sst-arabic-medium",
  },
  title: {
    fontWeight: "600",
    color: AppStyles.color.title,
    fontSize: 20,
    alignSelf: "flex-start",
    ...Platform.select({
      ios: { paddingLeft: 20 },
      android: { paddingRight: 20 },
    }),
  },

  categories: {
    marginBottom: 7,
  },
  categoryItemContainer: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    paddingBottom: 10,
    backgroundColor: "transparent",
  },
  categoryItemPhoto: {
    height: 60,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    width: 110,
  },
  categoryItemTitle: {
    fontFamily: AppStyles.fontName.bold,
    fontWeight: "bold",
    color: AppStyles.color.categoryTitle,
    margin: 10,
  },
  userPhoto: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginLeft: 10,
  },
  mapButton: {
    marginRight: 13,
    marginLeft: 7,
  },
  composeButton: {
    borderRadius: 40,
    width: 45,
    height: 45,
    backgroundColor: "#F4F4F4",
  },
  starStyle: {
    tintColor: DynamicAppStyles.colorSet.mainThemeForegroundColor,
  },
  starRatingContainer: {
    width: 90,
    marginTop: 10,
  },
  // photoItem: {
  //   backgroundColor: AppStyles.color.grey,
  //   height: 250,
  //   width: "100%",
  // },
  parallaxPhotoItem: {
    // opacity: 0.5,
    width: width - 50, //fallback
    height: 190,
    borderRadius: 10,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
  },

  cardsSlideInnerContainer: {
    width: width,
    height: height * 0.36,
    paddingHorizontal: Math.round((2 * width) / 100),
    paddingBottom: 18, // needed for shadow
  },

  parallaxImageContainer: {
    flex: 1,
  },
  cardsSliderShadow: {
    marginBottom: Platform.select({ ios: 0, android: 1 }), // Prevent a random Android rendering issue
    borderRadius: 7,
    shadowColor: "#000",
    shadowOffset: {
      width: 8,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 16,
  },
  parallaxImage: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: "cover",
  },
  carouselContainer: {
    flexGrow: 0,
    height: 220,
    width: width,
    // width: width - 10,
  },
  savingsWrapper: {
    // flex: 0.18,
    flex: 1,
    minHeight: 91,
    resizeMode: "contain",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    maxHeight: 91,
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
    justifyContent: "center",
    alignItems: "flex-start",
    textAlignVertical: "center",
    textAlign: "center",
    alignContent: "center",
    alignSelf: "center",
    borderRadius: 6,
    width: "80%",
    ...Platform.select({
      ios: { marginTop: 100 },
      android: { marginTop: 70 },
    }),
    marginBottom: 10,
    paddingLeft: 30,
    backgroundColor: "#fff",
  },

  savingsTitle: {
    color: "#AEB4C9",
    fontSize: 17,
    fontWeight: "500",
    fontFamily: AppStyles.fontName.bold,
    textAlign: "center",
    paddingLeft: 30,
  },
  savingsCountWrapper: {
    flexDirection: "row",
    paddingTop: 10,
  },
  savingsCount: {
    color: "#FF5FA7",
    paddingLeft: 30,
    fontSize: 22,
    fontWeight: "800",
  },
  savingsCurrency: {
    color: "#AEB4C9",
    fontSize: 14,
    fontWeight: "600",
    paddingLeft: 10,
    paddingTop: 5,
  },
  savingsImage: {
    width: 50,
    height: 50,
    paddingLeft: 100,
    position: "absolute",
    bottom: 1,
    left: 200,
  },
  accountNumber: {
    position: "absolute",
    top: 90,
    right: 50,
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
  bankLogo: {
    position: "absolute",
    width: 112,
    height: 32,
    top: 34,
    left: 15,
    alignSelf: "center",
  },
  bankIncome: {
    position: "absolute",
    top: 120,
    left: 40,
    fontWeight: "900",
    fontSize: 22,
    color: "#fff",
  },

  incomeCardSavingCurrency: {
    position: "absolute",
    color: "#AEB4C9",
    top: 120,
    right: 10,
    fontSize: 18,
    fontWeight: "400",
  },
  outcomeCardSavingCurrency: {
    position: "absolute",
    color: "#AEB4C9",
    top: 120,
    left: 130,
    fontSize: 18,
    fontWeight: "400",
  },
  incomeIndicator: {
    position: "absolute",
    width: 25,
    height: 25,
    top: 120,
    left: 10,
    alignSelf: "center",
  },
  outcomeIndicator: {
    position: "absolute",
    width: 25,
    height: 25,
    top: 120,
    right: 182,
    alignSelf: "center",
  },
  bankOutcome: {
    position: "absolute",
    top: 120,
    right: 57,
    fontWeight: "900",
    fontSize: 22,
    color: "#fff",
  },
  categoryCarouselContainer: {
    flexGrow: 0,
    height: 150,
  },
  categoryResourceWrapper: {
    flexDirection: "row",
    justifyContent: "flex-start",
    width: width - 80,
    resizeMode: "contain",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
    justifyContent: "center",
    textAlign: "center",
    alignContent: "center",
    alignSelf: "center",
    borderRadius: 10,
    width: "90%",
    marginTop: 30,
    marginBottom: 10,
    paddingLeft: 30,
    backgroundColor: "#fff",
    height: 70,
  },
  categoryPhoto: {
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 12,
    right: 13,
  },
  categoryPhotoWrapper: {
    borderRadius: 205,
    flex: 1,
    justifyContent: "flex-start",
    backgroundColor: "#F5A522",
    height: 50,
    left: 0,
  },
  categoryResourceTitle: {
    color: "black",
    fontSize: 18,
    fontWeight: "600",
    alignItems: "flex-start",
    alignSelf: "flex-start",
    flexDirection: "row",
    left: 10,
  },
  categoryResourceExamples: {
    ...Platform.select({
      ios: { right: 30 },
      android: { right: -2 },
    }),
  },
  categoryResourceAmount: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
    textAlignVertical: "center",
    textAlign: "center",
    alignContent: "center",
    alignSelf: "center",
    ...Platform.select({
      ios: { top: 15 },
      android: { bottom: 2 },
    }),
    color: "#FF5EA5",
    fontWeight: "600",
  },
  categoryResourceAmountItem: {},
  transactionRow: {
    flex: 1,
    width: 500,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  transactionItem: {
    flex: 1,
    flexGrow: 2,
    alignItems: "flex-start",
    paddingLeft: 24,
  },
  transactionAmount: {
    flex: 1,
    width: 100,
    height: 100,
    color: "#FF5EA5",
    flexDirection: "row",
    paddingTop: 30,
    paddingRight: 48,
  },
  transactionAmountValue: {
    color: "#FF5EA5",
    fontSize: 19,
    fontWeight: "600",
    marginRight: 8,
  },

  transactionAmountCurrency: {
    color: "#c5cedb",
    fontSize: 15,
    fontWeight: "300",
    ...Platform.select({
      ios: { paddingRight: 10 },
      android: { paddingLeft: 10 },
    }),
  },
  transactionItemTitle: {
    fontSize: 14,
    fontWeight: "500",
    paddingBottom: 10,
  },
  transactionItemDate: {
    color: "#c5cedb",
  },
  noOperations: {
    textAlign: "center",
  },
});

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

export default connect(mapStateToProps)(HomeScreen);
