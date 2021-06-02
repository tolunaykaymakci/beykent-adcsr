import React from 'react';

import {StyleSheet} from 'react-native';

const currentAppTheme = 'light';

export const GlobalColors = {
  statusBarFront: 'dark-content',
  windowBackground: currentAppTheme != 'dark' ? '#F2F2F5' : '#181818',
  titleText: currentAppTheme != 'dark' ? '#282828' : 'rgba(255,255,255,.9)',
  subText: currentAppTheme != 'dark' ? '#4C4C4C' : 'rgba(255,255,255,.7)',

  primaryCard: currentAppTheme != 'dark' ? '#FFFFFF' : '#222222',
  secondaryCard: currentAppTheme != 'dark' ? '#F9F9F9' : '#181818',
  attentionCard: currentAppTheme != 'dark' ? '#E8E8E8' : '#373737',
  headerSecondary: currentAppTheme != 'dark' ? '#FFFFFF' : '#2A2A2A',

  seperator:
    currentAppTheme != 'dark' ? 'rgba(0,0,0,.15)' : 'rgba(255,255,255,.15)',

  headerBackground: 'white',

  accentColor: 'rgba(70,118,163,1)',
};

export const GlobalStyles = StyleSheet.create({
  primaryCard: {
    marginTop: 6,
    marginBottom: 6,
    marginStart: 12,
    marginEnd: 12,
    borderRadius: 4,
    overflow: 'hidden',
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
