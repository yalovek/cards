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
const FIRST_CARD_LEFT = SCREEN_WIDTH - CARD_WIDTH - PADDING;
const styles = StyleSheet.create({
  deck: {
    flex: 1,
    alignItems: 'center',
  },
  card: {
    position: 'absolute',
  },
});

export default class extends Component {
  constructor(props) {
    super(props);

    const length = props.cards.length - 1;

    this.state = {
      cards: props.cards,
      cardsOut: [],
      pan: new Animated.ValueXY({
        x: FIRST_CARD_LEFT,
        y: SHIFT_TOP * length,
      }),
    };

    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, {
          dx: this.state.pan.x,
          dy: this.state.pan.y,
        },
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
    const { cards, cardsOut } = this.state;
    const length = this.state.cards.length - 1;

    if (direction === 'right') {
      this.setState({
        cards: [].concat(cards.slice(0, -1)),
        cardsOut: [].concat(cardsOut, cards.slice(-1)),
        pan: new Animated.ValueXY({
          x: FIRST_CARD_LEFT,
          y: SHIFT_TOP * (length - 1),
        }),
      });
    } else if (cardsOut.length !== 0) {
      this.setState({
        cards: [].concat(cards, cardsOut.slice(-1)),
        cardsOut: [].concat(cardsOut.slice(0, -1)),
        pan: new Animated.ValueXY({
          x: FIRST_CARD_LEFT,
          y: SHIFT_TOP * (length + 1),
        }),
      });
    }
  }

  render() {
    const length = this.state.cards.length - 1;

    return (
      <Animated.View
        style={styles.deck}
        {...this.panResponder.panHandlers}
      >
        {this.state.cards.map((card, key) => key === 0
          ? (
            <Animated.View
              key={key}
              style={[styles.card, {
                width: CARD_WIDTH - SQUEEZE * length,
                height: CARD_HEIGHT - SQUEEZE * length,
              }]}
            >
              <Card {...card} />
            </Animated.View>
          )
          : key === length
            ? (
              <Animated.View
                key={key}
                style={[styles.card, {
                  width: CARD_WIDTH,
                  height: CARD_HEIGHT,
                }, this.state.pan.getLayout()]}
              >
                <Card {...card} />
              </Animated.View>
            )
            : (
              <Animated.View
                key={key}
                style={[styles.card, {
                  top: SHIFT_TOP * key,
                  width: CARD_WIDTH - (SQUEEZE * (length - key)),
                  height: CARD_HEIGHT - (SQUEEZE * (length - key)),
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

