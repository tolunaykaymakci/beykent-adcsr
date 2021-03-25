import React from 'react';

import {StyleSheet} from 'react-native';

const currentAppTheme = 'light';

export const GlobalColors = {
  statusBarFront: currentAppTheme != 'dark' ? 'dark-content' : 'light-content',
  windowBackground: currentAppTheme != 'dark' ? '#F2F2F5' : '#181818',
  titleText: currentAppTheme != 'dark' ? '#282828' : 'rgba(255,255,255,.9)',
  subText: currentAppTheme != 'dark' ? '#4C4C4C' : 'rgba(255,255,255,.7)',
  primaryCard: currentAppTheme != 'dark' ? '#FFF' : '#252525',
};

export const GlobalStyles = StyleSheet.create({
  primaryCard: {
    marginTop: 6,
    marginBottom: 6,
    marginStart: 12,
    marginEnd: 12,
    borderRadius: 9,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 0.8,
    backgroundColor: GlobalColors.primaryCard,
  },
  homeCard: {
    alignItems: 'flex-start',
    height: 124,
    flex: 1,
  },
  cardTitleText: {
    fontWeight: 'bold',
    color: GlobalColors.titleText,
    fontSize: 14.25,
  },
  titleText: {
    color: GlobalColors.titleText,
    fontSize: 14.25,
  },
  subText: {
    color: GlobalColors.subText,
    fontSize: 13,
  },
});

export default {GlobalColors, GlobalStyles};
