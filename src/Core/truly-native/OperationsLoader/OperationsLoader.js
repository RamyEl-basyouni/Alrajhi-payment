import React from "react";
import { View, ImageBackground, Text } from "react-native";
import styles from "./styles";

const OperationsLoader = (props) => {
  const { appStyles } = props;
  return (
    <View style={styles.info}>
      <View style={styles.modalView}>
        <ImageBackground
          style={{
            resizeMode: "center",
            width: "100%",
            height: "100%",
          }}
          imageStyle={{
            // borderBottomLeftRadius: 35,
            // borderBottomRightRadius: 35,
            paddingRight: 100,
          }}
          resizeMode="contain"
          source={appStyles.iconSet.operationsLoaderLogo}
        ></ImageBackground>
        <Text style={styles.operationsText}> في إنتظار العمليات </Text>
      </View>
    </View>
  );
};

export default OperationsLoader;
