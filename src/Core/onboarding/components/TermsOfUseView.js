import React from "react";
import { Text, Linking, View } from "react-native";
import { IMLocalized } from "../../localization/IMLocalization";

const TermsOfUseView = (props) => {
  const { tosLink, style } = props;
  return (
    <View style={style}>
      <Text style={{ fontSize: 12 }}>
        {/* {IMLocalized("By creating an account you agree with our")} */}
        بإنشائك حساب، تتم موافقتك على قواعد الاستخدام لدينا
      </Text>
      <Text
        style={{ color: "blue", fontSize: 12 }}
        onPress={() => Linking.openURL(tosLink)}
      >
        {/* {IMLocalized("Terms of Use")} */}
        شروط الاستخدام
      </Text>
    </View>
  );
};

export default TermsOfUseView;
