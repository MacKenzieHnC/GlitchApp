import React from "react";
import { StyleSheet, View } from "react-native";
import { ITD } from "./TD";

// Props
export interface ITR {
  children: React.ReactElement<ITD>[] | React.ReactElement<ITD>;
}

// Component
export function TR({ children }: ITR) {
  return <View style={styles.row}>{children}</View>;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    flexWrap: "nowrap",
  },
});
