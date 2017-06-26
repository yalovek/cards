import React, { Component } from 'react';
import {
  StyleSheet,
  Dimensions,
  Animated,
  PanResponder,
  LayoutAnimation,
} from 'react-native';

import Card from './Card';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const PADDING = 25;
const CARD_WIDTH = SCREEN_WIDTH - PADDING * 2;
const CARD_HEIGHT = SCREEN_HEIGHT - 150;
const SHIFT_TOP = 10;
const SQUEEZE = 20;
const styles = StyleSheet.create({
  deck: {
    flex: 1,
    alignItems: 'center',
  },
  card: {
    position: 'absolute',
    height: CARD_HEIGHT,
  },
});

export default class extends Component {
  constructor(props) {
    super(props);

    const cardsLength = props.cards.length - 1;

    this.state = {
      cards: props.cards,
      cardsLength,
    };

    this.direction = 'right';

    this.pan = {
      left: this.direction === 'right' ? SCREEN_WIDTH - CARD_WIDTH - PADDING : SCREEN_WIDTH - CARD_WIDTH + (SQUEEZE * cardsLength) / 2 - PADDING,
      top: this.direction === 'right' ? SHIFT_TOP * cardsLength : 0,
    };

    this.state.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, {
          dx: this.pan.left,
          dy: this.pan.top
        }
      ]),
      onPanResponderRelease: (event, { dx }) => {
        if (dx > 0) {
          this.swipe('right');
        } else if (dx < 0) {
          this.swipe('left');
        }
      },
    });
  }

  componentWillUpdate() {
    LayoutAnimation.spring();
  }

  swipe = (direction) => {
    this.direction = direction;

    this.onSwipeComplete(direction);
  }

  onSwipeComplete = (direction) => {
    const { cards, cardsLength } = this.state;

    if (direction === 'right') {
      this.pan = {
        left: SCREEN_WIDTH - CARD_WIDTH - PADDING,
        top: SHIFT_TOP * cardsLength,
      };

      this.setState({
        cards: [].concat(cards.slice(-1), cards.slice(0, -1)),
      });
    } else {
      this.pan = {
        left: SCREEN_WIDTH - CARD_WIDTH + (SQUEEZE * cardsLength) / 2 - PADDING,
        top: 0,
      };

      this.setState({
        cards: [].concat(cards.slice(1), cards.slice(0, 1)),
      });
    }
  }

  getCardStyle = (direction) => {
    return this.direction === direction ? this.pan : {};
  }

  render() {
    const { cardsLength } = this.state;

    return (
      <Animated.View
        style={styles.deck}
        {...this.state.panResponder.panHandlers}
      >
        {this.state.cards.map((card, key) => key === 0
          ? (
            <Animated.View
              key={key}
              style={[styles.card, {
                top: 0,
                width: CARD_WIDTH - SQUEEZE * cardsLength,
              }, this.getCardStyle('left')]}
            >
              <Card {...card} />
            </Animated.View>
          )
          : key === cardsLength
            ? (
              <Animated.View
                key={key}
                style={[styles.card, {
                  top: SHIFT_TOP * key,
                  width: CARD_WIDTH,
                }, this.getCardStyle('right')]}
              >
                <Card {...card} />
              </Animated.View>
            )
            : (
              <Animated.View
                key={key}
                style={[styles.card, {
                  top: SHIFT_TOP * key,
                  width: CARD_WIDTH - (SQUEEZE * (cardsLength - key)),
                }]}
              >
                <Card {...card} />
              </Animated.View>
            )
        )}
      </Animated.View>
    );
  }
};

