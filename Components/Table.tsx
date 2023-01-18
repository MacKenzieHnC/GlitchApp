/* eslint-disable react-native/no-inline-styles */
/*
    Only problem that I see right now is that it doesn't
    update when rotating from landscape to portrait (or maybe
    it's just on second rotation? Idk yet)
*/
import React, {useState} from 'react';
import {LayoutChangeEvent, Text, useWindowDimensions, View} from 'react-native';

const Table = ({
  data,
  rowStyle = undefined,
  priviledge = new Array(data.length).fill(false),
  padding = 0,
}: {
  data: any[];
  rowStyle?: Object | undefined;
  priviledge?: boolean[];
  padding?: number;
}) => {
  // Initialize list of widths
  const [colWidth, setColWidth] = useState<number[][]>(
    data.map(row => new Array(Object.keys(row).length).fill(0)),
  );

  // Get widows size
  const maxWidth = useWindowDimensions().width - padding;

  if (!colWidth || !maxWidth) {
    return <></>;
  }

  // Fix issues of going off screen
  const onLayout = (event: LayoutChangeEvent, row: number, col: number) => {
    // Get current width
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    var {width, height} = event.nativeEvent.layout;

    // Find total row width
    const sum =
      colWidth[row].reduce((partialSum, a) => partialSum + a, 0) -
      colWidth[row][col] +
      width;

    // Shrink unpriviledged components
    if (!priviledge[col] && sum > maxWidth) {
      width = width - (sum - maxWidth);
      if (width < 0) {
        width = 0;
      }
    }

    // Store width in colWidth array
    colWidth[row][col] = width;
    setColWidth([...colWidth]);
  };

  return (
    <View>
      {/* Map along rows */}
      {data.map((item, rowIndex) => (
        <View
          key={rowIndex}
          style={{
            flexDirection: 'row',
            maxWidth: maxWidth,
          }}>
          {/* Map along columns */}
          {Object.keys(item).map((key, colIndex) => (
            <View
              key={key}
              onLayout={event => {
                onLayout(event, rowIndex, colIndex);
              }}
              style={{
                minWidth:
                  Math.max(...colWidth.map(row => row[colIndex])) +
                  (priviledge[colIndex] ? 0 : -1),
                ...rowStyle,
              }}>
              {item[key]}
            </View>
          ))}
        </View>
      ))}
    </View>
  );
};

export default Table;
