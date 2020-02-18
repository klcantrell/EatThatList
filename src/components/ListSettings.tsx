import React from 'react';
import { StyleSheet, Alert } from 'react-native';
import {
  Text,
  Container,
  Header,
  Left,
  Body,
  Button,
  Right,
  Title,
  Icon,
  ListItem,
  Separator,
  View,
  Item,
  Input,
} from 'native-base';
import { StackActions, NavigationActions } from 'react-navigation';
import { NavigationStackProp } from 'react-navigation-stack';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { GET_LISTS } from './AvailableLists';
import { AppActionsContext, AuthContext } from '../common/context';

interface Props {
  navigation: NavigationStackProp;
}

const DELETE_LIST = gql`
  mutation($listId: Int!) {
    delete_Lists(where: { id: { _eq: $listId } }) {
      returning {
        id
      }
    }
  }
`;

const ListSettings: React.FC<Props> = ({ navigation }) => {
  const { handleSignout } = React.useContext(AppActionsContext);
  const auth = React.useContext(AuthContext);
  const listId = navigation.getParam('listId');
  const owner = navigation.getParam('owner');

  const [
    deleteList,
    {
      data: deleteListData,
      loading: deleteListLoading,
      error: deleteListError,
    },
  ] = useMutation(DELETE_LIST);
  const onDeleteList = async () => {
    await deleteList({
      variables: {
        listId,
      },
      optimisticResponse: {
        __typename: 'mutation_root',
        delete_Lists: {
          __typename: 'Lists_mutation_response',
          returning: {
            __typename: 'Lists',
            id: listId,
          },
        },
      },
      update: (
        proxy,
        {
          data: {
            delete_Lists: { returning },
          },
        }
      ) => {
        if (!returning.length) {
          return;
        }
        const returnedIds = returning.map(returned => returned.id);
        const { Lists } = proxy.readQuery({
          query: GET_LISTS,
          variables: {
            userId: auth.userId,
          },
        });
        proxy.writeQuery({
          query: GET_LISTS,
          variables: {
            userId: auth.userId,
          },
          data: {
            Lists: Lists.filter(list => !returnedIds.includes(list.id)),
          },
        });
      },
    });
    navigation.pop();
  };

  const onSignout = () => {
    navigation.dispatch(
      StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'Login' })],
      })
    );
  };

  const showDeletePrompt = () => {
    Alert.alert('Delete list', 'Are you sure you want to delete this list?', [
      { text: 'Cancel', style: 'default' },
      { text: 'Do it', style: 'destructive', onPress: onDeleteList },
    ]);
  };

  const showDeleteError = () => {
    Alert.alert('', 'Only the owner of this list can delete it');
  };

  return (
    <Container>
      <Header>
        <Left>
          <Button transparent onPress={() => navigation.pop()}>
            <Icon name="arrow-back" style={styles.arrowBack} />
            <Text>Your lists</Text>
          </Button>
        </Left>
        <Body>
          <Title>List Settings</Title>
        </Body>
        <Right>
          <Button transparent onPress={() => handleSignout(onSignout)}>
            <Text>Logout</Text>
          </Button>
        </Right>
      </Header>
      <View>
        <ListItem itemHeader first>
          <Text>COLLABORATORS</Text>
        </ListItem>
        <ListItem>
          <Text>Kalalau</Text>
        </ListItem>
        <ListItem
          style={{
            flexDirection: 'row',
            alignItems: 'flex-end',
            height: 55,
            paddingTop: 0,
            paddingBottom: 8,
          }}
          last
        >
          <Item style={{ width: '85%' }}>
            <Input style={{ height: 30 }} placeholder="Invite someone..." />
          </Item>
          <Button bordered style={{ height: 40, marginLeft: 'auto' }}>
            <Icon
              name="share"
              onPress={() => Alert.alert('sup')}
              style={{
                marginRight: 12,
                marginLeft: 12,
                marginTop: 0,
                marginBottom: 0,
              }}
            />
          </Button>
        </ListItem>
      </View>
      <ListItem itemDivider style={{ height: 80 }} />
      <ListItem last>
        <Left>
          <Text>Delete List</Text>
        </Left>
        <Right>
          <Button
            danger
            onPress={owner === auth.userId ? showDeletePrompt : showDeleteError}
          >
            <Icon name="trash" />
          </Button>
        </Right>
      </ListItem>
      <Separator />
    </Container>
  );
};

const styles = StyleSheet.create({
  arrowBack: {
    marginRight: 5,
  },
});

export default ListSettings;
