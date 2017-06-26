import React, { Component } from 'react';
import {
  StyleSheet,
  Dimensions,
  Animated,
  PanResponder,
} from 'react-native';

import Card from './Card';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const PADDING = 25;
const CARD_WIDTH = SCREEN_WIDTH - PADDING * 2;
const CARD_HEIGHT = SCREEN_HEIGHT - 150;
const SWIPE_THRESHOLD = SCREEN_WIDTH * .3;
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
      direction: 'right',
    };
    this.state.pan = new Animated.ValueXY({
      x: this.state.direction === 'right' ? SCREEN_WIDTH - CARD_WIDTH - PADDING : SCREEN_WIDTH - CARD_WIDTH - SQUEEZE * cardsLength - PADDING,
      y: this.state.direction === 'right' ? SHIFT_TOP * cardsLength : 0,
    });
    this.state.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, {
        dx: this.state.pan.x,
        dy: this.state.pan.y,
      }]),
      onPanResponderRelease: (event, { dx }) => {
        if (dx > SWIPE_THRESHOLD) {
          this.swipe('right');
        } else if (dx < -SWIPE_THRESHOLD) {
          this.swipe('left');
        }
      },
    });
  }

  swipe = (direction) => {
    const { cardsLength } = this.state;

    this.setState({
      direction,
    });

    Animated.spring(
      this.state.pan,
      {
        toValue: {
          x: SCREEN_WIDTH * 1.5,
          y: SHIFT_TOP * cardsLength,
        },
      },
    ).start(() => this.onSwipeComplete(direction));
  }

  onSwipeComplete = (direction) => {
    const { cards, cardsLength } = this.state;

    if (direction === 'right') {
      this.setState({
        pan: new Animated.ValueXY({
          x: SCREEN_WIDTH - CARD_WIDTH - PADDING,
          y: SHIFT_TOP * cardsLength,
        }),
      });

      this.setState({
        cards: [].concat(cards.slice(-1), cards.slice(0, -1)),
      });
    } else {
      this.setState({
        pan: new Animated.ValueXY({
          x: SCREEN_WIDTH - (CARD_WIDTH - SQUEEZE * cardsLength) - PADDING * 2,
          y: 0,
        }),
      });

      this.setState({
        cards: [].concat(cards.slice(1), cards.slice(0, 1)),
      });
    }
  }

  getCardStyle = (direction) => {
    return this.state.direction === direction ? this.state.pan.getLayout() : {};
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

