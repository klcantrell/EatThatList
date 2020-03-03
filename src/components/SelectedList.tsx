import React from 'react';
import {
  StyleSheet,
  Alert,
  Dimensions,
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from 'react-native';
import {
  Header,
  Title,
  Body,
  Right,
  Left,
  Button,
  View,
  Text,
  Icon,
  Container,
} from 'native-base';
import { StackActions, NavigationActions } from 'react-navigation';
import { NavigationStackProp } from 'react-navigation-stack';
import { useQuery, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { AuthContext } from '../common/context';
import Posts from './Posts';
import Poster from './Poster';
import { AppActionsContext } from '../common/context';

interface Props {
  navigation: NavigationStackProp;
}

const GET_LIST_ITEMS = gql`
  query($listId: Int!) {
    ListItems(where: { List: { id: { _eq: $listId } } }) {
      id
      description
      creator
    }
  }
`;

const GET_LIST_ITEMS_SUBSCRIPTION = gql`
  subscription($listId: Int!) {
    ListItems(where: { List: { id: { _eq: $listId } } }) {
      id
      description
      creator
    }
  }
`;

const ADD_LIST_ITEM = gql`
  mutation($listId: Int!, $description: String!, $creator: String!) {
    insert_ListItems(
      objects: [
        { list_id: $listId, description: $description, creator: $creator }
      ]
    ) {
      returning {
        id
        description
        creator
      }
    }
  }
`;

const DELETE_LIST_ITEM = gql`
  mutation($listItemId: Int!) {
    delete_ListItems(where: { id: { _eq: $listItemId } }) {
      returning {
        id
      }
    }
  }
`;

const SelectedList: React.FC<Props> = ({ navigation }) => {
  const { handleSignout } = React.useContext(AppActionsContext);
  const auth = React.useContext(AuthContext);
  const [itemAdded, setItemAdded] = React.useState<boolean>(false);
  const listId = navigation.getParam('listId');
  const listName = navigation.getParam('name');

  const {
    error: getListItemsError,
    loading: getListItemsLoading,
    data: getListItemsData,
    subscribeToMore,
  } = useQuery(GET_LIST_ITEMS, {
    variables: { listId },
  });
  const [
    addListItem,
    {
      data: addListItemData,
      loading: addListItemLoading,
      error: addListItemError,
    },
  ] = useMutation(ADD_LIST_ITEM);
  const [
    deleteListItem,
    {
      data: deleteListItemData,
      loading: deleteListItemLoading,
      error: deleteListItemError,
    },
  ] = useMutation(DELETE_LIST_ITEM);

  React.useEffect(() => {
    return subscribeToMore({
      document: GET_LIST_ITEMS_SUBSCRIPTION,
      variables: {
        listId,
      },
      updateQuery: (prev, { subscriptionData }) => {
        if (!prev) {
          return { ListItems: [] };
        }
        if (!subscriptionData.data) {
          return prev;
        }
        const existingItems = prev.ListItems;
        const existingItemIds = existingItems.map(listItem => listItem.id);
        const liveItems = subscriptionData.data.ListItems;
        const liveItemIds = liveItems.map(listItem => listItem.id);
        const updatedItems =
          existingItems.length <= liveItems.length
            ? [
                ...existingItems,
                ...liveItems.filter(
                  item =>
                    item.creator !== auth.userId &&
                    !existingItemIds.includes(item.id)
                ),
              ]
            : existingItems.filter(item => liveItemIds.includes(item.id));
        return {
          ...prev,
          ListItems: updatedItems,
        };
      },
    });
  }, []);

  const onAddListItem = (itemDescription: string) => {
    addListItem({
      variables: {
        listId,
        description: itemDescription,
        creator: auth.userId,
      },
      optimisticResponse: {
        __typename: 'mutation_root',
        insert_ListItems: {
          __typename: 'ListItems_mutation_response',
          returning: [
            {
              __typename: 'ListItems',
              id: Math.random() * -10000,
              description: itemDescription,
              creator: auth.userId,
            },
          ],
        },
      },
      update: (
        proxy,
        {
          data: {
            insert_ListItems: { returning },
          },
        }
      ) => {
        const { ListItems } = proxy.readQuery({
          query: GET_LIST_ITEMS,
          variables: { listId },
        });
        proxy.writeQuery({
          query: GET_LIST_ITEMS,
          variables: {
            listId,
          },
          data: { ListItems: [...ListItems, ...returning] },
        });
      },
    });
    setItemAdded(true);
  };

  const onDeleteListItem = (itemId: number) => {
    setItemAdded(false);
    deleteListItem({
      variables: {
        listItemId: itemId,
      },
      optimisticResponse: {
        __typename: 'mutation_root',
        delete_ListItems: {
          __typename: 'ListItems_mutation_response',
          returning: [
            {
              __typename: 'ListItems',
              id: itemId,
            },
          ],
        },
      },
      update: (
        proxy,
        {
          data: {
            delete_ListItems: { returning },
          },
        }
      ) => {
        const returnedIds = returning.map(returned => returned.id);
        const { ListItems } = proxy.readQuery({
          query: GET_LIST_ITEMS,
          variables: { listId },
        });
        proxy.writeQuery({
          query: GET_LIST_ITEMS,
          variables: {
            listId,
          },
          data: {
            ListItems: ListItems.filter(
              listItem => !returnedIds.includes(listItem.id)
            ),
          },
        });
      },
    });
  };

  const onSignout = () => {
    navigation.dispatch(
      StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'Login' })],
      })
    );
  };

  if (getListItemsError) {
    Alert.alert(
      'Failed to request your list items, please try again',
      JSON.stringify(getListItemsError)
    );
  }

  if (addListItemError) {
    Alert.alert(
      'Could not add item, please try again',
      JSON.stringify(addListItemError)
    );
  }

  if (deleteListItemError) {
    Alert.alert(
      'Could not delete item, please try again',
      JSON.stringify(deleteListItemError)
    );
  }

  return (
    <Container>
      <Header style={styles.header}>
        <Left>
          <Button transparent onPress={() => navigation.pop()}>
            <Icon name="arrow-back" style={styles.arrowBack} />
          </Button>
        </Left>
        <Body>
          <Title style={styles.titleText}>{listName}</Title>
        </Body>
        <Right>
          <Button transparent onPress={() => handleSignout(onSignout)}>
            <Text style={{ color: '#eee' }}>Logout</Text>
          </Button>
        </Right>
      </Header>
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
        }}
      >
        <View style={styles.body}>
          {getListItemsLoading ? (
            <ActivityIndicator color="pink" style={styles.spinner} />
          ) : getListItemsData?.ListItems.length > 0 ? (
            <>
              <Posts
                list={getListItemsData.ListItems}
                scrollToEnd={itemAdded}
                handleRemove={onDeleteListItem}
              />
              <Poster handleAdd={onAddListItem} />
            </>
          ) : (
            <>
              <View style={styles.emptyMessageContainer}>
                <Text>Add a thing...</Text>
              </View>
              <Poster handleAdd={onAddListItem} />
            </>
          )}
        </View>
      </TouchableWithoutFeedback>
    </Container>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#CE6D8B',
  },
  titleText: {
    color: '#fff',
    fontSize: 20,
  },
  body: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#f8ecf0',
  },
  spinner: {
    marginBottom: 100,
  },
  button: {
    position: 'absolute',
    top: 0,
    right: 0,
    transform: [{ translateY: -10 }],
  },
  arrowBack: {
    color: '#eee',
    marginLeft: 10,
  },
  emptyMessageContainer: {
    position: 'absolute',
    width: '100%',
    top: Dimensions.get('screen').height / 4,
    alignItems: 'center',
  },
});

export default SelectedList;
