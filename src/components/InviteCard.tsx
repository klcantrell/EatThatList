import React from 'react';
import { Card, Text, View, Button } from 'native-base';
import { StyleSheet } from 'react-native';

interface Props {
  name: string;
  itemCount: number;
  inviter: string;
}

const InviteCard: React.FC<Props> = ({ name, itemCount, inviter }) => {
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
          <Button style={styles.inviteButton}>
            <Text>Accept</Text>
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
