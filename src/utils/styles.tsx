import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 10,
    fontSize: 20,
    textAlign: 'center',
  },
  container: {
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    width: '100%',
    padding: 20,
  },
  h1: {
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 30,
  },
  h2: {
    textAlign: 'center',
    fontSize: 25,
  },
  h3: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    width: '100%',
  },
  innerContainer: {
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    flexShrink: 1,
    flexBasis: 200,
  },
  listItem: {
    padding: 5,
    textAlignVertical: 'top',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  numericListItem: {
    padding: 5,
    textAlign: 'right',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  screen: {
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  scrollview: {
    flexGrow: 1,
    width: '100%',
  },
  switch: {
    marginRight: -7,
    marginTop: -11,
    marginBottom: 5,
  },
  textView: {
    flex: 1,
  },
});

export default styles;
