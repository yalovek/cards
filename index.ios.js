import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  View,
} from 'react-native';

import Deck from './components/Deck';

const CARDS = [
  {
    backgroundColor: '#f00',
  },
  {
    backgroundColor: '#0f0',
  },
  {
    backgroundColor: '#00f',
  },
  {
    backgroundColor: '#ff0',
  },
];
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
  },
});

class Cards extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cards: CARDS,
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <Deck cards={this.state.cards} />
      </View>
    );
  }
}

AppRegistry.registerComponent('Cards', () => Cards);

