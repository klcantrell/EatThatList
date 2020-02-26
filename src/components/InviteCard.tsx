import React from 'react';
import { Card, Text, View, Button } from 'native-base';
import { StyleSheet, ActivityIndicator } from 'react-native';
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
    insert_ListAccess(
      objects: [{ list_id: 50, user_id: "2k4r67wkbtgpj0jzmyz0i7Vfz1M2" }]
    ) {
      affected_rows
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

  const onAcceptInvitation = async () => {
    setAcceptingInvitation(true);
    await acceptInvitation({
      variables: {
        inviteId,
        userId: auth.userId,
        listId,
      },
      update: (
        proxy,
        {
          data: {
            update_Invites: { returning },
          },
        }
      ) => {
        const returnedIds = returning.map(returned => returned.id);
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
            Invites: Invites.filter(invite => !returnedIds.includes(invite.id)),
          },
        });
      },
    });
  };

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
          <Button style={styles.inviteButton} onPress={onAcceptInvitation}>
            {acceptingInvitation ? (
              <ActivityIndicator style={{ marginRight: 20, marginLeft: 20 }} />
            ) : (
              <Text>Accept</Text>
            )}
          </Button>
          <Button style={[styles.inviteButton, styles.declineButton]}>
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
  declineButton: {
    backgroundColor: '#ff8e2b',
  },
});

export default InviteCard;
