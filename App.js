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
    this.subscription = this.cable.subscriptions.create(
      {
        channel: 'UsersChannel',
        latitude: 47.794952,
        longitude: 13.047461
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
    if(this.subscription) {
      this.cable.subscriptions.remove(this.subscription);
    }
  }

  disconnect = () => {
    alert(this.subscription);
    if(this.subscription) {
      this.cable.subscriptions.remove(this.subscription);
    }
  }

  sendLocation = () => {
    this.subscription.send({
      action: 'location_update',
      latitude: 47.794952,
      longitude: 13.047461
    });
  }

  render() {
    const messages = this.state.messages.map((message, i) => {
      return (<Text key={i}>{message.action}: {message.moment.data.id}</Text>);
    });
    return (
      <View style={styles.container}>
        <Button title="Send Location" onPress={this.sendLocation} />
        <Button title="Disconnect now" onPress={this.disconnect} />
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
