import React, { RefObject } from 'react';
import { FlatList } from 'react-native';
import { AppLoading } from 'expo';
import { Container, Header, Title, Body } from 'native-base';
import { loadAsync as loadFontAsync } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import Posts from './src/components/Posts';
import Poster from './src/components/Poster';

interface State {
  list: Array<number>;
  fontsLoaded: boolean;
}

interface Props {}

export default class App extends React.Component<Props, State> {
  list: RefObject<FlatList<number>> = React.createRef();

  state = {
    fontsLoaded: false,
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

  async componentDidMount() {
    await loadFontAsync({
      Roboto: require('native-base/Fonts/Roboto.ttf'),
      Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
      ...Ionicons.font,
    });
    this.setState({ fontsLoaded: true });
  }

  handleAdd = () => {
    this.setState(
      {
        list: [
          ...this.state.list,
          this.state.list[this.state.list.length - 1] + 1,
        ],
      },
      () => {
        this.list.current.scrollToIndex({ index: 0 });
      }
    );
  };

  render() {
    if (!this.state.fontsLoaded) {
      return <AppLoading />;
    }

    return (
      <Container>
        <Header>
          <Body>
            <Title>Sup</Title>
          </Body>
        </Header>
        <Posts list={this.state.list} innerRef={this.list} />
        <Poster handleAdd={this.handleAdd} />
      </Container>
    );
  }
}
