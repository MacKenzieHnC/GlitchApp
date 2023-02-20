import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
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
  scrollview: {
    flexGrow: 1,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  switch: {
    marginRight: -7,
    marginTop: -5,
    marginBottom: 5,
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
    flex: 1,
    flexBasis: 0,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  listItem: {
    padding: 5,
    textAlignVertical: 'top',
  },
  numericListItem: {
    padding: 5,
    textAlign: 'right',
  },
  modal: {
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  button: {
    paddingHorizontal: 10,
    fontSize: 20,
    textAlign: 'center',
  },
  textView: {
    flex: 1,
  },
});

export default styles;
