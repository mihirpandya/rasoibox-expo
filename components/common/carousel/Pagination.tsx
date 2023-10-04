import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { rasoiBoxYellow } from "../../../constants/Colors";

export default function Pagination(props: { index: number, slideList: number[] }) {
    const { index, slideList } = props;

    return (
      <View>
        <View style={styles.pagination}>
            {slideList.map((_, i) => {
                return (
                  <View
                      key={i}
                      style={[
                          styles.paginationDot,
                          index === i
                          ? styles.paginationDotActive
                          : styles.paginationDotInactive,
                      ]}
                  />
              );
            })}
        </View>
        <Text style={styles.scrollText}>Scroll to view next GIF</Text>
        </View>
      );
}

const styles = StyleSheet.create({
    pagination: {
      position: "absolute",
      bottom: 8,
      width: "100%",
      justifyContent: "center",
      flexDirection: "row",
    },
    scrollText: {
      fontSize: 10,
      fontFamily: 'AvenirLight',
      fontStyle: 'italic',
      marginBottom: -20,
      paddingBottom: 5
    },
    paginationDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginHorizontal: 2,
    },
    paginationDotActive: { 
        backgroundColor: rasoiBoxYellow 
    },
    paginationDotInactive: { 
        backgroundColor: "gray" 
    },
  });