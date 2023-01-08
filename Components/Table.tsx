/* eslint-disable react-native/no-inline-styles */
/*
    Only problem that I see right now is that it doesn't
    update when rotating from landscape to portrait (or maybe
    it's just on second rotation? Idk yet)
*/
import React, {useState} from 'react';
import {LayoutChangeEvent, useWindowDimensions, View} from 'react-native';

const Table = ({
  data,
  rowStyle = undefined,
  priviledge = new Array(data.length).fill(false),
}: {
  data: any[];
  rowStyle: Object | undefined;
  priviledge: boolean[];
}) => {
  // Initialize list of widths
  const [colWidth, setColWidth] = useState<number[][]>(
    data.map(row => new Array(Object.keys(row).length).fill(0)),
  );

  // Get widows size
  const maxSize = useWindowDimensions();

  if (!colWidth || !maxSize) {
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
    if (!priviledge[col] && sum > maxSize.width) {
      width = width - (sum - maxSize.width);
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
            maxWidth: maxSize.width,
          }}>
          {/* Map along columns */}
          {Object.keys(item).map((key, colIndex) => (
            <View
              key={key}
              onLayout={event => {
                onLayout(event, rowIndex, colIndex);
              }}
              style={{
                minWidth: Math.max(...colWidth.map(row => row[colIndex])),
                flexShrink: 1,
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