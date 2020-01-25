import React from 'react';
import { StyleSheet, KeyboardAvoidingView } from 'react-native';
import {
  View,
  Button,
  Icon,
  Text,
  Form,
  Item,
  Label,
  Input,
} from 'native-base';

interface Props {
  handleAdd: () => void;
}

class Poster extends React.Component<Props> {
  render() {
    const { handleAdd } = this.props;
    return (
      <View style={styles.container} pointerEvents="box-none">
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior="position"
          keyboardVerticalOffset={-70}
          pointerEvents="box-none"
        >
          <Form style={styles.form}>
            <Item style={styles.input} stackedLabel>
              <Label>Todo</Label>
              <Input />
            </Item>
            <Button style={styles.addBtn}>
              <Text>Sup</Text>
            </Button>
          </Form>
        </KeyboardAvoidingView>
        <Button rounded style={styles.fabBtn} onPress={() => handleAdd()}>
          <Icon name="flame" />
        </Button>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  fabBtn: {
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
  keyboardView: {
    width: '100%',
  },
  form: {
    position: 'relative',
    bottom: 70,
    marginHorizontal: 1,
    backgroundColor: 'purple',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
  },
  input: {
    flexGrow: 1,
    marginRight: 5,
    marginBottom: 3,
  },
  addBtn: {
    height: '100%',
  },
  container: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
});

export default Poster;
