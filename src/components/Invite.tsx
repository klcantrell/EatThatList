import React from 'react';
import { StyleSheet, Alert } from 'react-native';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { ListItem, Text, View, Left, Right, Button, Icon } from 'native-base';

interface Invite {
  Invited: {
    email: string;
  };
  accepted: boolean | null;
  id: number;
  list_id: number;
}

interface Props {
  invite: Invite;
}

export const GET_COLLABORATORS = gql`
  query($listId: Int!) {
    Invites(where: { list_id: { _eq: $listId } }) {
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
`;

const DELETE_INVITE = gql`
  mutation($inviteId: Int!) {
    delete_Invites(where: { id: { _eq: $inviteId } }) {
      returning {
        id
      }
    }
  }
`;

const getInviteStatus = (accepted: boolean | null) => {
  if (accepted === null) {
    return 'Pending';
  } else if (accepted) {
    return 'Accepted';
  } else {
    return 'Declined';
  }
};

const Invite: React.FC<Props> = ({ invite }) => {
  const [
    deleteInvite,
    {
      data: deleteInviteData,
      loading: deleteInviteLoading,
      error: deleteInviteError,
    },
  ] = useMutation(DELETE_INVITE);

  const onDeleteInvite = () => {
    deleteInvite({
      variables: {
        inviteId: invite.id,
      },
      optimisticResponse: {
        __typename: 'mutation_root',
        delete_Invites: {
          __typename: 'Invites_mutation_response',
          returning: {
            __typename: 'Invites',
            id: invite.id,
          },
        },
      },
      update: (
        proxy,
        {
          data: {
            delete_Invites: { returning },
          },
        }
      ) => {
        if (!returning.length) {
          return;
        }
        const returnedIds = returning.map(returned => returned.id);
        const { Invites } = proxy.readQuery({
          query: GET_COLLABORATORS,
          variables: {
            listId: invite.list_id,
          },
        });
        proxy.writeQuery({
          query: GET_COLLABORATORS,
          variables: {
            listId: invite.list_id,
          },
          data: {
            Invites: Invites.filter(invite => !returnedIds.includes(invite.id)),
          },
        });
      },
    });
  };

  const showDeletePrompt = () => {
    Alert.alert(
      'Remove invite',
      'Are you sure you want to remove this invite?',
      [
        { text: 'Cancel', style: 'default' },
        { text: 'Do it', style: 'destructive', onPress: onDeleteInvite },
      ]
    );
  };

  if (deleteInviteError) {
    Alert.alert('There was a problem deleting the invite, please try again');
  }

  return (
    <ListItem>
      <Left>
        <Text>{invite.Invited.email}</Text>
        <View style={styles.status}>
          <Text style={styles.statusText}>
            {getInviteStatus(invite.accepted)}
          </Text>
        </View>
      </Left>
      <Right>
        <Button danger bordered onPress={showDeletePrompt}>
          <Icon
            style={{
              marginRight: 10,
              marginLeft: 10,
              marginTop: 0,
              marginBottom: 0,
            }}
            name="remove-circle"
          />
        </Button>
      </Right>
    </ListItem>
  );
};

const styles = StyleSheet.create({
  status: {
    borderColor: 'lightgrey',
    borderWidth: 1,
    padding: 5,
    marginHorizontal: 5,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 14,
    color: '#808080',
  },
});

export default Invite;
