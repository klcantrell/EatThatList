import React, { ReactElement, RefObject } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { AppLoading } from 'expo';
import {
  Container,
  Text,
  Header,
  Title,
  Body,
  Button,
  Icon,
  ListItem,
  View,
} from 'native-base';
import { loadAsync as loadFontAsync } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';

interface State {
  list: Array<number>;
  isReady: boolean;
  active: boolean;
}

export default class App extends React.Component<{}, State> {
  list: RefObject<FlatList<number>>;

  constructor(props) {
    super(props);
    this.list = React.createRef();
    this.state = {
      isReady: false,
      active: false,
      list: [
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12,
        13,
        14,
        15,
        16,
        17,
        18,
        19,
        20,
        21,
        22,
        23,
        24,
      ],
    };
  }

  async componentDidMount() {
    await loadFontAsync({
      Roboto: require('native-base/Fonts/Roboto.ttf'),
      Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
      ...Ionicons.font,
    });
    this.setState({ isReady: true });
  }

  render() {
    if (!this.state.isReady) {
      return <AppLoading />;
    }

    return (
      <Container>
        <Header>
          <Body>
            <Title>Sup</Title>
          </Body>
        </Header>
        <FlatList
          ref={this.list}
          data={this.state.list.reverse()}
          renderItem={({ item }) => (
            <ListItem>
              <Text>{item}</Text>
            </ListItem>
          )}
          keyExtractor={item => String(item)}
          inverted
        />
        <View style={styles.view} pointerEvents="box-none">
          <Text style={styles.sup}>YO</Text>
          <Button
            rounded
            style={styles.button}
            onPress={() => {
              this.setState(
                {
                  list: [...this.state.list.reverse(), 42],
                },
                () => {
                  this.list.current.scrollToIndex({ index: 0 });
                }
              );
            }}
          >
            <Icon name="flame" />
          </Button>
        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'red',
    width: 50,
    height: 50,
    position: 'relative',
    bottom: 50,
    right: 50,
    justifyContent: 'center',
    shadowColor: 'black',
    shadowOpacity: 0.4,
    shadowOffset: { width: 1, height: 3 },
    shadowRadius: 3,
  },
  sup: {
    position: 'relative',
    bottom: 80,
    right: 20,
    width: '75%',
    height: 80,
    borderWidth: 1,
  },
  view: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
});
