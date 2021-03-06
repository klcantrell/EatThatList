import React from 'react';
import { Card, Text, View, Button, List } from 'native-base';
import { StyleSheet, Alert, ActivityIndicator } from 'react-native';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { AuthContext } from '../common/context';

interface Props {
  inviteId: number;
  listId: number;
  name: string;
  itemCount: number;
  inviter: string;
}

export const GET_NEW_INVITES = gql`
  query($userId: String!) {
    Invites(
      where: {
        _and: [{ invitee: { _eq: $userId } }, { accepted: { _is_null: true } }]
      }
    ) {
      id
      accepted
      List {
        id
        name
        ListItems_aggregate {
          aggregate {
            count
          }
        }
        UserOwner {
          email
        }
      }
    }
  }
`;
export const GET_LISTS = gql`
  query($userId: String!) {
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
const ACCEPT_INVITATION = gql`
  mutation($inviteId: Int!, $listId: Int!, $userId: String!) {
    update_Invites(
      where: { id: { _eq: $inviteId } }
      _set: { accepted: true }
    ) {
      returning {
        id
      }
    }
    insert_ListAccess(objects: [{ list_id: $listId, user_id: $userId }]) {
      affected_rows
    }
  }
`;
const DECLINE_INVITATION = gql`
  mutation($inviteId: Int!) {
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

const InviteCard: React.FC<Props> = ({
  inviteId,
  listId,
  name,
  itemCount,
  inviter,
}) => {
  const auth = React.useContext(AuthContext);
  const [acceptingInvitation, setAcceptingInvitation] = React.useState<boolean>(
    false
  );

  const [
    acceptInvitation,
    {
      loading: acceptInvitationLoading,
      data: acceptInvitationData,
      error: acceptInvitationError,
    },
  ] = useMutation(ACCEPT_INVITATION);
  const [
    declineInvitation,
    {
      loading: declineInvitationLoading,
      data: declineInvitationData,
      error: declineInvitationError,
    },
  ] = useMutation(DECLINE_INVITATION);

  const onAcceptInvitation = () => {
    setAcceptingInvitation(true);
    acceptInvitation({
      variables: {
        inviteId,
        userId: auth.userId,
        listId,
      },
      optimisticResponse: {
        __typename: 'mutation-root',
        update_Invites: {
          __typename: 'Invites_mutation_response',
          returning: {
            __typename: 'Invites',
            id: inviteId,
          },
        },
        insert_ListAccess: {
          __typename: 'ListAccess_mutation_response',
          affected_rows: 1,
        },
      },
      update: proxy => {
        const { Invites } = proxy.readQuery({
          query: GET_NEW_INVITES,
          variables: {
            userId: auth.userId,
          },
        });
        proxy.writeQuery({
          query: GET_NEW_INVITES,
          variables: {
            userId: auth.userId,
          },
          data: { Invites: Invites.filter(invite => invite.id !== inviteId) },
        });

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
            Lists: [
              ...Lists,
              {
                __typename: 'Lists',
                id: Math.random() * -10000,
                name,
                owner: inviter,
                ListItems_aggregate: {
                  __typename: 'ListItems_aggregate',
                  aggregate: {
                    __typename: 'ListItems_aggregate_fields',
                    count: itemCount,
                  },
                },
              },
            ],
          },
        });
      },
    });
  };
  const onDeclineInvitation = () => {
    declineInvitation({
      variables: {
        inviteId,
      },
      optimisticResponse: {
        __typename: 'mutation_root',
        update_Invites: {
          __typename: 'Invites_mutation_response',
          returning: [
            {
              __typename: 'Invites',
              id: inviteId,
            },
          ],
        },
      },
      update: (
        proxy,
        {
          data: {
            update_Invites: { returning },
          },
        }
      ) => {
        const returningIds = returning.map(returned => returned.id);
        const { Invites } = proxy.readQuery({
          query: GET_NEW_INVITES,
          variables: {
            userId: auth.userId,
          },
        });
        proxy.writeQuery({
          query: GET_NEW_INVITES,
          variables: {
            userId: auth.userId,
          },
          data: {
            Invites: Invites.filter(
              invite => !returningIds.includes(invite.id)
            ),
          },
        });
      },
    });
  };

  if (acceptInvitationError) {
    Alert.alert(
      'There was an issue accepting the invitation',
      JSON.stringify(acceptInvitationError)
    );
  }

  if (declineInvitationError) {
    Alert.alert(
      'There was an issue declining the invitation',
      JSON.stringify(declineInvitationError)
    );
  }

  return (
    <Card style={styles.card}>
      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{name}</Text>
        </View>
        <Text style={styles.metadata}>
          {itemCount} {itemCount === 1 ? 'item' : 'items'}
        </Text>
      </View>
      <View style={styles.shroud}>
        <Text
          style={styles.inviteMessage}
        >{`Accept invite from ${inviter}?`}</Text>
        <View style={styles.inviteButtons}>
          <Button
            style={[styles.inviteButton, styles.acceptButton]}
            onPress={onAcceptInvitation}
          >
            {acceptingInvitation ? (
              <ActivityIndicator style={{ marginRight: 20, marginLeft: 20 }} />
            ) : (
              <Text>Accept</Text>
            )}
          </Button>
          <Button
            danger
            style={styles.inviteButton}
            onPress={onDeclineInvitation}
          >
            <Text>Decline</Text>
          </Button>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    height: 175,
    marginLeft: 10,
    marginRight: 10,
  },
  title: {
    fontSize: 26,
    color: '#939393',
  },
  titleContainer: {
    borderBottomColor: 'lightgrey',
    borderBottomWidth: 1,
    width: '40%',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  metadata: {
    marginTop: 5,
    color: '#aaa',
  },
  content: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shroud: {
    position: 'absolute',
    backgroundColor: 'rgba(200, 200, 200, 0.30)',
    width: '100%',
    height: '100%',
    alignItems: 'center',
  },
  inviteMessage: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  inviteButtons: {
    flexDirection: 'row',
    marginTop: 'auto',
  },
  inviteButton: {
    margin: 5,
  },
  acceptButton: {
    backgroundColor: '#470FF4',
  },
});

export default InviteCard;
