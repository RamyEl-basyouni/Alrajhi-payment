import { DynamicStyleSheet } from "react-native-dark-mode";

const dynamicStyles = (appStyles) => {
  return new DynamicStyleSheet({
    title: {
      fontSize: 25,
      fontWeight: "bold",
      textAlign: "center",
      paddingBottom: 25,
      color: "#636361",
    },
    text: {
      fontSize: 18,
      textAlign: "center",
      color: "#636361",
      paddingLeft: 10,
      paddingRight: 10,
    },
    image: {
      width: 100,
      height: 100,
      marginBottom: 60,
      tintColor: "green",
    },
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      // backgroundColor: appStyles.colorSet.mainThemeForegroundColor,
    },
    button: {
      fontSize: 18,
      color: "white",
      marginTop: 10,
    },
    info: {
      // flex: 0,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 6,
      },
      shadowOpacity: 0.37,
      shadowRadius: 7.49,
      elevation: 12,
      backgroundColor: "#FFFFFF",
      height: "50%",
      width: "80%",
      textAlignVertical: "center",
      textAlign: "center",
      alignContent: "center",
      marginLeft: "10%",
      marginTop: "27%",
      borderRadius: 15,
    },
    doneButton: {
      backgroundColor: "#4E4BDB",
      borderRadius: 15,
      marginTop: 50,
      marginBottom: 50,
      height: 60,
    },
  });
};

export default dynamicStyles;
