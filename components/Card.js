import React, { Component } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

const styles = StyleSheet.create({
  card: {
    width: '100%',
    height: '100%',
    borderRadius: 5,
  },
});

export default ({ backgroundColor }) => (
  <View style={[styles.card, {
    backgroundColor,
  }]}></View>
);

