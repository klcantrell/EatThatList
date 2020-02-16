import React from 'react';
import { StyleSheet, Alert } from 'react-native';
import {
  Spinner,
  Header,
  Title,
  Body,
  Right,
  Left,
  Button,
  View,
  Text,
  Icon,
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
        const existingItemIds = prev.ListItems.map(listItem => listItem.id);
        const newListItems = subscriptionData.data.ListItems.filter(
          listItem =>
            listItem.creator !== auth.userId &&
            !existingItemIds.includes(listItem.id)
        );
        return {
          ...prev,
          ListItems: [...prev.ListItems, ...newListItems],
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
              id: Math.random() * -10000 + Number(auth.userId),
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
    <>
      <Header>
        <Left>
          <Button transparent onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" style={styles.arrowBack} />
            <Text>Your lists</Text>
          </Button>
        </Left>
        <Body>
          <Title>List</Title>
        </Body>
        <Right>
          <Button transparent onPress={() => handleSignout(onSignout)}>
            <Text>Logout</Text>
          </Button>
        </Right>
      </Header>
      <View style={styles.body}>
        {getListItemsLoading ? (
          <Spinner color="pink" style={styles.spinner} />
        ) : (
          <>
            <Posts
              list={getListItemsData.ListItems}
              scrollToEnd={itemAdded}
              handleRemove={onDeleteListItem}
            />
            <Poster handleAdd={onAddListItem} />
          </>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    justifyContent: 'center',
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
    marginRight: 5,
  },
});

export default SelectedList;
