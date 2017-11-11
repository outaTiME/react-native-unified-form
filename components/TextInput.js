import React, { Component } from 'react';
import {
  StyleSheet,
  TextInput as ReactTextInput,
  Platform,
} from 'react-native';
import { colors } from "../config/colors";
import Layout from '../config/layout'

export default class TextInput extends Component {

  static defaultProps = {
    disabled: false,
    readonly: false,
  }

  render() {
    const { style, disabled, readonly, error, ...attributes } = this.props;
    const editable = !disabled && !readonly;
    const props = {
      style: [
        style,
        styles.textInput,
        disabled === true && styles.textInputDisabled,
        error && styles.textError,
      ],
      underlineColorAndroid: 'transparent',
      ...attributes,
      // forced
      editable: editable,
      pointerEvents: editable !== false ? 'auto' : 'none',
    };
    return (
      <ReactTextInput {...props} />
    );
  }
}

const styles = StyleSheet.create({
  textInput: {
    flex: 1,
    borderColor: colors.divider,
    borderWidth: StyleSheet.hairlineWidth,
    paddingVertical: Platform.OS === 'ios' ? 7 : 0,
    paddingHorizontal: 7,
    height: Layout.INPUT_HEIGHT,
    borderRadius: 4,
    // fontSize: 17,
  },
  textInputDisabled: {
    backgroundColor: colors.lightDivider,
  },
  textError: {
    // TODO: export same as ActionButton
    borderColor: '#C0392B',
    borderWidth: 1,
  },
});
