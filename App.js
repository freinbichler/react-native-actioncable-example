import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import ActionCable from 'react-native-actioncable';

export default class App extends React.Component {
  state = {
    connected: false,
    messages: []
  }

  componentDidMount() {
    const BASE_URL = '';
    const ACCESS_TOKEN = '';
    const UID = '';
    const CLIENT = '';
    this.cable = ActionCable.createConsumer(`${BASE_URL}/socket/?access-token=${ACCESS_TOKEN}&uid=${UID}&client=${CLIENT}`);
    this.momentsSubscription = this.cable.subscriptions.create(
      {
        channel: 'MomentsChannel',
        moment: 3,
      },
      {
        connected: () => this.setState({ connected: true }),
        disconnected: () => this.setState({ connected: false }),
        received: (data) => {
          console.log(data);
          const messages = [...this.state.messages, data];
          this.setState({ messages: messages });
        },
      }
    );
  }

  componentWillUnmount() {
    if(this.momentsSubscription) {
      this.cable.subscriptions.remove(this.momentsSubscription);
    }
  }

  render() {
    const messages = this.state.messages.map((message, i) => {
      return (<Text key={i}>{message.action}: {message.moment.data.id}</Text>);
    });
    return (
      <View style={styles.container}>
        <Text>Socket Status: {this.state.connected ? 'connected' : 'disconnected'}</Text>
        {messages}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
