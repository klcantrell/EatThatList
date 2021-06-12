import React from 'react';
import {
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  FlatList,
  Dimensions,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import {
  View,
  Text,
  Button,
  Header,
  Left,
  Right,
  Container,
} from 'native-base';
import { LinearGradient, LinearGradientProps } from 'expo-linear-gradient';
import { StackActions, NavigationActions } from 'react-navigation';
import { NavigationStackProp } from 'react-navigation-stack';
import { useQuery, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import Fab from './Fab';
import KeyboardInput from './KeyboardInput';
import ListCard from './ListCard';
import { AppActionsContext, AuthContext } from '../common/context';
import InviteCard from './InviteCard';
import { GET_NEW_INVITES, GET_LISTS } from './InviteCard';
import Logo from './Logo';

interface FixedLinearGradientProps extends LinearGradientProps {
  children?: React.ReactNode
}

const FixedLinearGradient: React.FC<FixedLinearGradientProps> = LinearGradient;

interface Props {
  navigation: NavigationStackProp;
}

export const GET_LISTS_SUBSCRIPTION = gql`
  subscription($userId: String!) {
    Lists(
      where: {
        _or: [
          { owner: { _eq: $userId } }
          { ListAccesses: { user_id: { _eq: $userId } } }
        ]
      }
    ) {
      id
      name
      owner
      ListItems_aggregate {
        aggregate {
          count
        }
      }
    }
  }
`;

const ADD_LIST = gql`
  mutation($name: String!, $userId: String!) {
    insert_Lists(objects: [{ name: $name, owner: $userId }]) {
      returning {
        id
        name
        owner
        ListItems_aggregate {
          aggregate {
            count
          }
        }
      }
    }
  }
`;

const AvailableLists: React.FC<Props> = ({ navigation }) => {
  const { handleSignout } = React.useContext(AppActionsContext);
  const [showKeyboard, setShowKeyboard] = React.useState<boolean>(false);
  const [inputValue, setInputValue] = React.useState('');
  const auth = React.useContext(AuthContext);

  const {
    loading: getListLoading,
    data: getListData,
    error: getListError,
    subscribeToMore: subscribeToMoreLists,
  } = useQuery(GET_LISTS, {
    variables: {
      userId: auth.userId,
    },
  });
  const {
    loading: getInvitesLoading,
    data: getInvitesData,
    error: getInvitesError,
  } = useQuery(GET_NEW_INVITES, {
    variables: {
      userId: auth.userId,
    },
    fetchPolicy: 'network-only',
  });
  const [
    addList,
    { data: addListData, loading: addListLoading, error: addListError },
  ] = useMutation(ADD_LIST);

  const onAddList = () => {
    addList({
      variables: {
        name: inputValue,
        userId: auth.userId,
      },
      optimisticResponse: {
        __typename: 'mutation_root',
        insert_Lists: {
          __typename: 'Lists_mutation_response',
          returning: [
            {
              __typename: 'Lists',
              owner: auth.userId,
              name: inputValue,
              id: Math.random() * -10000,
              ListItems_aggregate: {
                __typename: 'ListItems_aggregate',
                aggregate: {
                  __typename: 'ListItems_aggregate_fields',
                  count: 0,
                },
              },
            },
          ],
        },
      },
      update: (
        proxy,
        {
          data: {
            insert_Lists: { returning },
          },
        }
      ) => {
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
          data: { Lists: [...Lists, ...returning] },
        });
      },
    });
    Keyboard.dismiss();
  };

  React.useEffect(() => {
    const unsubscribe = subscribeToMoreLists({
      document: GET_LISTS_SUBSCRIPTION,
      variables: {
        userId: auth.userId,
      },
      updateQuery: (prev, { subscriptionData }) => {
        if (!prev) {
          return { Lists: [] };
        }
        if (!subscriptionData.data) {
          return prev;
        }
        const existingItems = prev.Lists;
        const existingItemIds = existingItems.map(list => list.id);
        const liveItems = subscriptionData.data.Lists;
        const liveItemIds = liveItems.map(list => list.id);
        const updatedItems =
          existingItems.length <= liveItems.length
            ? [
                ...existingItems.filter(item => item.id > 0),
                ...liveItems.filter(
                  item =>
                    item.owner !== auth.userId &&
                    !existingItemIds.includes(item.id)
                ),
              ]
            : existingItems.filter(item => liveItemIds.includes(item.id));
        return {
          ...prev,
          Lists: updatedItems,
        };
      },
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const onSignout = () => {
    navigation.dispatch(
      StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'Login' })],
      })
    );
  };
  const toggleShowDialog = () => setShowKeyboard(!showKeyboard);
  const hideKeyboardAndClear = () => {
    setShowKeyboard(false);
    setInputValue('');
  };
  const onSelectList = (listId: number, owner: string, name: string) => {
    navigation.navigate({
      routeName: 'SelectedList',
      params: {
        listId,
        owner,
        name,
      },
    });
  };

  if (getListError) {
    Alert.alert(
      'Failed to request your lists, please try again',
      JSON.stringify(getListError)
    );
  }

  if (addListError) {
    Alert.alert(
      'Could not add item, please try again',
      JSON.stringify(addListError)
    );
  }

  if (getInvitesError) {
    Alert.alert(
      'There was an issue getting your invites',
      JSON.stringify(getInvitesError)
    );
  }

  return (
    <Container>
      <Header style={styles.header}>
        <Left>
          <Logo scale={0.5} color="#fff" />
        </Left>
        <Right>
          <Button transparent onPress={() => handleSignout(onSignout)}>
            <Text style={{ color: '#eee' }}>Logout</Text>
          </Button>
        </Right>
      </Header>
      <TouchableWithoutFeedback
        onPress={() => {
          hideKeyboardAndClear();
          Keyboard.dismiss();
        }}
      >
        <View style={styles.container}>
          <StatusBar barStyle="light-content" />
          <FixedLinearGradient
            colors={['#CE6D8B', '#d47d99', '#d98ca6', '#da90a9', '#df9fb4']}
            style={styles.linearGradient}
          >
            <View style={styles.cardContainer}>
              {getListLoading || getInvitesLoading ? (
                <ActivityIndicator
                  size="large"
                  color="#fff"
                  style={styles.spinner}
                />
              ) : getListData?.Lists.length > 0 ||
                getInvitesData?.Invites.length > 0 ? (
                <FlatList
                  data={[...getListData.Lists, ...getInvitesData.Invites]}
                  renderItem={({ item }) =>
                    item.owner ? (
                      <ListCard
                        itemCount={item.ListItems_aggregate.aggregate.count}
                        name={item.name}
                        onPress={() =>
                          onSelectList(item.id, item.owner, item.name)
                        }
                      />
                    ) : (
                      <InviteCard
                        inviteId={item.id}
                        listId={item.List.id}
                        name={item.List.name}
                        inviter={item.List.UserOwner.email}
                        itemCount={
                          item.List.ListItems_aggregate.aggregate.count
                        }
                      />
                    )
                  }
                  keyExtractor={item =>
                    String(item.id) + item.owner || item.invitee
                  }
                />
              ) : (
                <View style={styles.emptyMessageContainer}>
                  <Text>Create a list...</Text>
                </View>
              )}
            </View>
            <KeyboardInput
              placeholder="List"
              value={inputValue}
              visible={showKeyboard}
              onChange={setInputValue}
              onAdd={onAddList}
              onReturn={hideKeyboardAndClear}
              onBlur={hideKeyboardAndClear}
            />
            <Fab
              color="#4056F4"
              icon="ice-cream"
              onPress={toggleShowDialog}
              style={styles.fabBtn}
            />
          </FixedLinearGradient>
        </View>
      </TouchableWithoutFeedback>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  linearGradient: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  header: {
    backgroundColor: '#CE6D8B',
  },
  titleText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '900',
  },
  cardContainer: {
    flex: 1,
  },
  fabBtn: {
    position: 'absolute',
    bottom: 50,
    right: 50,
  },
  spinner: {
    marginTop: Dimensions.get('screen').height / 4,
  },
  emptyMessageContainer: {
    position: 'absolute',
    width: '100%',
    top: Dimensions.get('screen').height / 4,
    alignItems: 'center',
  },
});

export default AvailableLists;
