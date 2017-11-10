import Expo from 'expo';
import { Platform, PixelRatio, Dimensions } from 'react-native';

const CONTAINER_PADDING = 16;

const NAVBAR_ICON_SIZE = Platform.select({
  ios: () => 27,
  android: () => 24
})();

const NAVBAR_LEFT_ICON_STYLE = {
  ...Platform.select({
    ios: {
      marginLeft: 12,
      marginRight: 10,
    },
    android: {
      marginHorizontal: CONTAINER_PADDING,
    },
  }),
};

const NAVBAR_RIGHT_ICON_STYLE = {
  ...Platform.select({
    ios: {
      marginLeft: 10,
      marginRight: 12,
    },
    android: {
      marginHorizontal: CONTAINER_PADDING,
    },
  }),
};

// https://github.com/react-community/react-navigation/blob/master/src/views/Header/Header.js#L37
const APPBAR_HEIGHT = Platform.select({
  ios: () => 44,
  android: () => 56
})() + Expo.Constants.statusBarHeight;

const INPUT_HEIGHT = 34;

//
// Method to normalize size of fonts across devices
//
// Some code taken from https://jsfiddle.net/97ty7yjk/ &
// https://stackoverflow.com/questions/34837342/font-size-on-iphone-6s-plus
//
// author: @xiaoneng
// date: 14/10/2016
// version: 03
//

// const React = require('react-native'); // eslint-disable-line no-undef
// const { PixelRatio, Dimensions } = React;

const pixelRatio = PixelRatio.get();
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

// -- Testing Only --
// const fontScale = PixelRatio.getFontScale();
// const layoutSize = PixelRatio.getPixelSizeForLayoutSize(14);
// console.log('normalizeText getPR ->', pixelRatio);
// console.log('normalizeText getFS ->', fontScale);
// console.log('normalizeText getDH ->', deviceHeight);
// console.log('normalizeText getDW ->', deviceWidth);
// console.log('normalizeText getPSFLS ->', layoutSize);

const normalize = size => {
  if (pixelRatio === 2) {
    // iphone 5s and older Androids
    if (deviceWidth < 360) {
      return size * 0.95;
    }
    // iphone 5
    if (deviceHeight < 667) {
      return size;
      // iphone 6-6s
    } else if (deviceHeight >= 667 && deviceHeight <= 735) {
      return size * 1.15;
    }
    // older phablets
    return size * 1.25;
  }
  if (pixelRatio === 3) {
    // catch Android font scaling on small machines
    // where pixel ratio / font scale ratio => 3:3
    if (deviceWidth <= 360) {
      return size;
    }
    // Catch other weird android width sizings
    if (deviceHeight < 667) {
      return size * 1.15;
      // catch in-between size Androids and scale font up
      // a tad but not too much
    }
    if (deviceHeight >= 667 && deviceHeight <= 735) {
      return size * 1.2;
    }
    // catch larger devices
    // ie iphone 6s plus / 7 plus / mi note 等等
    return size * 1.27;
  }
  if (pixelRatio === 3.5) {
    // catch Android font scaling on small machines
    // where pixel ratio / font scale ratio => 3:3
    if (deviceWidth <= 360) {
      return size;
      // Catch other smaller android height sizings
    }
    if (deviceHeight < 667) {
      return size * 1.2;
      // catch in-between size Androids and scale font up
      // a tad but not too much
    }
    if (deviceHeight >= 667 && deviceHeight <= 735) {
      return size * 1.25;
    }
    // catch larger phablet devices
    return size * 1.4;
  }
  // if older device ie pixelRatio !== 2 || 3 || 3.5
  return size;
};

export default {
  CONTAINER_PADDING,
  NAVBAR_ICON_SIZE,
  NAVBAR_LEFT_ICON_STYLE,
  NAVBAR_RIGHT_ICON_STYLE,
  APPBAR_HEIGHT,
  INPUT_HEIGHT,
  normalize,
}