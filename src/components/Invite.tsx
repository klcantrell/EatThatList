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
  invitee: string;
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

const REMOVE_COLLABORATOR = gql`
  mutation($inviteId: Int!, $listId: Int!, $userId: String!) {
    delete_Invites(where: { id: { _eq: $inviteId } }) {
      returning {
        id
      }
    }
    delete_ListAccess(
      where: {
        _and: [{ list_id: { _eq: $listId } }, { user_id: { _eq: $userId } }]
      }
    ) {
      affected_rows
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
    removeCollaborator,
    {
      data: removeCollaboratorData,
      loading: removeCollaboratorLoading,
      error: removeCollaboratorError,
    },
  ] = useMutation(REMOVE_COLLABORATOR);

  const onDeleteInvite = () => {
    removeCollaborator({
      variables: {
        inviteId: invite.id,
        listId: invite.list_id,
        userId: invite.invitee,
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
        delete_ListAccess: {
          __typename: 'ListAccess_mutation_response',
          affected_rows: 1,
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

  if (removeCollaboratorError) {
    Alert.alert(
      'Something went wrong removing this collaborator, please try again'
    );
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
