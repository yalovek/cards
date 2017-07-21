import React, { Component } from 'react';
import {
  StyleSheet,
  Dimensions,
  Animated,
  PanResponder,
  LayoutAnimation,
} from 'react-native';

import Card from '../Card';

const clamp = (value, min, max) => min < max
  ? (value < min ? min : value > max ? max : value)
  : (value < max ? max : value > min ? min : value);
const SWIPE_THRESHOLD = 120;
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const PADDING = 25;
const CARD_WIDTH = SCREEN_WIDTH - PADDING * 2;
const CARD_HEIGHT = SCREEN_HEIGHT - 150;
const CARD_LEFT = SCREEN_WIDTH + PADDING;
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

    this.state = {
      cards: props.cards.slice(4),
      cardsIn: props.cards.slice(0, 4),
      cardsOut: [],
      panIn: new Animated.ValueXY({
        x: 0,
        y: 0,
      }),
      panOut: new Animated.ValueXY({
        x: CARD_LEFT,
        y: 0,
      }),
      direction: 'right',
    };

    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, onPanResponder) => {
        const { vx, vy } = onPanResponder;
        const velocity = vx >= 0 ? clamp(vx, 4.5, 10) : clamp(vx * -1, 4.5, 10) * -1;

        if (velocity > 0) {
          this.setState({
            direction: 'right',
          });

          return Animated.event([null, {
              dx: this.state.panIn.x,
              dy: this.state.panIn.y,
            },
          ])(event, onPanResponder);
        } else {
          this.setState({
            direction: this.state.cardsOut.length === 0 ? 'right' : 'left',
          });

          return Animated.event([null, {
              dx: this.state.panOut.x,
              dy: this.state.panOut.y,
            },
          ])(event, onPanResponder);
        }
      },
      onPanResponderRelease: (event, { vx, vy }) => {
        const { panIn, panOut } = this.state;
        const velocity = vx >= 0 ? clamp(vx, 4.5, 10) : clamp(vx * -1, 4.5, 10) * -1;

        if (Math.abs(panIn.x._value) > SWIPE_THRESHOLD && velocity > 0) {
          Animated.decay(panIn, {
            velocity: {
              x: velocity,
              y: vy,
            },
            deceleration: 0.98,
          }).start(() => {
            panIn.setValue({
              x: 0,
              y: 0,
            });

            this.swipe('right');
          });
        } else if (Math.abs(panIn.x._value) < SWIPE_THRESHOLD) {
          Animated.spring(panIn, {
            toValue: {
              x: 0,
              y: 0,
            },
            friction: 4,
          }).start();
        }

        if (Math.abs(panOut.x._value) > SWIPE_THRESHOLD && velocity < 0) {
          Animated.decay(panOut, {
            velocity: {
              x: velocity,
              y: vy,
            },
            deceleration: 0.98,
          }).start(() => {
            panOut.setValue({
              x: CARD_LEFT,
              y: 0,
            });

            this.swipe('left');
          });
        } else if (Math.abs(panOut.x._value) < SWIPE_THRESHOLD) {
          Animated.spring(panOut, {
            toValue: {
              x: 0,
              y: 0,
            },
            friction: 4,
          }).start();
        }
      },
    });
  }

  componentWillUpdate() {
    LayoutAnimation.spring();
  }

  swipe = (direction) => {
    const { cards, cardsIn, cardsOut } = this.state;
    const cardsInLength = cardsIn.length;
    const cardsOutLength = cardsOut.length;

    if (direction === 'right' && cardsInLength !== 0) {
      this.setState({
        cards: [].concat(cards.slice(1)),
        cardsIn: [].concat(cardsIn.slice(1), cards.slice(0, 1)),
        cardsOut: [].concat(cardsOut, cardsIn.slice(0, 1)),
      });
    } else if (direction === 'left' && cardsOutLength !== 0) {
      this.setState({
        cards: [].concat(cardsInLength < 4 ? [] : cardsIn.slice(-1), cards),
        cardsIn: [].concat(cardsOut.slice(-1), cardsInLength < 4 ? cardsIn : cardsIn.slice(0, -1)),
        cardsOut: [].concat(cardsOut.slice(0, -1)),
      });
    }
  }

  render() {
    const { cardsIn, cardsOut, panIn, panOut, direction } = this.state;
    const lengthIn = cardsIn.length - 1;
    const rotateIn = panIn.x.interpolate({
      inputRange: [0, 400],
      outputRange: ['0deg', '10deg'],
      extrapolate: 'clamp',
    });
    const translateIn = [
      panIn.x.interpolate({
        inputRange: [0, 400],
        outputRange: [40, 40],
        extrapolate: 'clamp',
      }),
      panIn.x.interpolate({
        inputRange: [0, 400],
        outputRange: [0, 40],
        extrapolate: 'clamp',
      }),
      panIn.x.interpolate({
        inputRange: [0, 400],
        outputRange: [-40, 0],
        extrapolate: 'clamp',
      }),
      panIn.x.interpolate({
        inputRange: [0, 400],
        outputRange: [-80, -40],
        extrapolate: 'clamp',
      }),
    ];
    const scaleIn = [
      panIn.x.interpolate({
        inputRange: [0, 400],
        outputRange: [1, 1],
        extrapolate: 'clamp',
      }),
      panIn.x.interpolate({
        inputRange: [0, 400],
        outputRange: [0.9, 1],
        extrapolate: 'clamp',
      }),
      panIn.x.interpolate({
        inputRange: [0, 400],
        outputRange: [0.8, 0.9],
        extrapolate: 'clamp',
      }),
      panIn.x.interpolate({
        inputRange: [0, 400],
        outputRange: [0.7, 0.8],
        extrapolate: 'clamp',
      }),
    ];
    const translateOut = [
      panOut.x.interpolate({
        inputRange: [-400, 0],
        outputRange: [0, 40],
        extrapolate: 'clamp',
      }),
      panOut.x.interpolate({
        inputRange: [-400, 0],
        outputRange: [-40, 0],
        extrapolate: 'clamp',
      }),
      panOut.x.interpolate({
        inputRange: [-400, 0],
        outputRange: [-80, -40],
        extrapolate: 'clamp',
      }),
      panOut.x.interpolate({
        inputRange: [-400, 0],
        outputRange: [-120, -80],
        extrapolate: 'clamp',
      }),
    ];
    const scaleOut = [
      panOut.x.interpolate({
        inputRange: [-400, 0],
        outputRange: [0.9, 1],
        extrapolate: 'clamp',
      }),
      panOut.x.interpolate({
        inputRange: [-400, 0],
        outputRange: [0.8, 0.9],
        extrapolate: 'clamp',
      }),
      panOut.x.interpolate({
        inputRange: [-400, 0],
        outputRange: [0.7, 0.8],
        extrapolate: 'clamp',
      }),
      panOut.x.interpolate({
        inputRange: [-400, 0],
        outputRange: [0.6, 0.7],
        extrapolate: 'clamp',
      }),
    ];
    const lengthOut = cardsOut.length - 1;
    const cardOut = cardsOut[lengthOut];
    const rotateOut = panOut.x.interpolate({
      inputRange: [-400, 0],
      outputRange: ['0deg', '10deg'],
      extrapolate: 'clamp',
    });
    const translateXOut = panOut.x.interpolate({
      inputRange: [0, 400],
      outputRange: [CARD_LEFT, CARD_LEFT + 400],
    });

    return (
      <Animated.View
        style={styles.deck}
        {...this.panResponder.panHandlers}
      >
        {cardsIn.map((card, key) => (
          <Animated.View
            key={key}
            style={[styles.card, {
              zIndex: lengthIn - key,
              width: CARD_WIDTH,
              height: CARD_HEIGHT,
            }, {
              transform: [
                {
                  translateX: key === 0 && direction === 'right' ? panIn.x : 0,
                },
                {
                  translateY: direction === 'right' ? translateIn[key] : translateOut[key],
                },
                {
                  rotate: key === 0 ? rotateIn : '0deg'
                },
                {
                  scaleX: direction === 'right' ? scaleIn[key] : scaleOut[key],
                },
                {
                  scaleY: direction === 'right' ? scaleIn[key] : scaleOut[key],
                },
              ],
            }]}
          >
            <Card {...card} />
          </Animated.View>
        ))}
        <Animated.View
          style={[styles.card, {
            zIndex: 4,
            width: CARD_WIDTH,
            height: CARD_HEIGHT,
          }, {
            transform: [
              {
                translateX: translateXOut,
              },
              {
                translateY: 40,
              },
              {
                rotate: rotateOut
              },
            ],
          }]}
        >
          <Card {...cardOut} />
        </Animated.View>
      </Animated.View>
    );
  }
};

