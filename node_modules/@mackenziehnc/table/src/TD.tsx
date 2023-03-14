import React from "react";
import { LayoutChangeEvent, View } from "react-native";

// Props
export interface ITD {
  children?: any;
  requestWidth?: Function;
  getWidth?: Function;
}

// Component
export function TD({ children, requestWidth, getWidth }: ITD) {
  const onLayout = (event: LayoutChangeEvent) => {
    if (requestWidth) {
      requestWidth(Math.ceil(event.nativeEvent.layout.width));
    }
  };
  if (!getWidth) {
    return <View />;
  }
  return (
    <View onLayout={onLayout} style={{ width: getWidth() }}>
      {children}
    </View>
  );
}
