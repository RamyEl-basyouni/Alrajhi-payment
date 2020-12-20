import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  info: {
    // flex: 1,
    // backgroundColor: "rgba(100,100,100, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 200,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 12,
    height: "35%",
    width: "90%",
    textAlignVertical: "center",
    textAlign: "center",
    alignContent: "center",
    alignSelf: "center",
    alignItems: "center",
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    borderTopRightRadius: 35,
    borderTopLeftRadius: 35,
    overflow: "hidden",
  },
  modalView: {
    height: "60%",
    width: "60%",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  operationsText: {
    // textAlign: "center",
    // alignContent: "center",
    // alignSelf: "center",
    // alignItems: "center",
    color: "#252625",
    fontSize: 20,
    fontWeight: "500",
    marginTop: 10,
  },
});

export default styles;
