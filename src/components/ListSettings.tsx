import React from 'react';
import {
  StyleSheet,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
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
  View,
  Item,
  Input,
} from 'native-base';
import { StackActions, NavigationActions } from 'react-navigation';
import { NavigationStackProp } from 'react-navigation-stack';
import gql from 'graphql-tag';
import {
  useMutation,
  useApolloClient,
  useQuery,
  useSubscription,
} from '@apollo/react-hooks';
import { AppActionsContext, AuthContext } from '../common/context';
import Invite, { GET_COLLABORATORS } from './Invite';
import { GET_LISTS } from './InviteCard';
import { GET_LISTS_SUBSCRIPTION } from './AvailableLists';

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

const FIND_INVITEE = gql`
  query($email: String!) {
    Users(where: { email: { _ilike: $email } }) {
      id
      email
      Invites {
        id
      }
    }
  }
`;

const ADD_INVITEE = gql`
  mutation($inviterId: String!, $inviteeId: String!, $listId: Int!) {
    insert_Invites(
      objects: [{ inviter: $inviterId, invitee: $inviteeId, list_id: $listId }]
    ) {
      returning {
        id
        list_id
        inviter
        invitee
        accepted
        Invited {
          email
        }
      }
    }
  }
`;

const FIND_INVITE = gql`
  query($listId: Int!, $userId: String!) {
    Invites(
      where: {
        _and: [{ list_id: { _eq: $listId } }, { invitee: { _eq: $userId } }]
      }
    ) {
      id
    }
  }
`;

const LEAVE_LIST = gql`
  mutation($userId: String!, $listId: Int!, $inviteId: Int!) {
    delete_ListAccess(
      where: {
        _and: [{ user_id: { _eq: $userId } }, { list_id: { _eq: $listId } }]
      }
    ) {
      affected_rows
    }
    update_Invites(
      where: { id: { _eq: $inviteId } }
      _set: { accepted: false }
    ) {
      returning {
        id
      }
    }
  }
`;

const ListSettings: React.FC<Props> = ({ navigation }) => {
  const { handleSignout } = React.useContext(AppActionsContext);
  const auth = React.useContext(AuthContext);
  const inviteeInputRef = React.useRef(null);

  const [inviteeInput, setInviteeInput] = React.useState<string>('');
  const [findInviteeLoading, setFindInviteeLoading] = React.useState<boolean>(
    false
  );
  const [leavingList, setLeavingList] = React.useState<boolean>(false);

  const listId = navigation.getParam('listId');
  const owner = navigation.getParam('owner');

  const apolloClient = useApolloClient();

  const {
    data: getCollaboratorsData,
    loading: getCollaboratorsLoading,
    error: getCollaboratorsError,
  } = useQuery(GET_COLLABORATORS, {
    variables: {
      listId,
    },
    fetchPolicy: 'network-only',
  });
  const [
    deleteList,
    {
      data: deleteListData,
      loading: deleteListLoading,
      error: deleteListError,
    },
  ] = useMutation(DELETE_LIST);
  const [
    addInvitee,
    {
      data: addInviteeData,
      loading: addInviteeLoading,
      error: addInviteeError,
    },
  ] = useMutation(ADD_INVITEE);
  const [
    leaveList,
    { data: leaveListData, loading: leaveListLoading, error: leaveListError },
  ] = useMutation(LEAVE_LIST);
  const { data: getListsSubscriptionData } = useSubscription(
    GET_LISTS_SUBSCRIPTION,
    {
      variables: {
        userId: auth.userId,
      },
    }
  );

  React.useEffect(() => {
    if (leavingList && getListsSubscriptionData) {
      navigation.pop();
    }
  }, [leavingList, getListsSubscriptionData]);

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

  const onAddInvitee = async () => {
    setFindInviteeLoading(true);
    const { data, errors } = await apolloClient.query({
      query: FIND_INVITEE,
      variables: {
        email: inviteeInput,
      },
      fetchPolicy: 'no-cache',
    });
    setFindInviteeLoading(false);
    if (
      data.Users.length > 0 &&
      data.Users[0].email.toLowerCase() === inviteeInput.toLowerCase()
    ) {
      if (data.Users[0].Invites.length > 0) {
        Alert.alert('Already invited that user');
      } else {
        addInvitee({
          variables: {
            inviterId: auth.userId,
            inviteeId: data.Users[0].id,
            listId,
          },
          optimisticResponse: {
            __typename: 'mutation_root',
            insert_Invites: {
              __typename: 'Invites_mutation_response',
              returning: [
                {
                  __typename: 'Invites',
                  inviter: auth.userId,
                  invitee: data.Users[0].id,
                  id: Math.random() * -10000,
                  list_id: listId,
                  accepted: null,
                  Invited: {
                    __typename: 'Users',
                    email: inviteeInput,
                  },
                },
              ],
            },
          },
          update: (
            proxy,
            {
              data: {
                insert_Invites: { returning },
              },
            }
          ) => {
            const { Invites } = proxy.readQuery({
              query: GET_COLLABORATORS,
              variables: {
                listId,
              },
            });
            proxy.writeQuery({
              query: GET_COLLABORATORS,
              variables: {
                listId,
              },
              data: { Invites: [...Invites, ...returning] },
            });
          },
        });
        inviteeInputRef?.current?._root?.blur();
        setInviteeInput('');
        Keyboard.dismiss();
      }
    } else {
      Alert.alert('Could not find invitee');
    }
  };

  const onLeaveList = async () => {
    setLeavingList(true);
    const {
      data: findInviteData,
      errors: findInviteErrors,
    } = await apolloClient.query({
      query: FIND_INVITE,
      variables: {
        listId,
        userId: auth.userId,
      },
      fetchPolicy: 'no-cache',
    });
    if (findInviteErrors || findInviteData?.Invites[0].length < 1) {
      Alert.alert('There was an issue leaving this list, please try again');
      return findInviteErrors;
    }
    leaveList({
      variables: {
        userId: auth.userId,
        listId,
        inviteId: findInviteData.Invites[0].id,
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

  const showDeletePrompt = () => {
    Alert.alert('Delete list', 'Are you sure you want to delete this list?', [
      { text: 'Cancel', style: 'default' },
      { text: 'Do it', style: 'destructive', onPress: onDeleteList },
    ]);
  };

  const showLeavePrompt = () => {
    Alert.alert('Leave list', 'Are you sure you want to leave this list?', [
      { text: 'Cancel', style: 'default' },
      { text: 'Do it', style: 'destructive', onPress: onLeaveList },
    ]);
  };

  if (getCollaboratorsError) {
    Alert.alert(
      'There was an issue fetching your collaborators, please try again'
    );
  }
  if (deleteListError) {
    Alert.alert('There was an issue deleting the list, please try again');
  }
  if (addInviteeError) {
    Alert.alert('There was an issue sending the invitation, please try again');
  }
  if (leaveListError) {
    Alert.alert('There was a problem leaving the list, please try again');
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
          <Title style={styles.titleText}>List Settings</Title>
        </Body>
        <Right>
          <Button transparent onPress={() => handleSignout(onSignout)}>
            <Text style={{ color: '#eee' }}>Logout</Text>
          </Button>
        </Right>
      </Header>
      {owner === auth.userId ? (
        <>
          <StatusBar barStyle="light-content" />
          <View>
            <ListItem itemHeader first>
              <Text>COLLABORATORS</Text>
            </ListItem>
            {getCollaboratorsData?.Invites?.map(invite => (
              <Invite key={invite.id} invite={invite} />
            )) || (
              <ListItem style={{ justifyContent: 'center' }}>
                <ActivityIndicator />
              </ListItem>
            )}
            <ListItem style={styles.inputContainer} last>
              <Item style={{ width: '85%' }}>
                <Input
                  style={{ height: 30 }}
                  placeholder="Invite someone..."
                  value={inviteeInput}
                  onChangeText={setInviteeInput}
                  keyboardAppearance="dark"
                  ref={inviteeInputRef}
                />
              </Item>
              <Button
                bordered
                style={{ height: 40, marginLeft: 'auto' }}
                onPress={onAddInvitee}
              >
                {findInviteeLoading ? (
                  <ActivityIndicator
                    style={{ marginRight: 10, marginLeft: 10 }}
                  />
                ) : (
                  <Icon
                    name="share"
                    style={{
                      marginRight: 12,
                      marginLeft: 12,
                      marginTop: 0,
                      marginBottom: 0,
                    }}
                  />
                )}
              </Button>
            </ListItem>
          </View>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ListItem itemDivider style={styles.ownerDivider} />
          </TouchableWithoutFeedback>
          <ListItem last>
            <Left>
              <Text>Delete List</Text>
            </Left>
            <Right>
              <Button danger onPress={showDeletePrompt}>
                <Icon name="trash" />
              </Button>
            </Right>
          </ListItem>
        </>
      ) : (
        <>
          <ListItem itemDivider style={styles.collaboratorDivider} />
          <ListItem last>
            <Left>
              <Text>Leave list</Text>
            </Left>
            <Right>
              <Button danger onPress={showLeavePrompt}>
                {leavingList ? (
                  <ActivityIndicator
                    style={{ marginRight: 20, marginLeft: 20 }}
                  />
                ) : (
                  <Icon name="exit" />
                )}
              </Button>
            </Right>
          </ListItem>
        </>
      )}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ListItem itemDivider style={styles.bottomSpacer} />
      </TouchableWithoutFeedback>
    </Container>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#CE6D8B',
  },
  ownerDivider: {
    height: 80,
    backgroundColor: '#f8ecf0',
  },
  collaboratorDivider: {
    height: 30,
    backgroundColor: '#f8ecf0',
  },
  bottomSpacer: {
    height: '100%',
    backgroundColor: '#f8ecf0',
  },
  titleText: {
    color: '#fff',
    fontSize: 20,
  },
  arrowBack: {
    color: '#eee',
    marginLeft: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 55,
    paddingTop: 0,
    paddingBottom: 8,
  },
});

export default ListSettings;
