import React from "react";
import {
  StyleSheet, View
} from "react-native";
import { rasoiBoxYellow } from "../../../constants/Colors";

export default function Pagination(props: { index: number, slideList: number[] }) {
    const { index, slideList } = props;

    return (
        <View style={styles.pagination} pointerEvents="none">
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