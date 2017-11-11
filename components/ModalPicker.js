import React, { Component } from 'react';
import {
  Modal,
  View,
  TouchableHighlight,
  Animated,
  Text,
  StyleSheet,
} from 'react-native';
import { colors } from "../config/colors";
import Layout from '../config/layout'

const SUPPORTED_ORIENTATIONS = ['portrait', 'portrait-upside-down', 'landscape', 'landscape-left', 'landscape-right'];

export default class ModalPicker extends Component {

  static defaultProps = {
    visible: false,
    cancelBtnText: 'Cancelar',
    confirmBtnText: 'Done',
    // component height: 216(DatePickerIOS) + 1(borderTop) + 44(marginTop), IOS only
    height: 261,
    // slide animation duration time, default to 300ms, IOS only
    duration: 300,
    TouchableComponent: TouchableHighlight,
  }

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      animatedHeight: new Animated.Value(0),
      // allowPointerEvents: true
    };
    this.setVisible = this.setVisible.bind(this);
    this.onPressMask = this.onPressMask.bind(this);
    this.onPressCancel = this.onPressCancel.bind(this);
    this.onPressConfirm = this.onPressConfirm.bind(this);
  }

  /* componentWillReceiveProps(props) {
    console.log('>>> ModalPicker componentWillReceiveProps', props);
    if (props.visible !== this.props.visible) {
      this.setVisible(props.visible);
    }
  } */

  setVisible(visible) {
    const {height, duration} = this.props;
    console.log('>>> ModalPicker setVisible', visible, height, duration);
    // slide animation
    if (visible) {
      this.setState({ visible: visible });
      return Animated.timing(
        this.state.animatedHeight,
        {
          toValue: height,
          duration: duration
        }
      ).start();
    } else {
      return Animated.timing(
        this.state.animatedHeight,
        {
          toValue: 0,
          duration: duration
        }
      ).start(() => {
        this.setState({ visible: visible });
      });
    }
  }

  onStartShouldSetResponder(e) {
    return true;
  }

  onMoveShouldSetResponder(e) {
    return true;
  }

  onPressMask() {
    console.log('>>> ModalPicker onPressMask');
    this.onPressCancel();
  }

  onPressCancel() {
    console.log('>>> ModalPicker onPressCancel');
    this.setVisible(false);
    if (typeof this.props.onCancel === 'function') {
      this.props.onCancel();
    }
  }

  onPressConfirm() {
    console.log('>>> ModalPicker onPressConfirm');
    this.setVisible(false);
    if (typeof this.props.onConfirm === 'function') {
      this.props.onConfirm();
    }
  }

  show() {
    this.setVisible(true);
  }

  hide() {
    this.setVisible(false);
  }

  render() {
    console.log('>>> ModalPicker render()');
    const {
      children,
      cancelBtnText,
      confirmBtnText,
      TouchableComponent,
    } = this.props;

    return (<Modal
      transparent={true}
      animationType="none"
      visible={this.state.visible}
      supportedOrientations={SUPPORTED_ORIENTATIONS}
      onRequestClose={() => { this.setVisible(false); }}
    >
      <View
        style={{flex: 1}}
      >
        <TouchableComponent
          style={styles.pickerMask}
          activeOpacity={1}
          underlayColor={'#00000077'}
          onPress={this.onPressMask}
        >
          <TouchableComponent
            underlayColor={'#fff'}
            style={{ flex: 1 }}
          >
            <Animated.View
              style={[ styles.pickerCon, { height: this.state.animatedHeight } ]}
            >
              <View style={{ flex: 1 }}/* pointerEvents={this.state.allowPointerEvents ? 'auto' : 'none'} */>
                <View style={styles.contentContainer}>
                  {children}
                </View>
              </View>
              <TouchableComponent
                underlayColor={'transparent'}
                onPress={this.onPressCancel}
                style={[ styles.btnText, styles.btnCancel ]}
              >
                <Text
                  style={[ styles.btnTextText, styles.btnTextCancel ]}
                >
                  {cancelBtnText}
                </Text>
              </TouchableComponent>
              <TouchableComponent
                underlayColor={'transparent'}
                onPress={this.onPressConfirm}
                style={[ styles.btnText, styles.btnConfirm ]}
              >
                <Text style={[ styles.btnTextText, styles.btnTextConfirm ]}>{confirmBtnText}</Text>
              </TouchableComponent>
            </Animated.View>
          </TouchableComponent>
        </TouchableComponent>
      </View>
    </Modal>);
  }

  render_old() {
    const {
      cancelBtnText,
      confirmBtnText,
      TouchableComponent,
    } = this.props;
    return (<View style={{ height: Layout.CONTAINER_PADDING, backgroundColor: 'red' }} />);
  }

}

const styles = StyleSheet.create({
  pickerMask: {
    flex: 1,
    alignItems: 'flex-end',
    flexDirection: 'row',
    backgroundColor: '#00000077',
  },
  pickerCon: {
    // backgroundColor: '#fff',
    backgroundColor: '#F9F9F9',
    height: 0,
    overflow: 'hidden',
    // borderTopColor: '#B2B2B2',
    // borderTopWidth: 1,
  },
  btnText: {
    position: 'absolute',
    top: 0,
    height: 44,
    padding: Layout.CONTAINER_PADDING,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnTextText: {
    // https://ivomynttinen.com/blog/ios-design-guidelines
    // https://developer.apple.com/ios/human-interface-guidelines/visual-design/typography/
    fontSize: 17,
    // color: '#46cf98',
    color: '#0076FF',
  },
  btnTextCancel: {
    // color: '#0076FF',
  },
  btnTextConfirm: {
    // TODO: export to settings
    /*
    { fontWeight: '100' }, // Thin
    { fontWeight: '200' }, // Ultra Light
    { fontWeight: '300' }, // Light
    { fontWeight: '400' }, // Regular
    { fontWeight: '500' }, // Medium
    { fontWeight: '600' }, // Semibold
    { fontWeight: '700' }, // Bold
    { fontWeight: '800' }, // Heavy
    { fontWeight: '900' }, // Black
    */
    fontWeight: '600', // Semibold
  },
  btnCancel: {
    left: 0,
  },
  btnConfirm: {
    right: 0,
  },
  contentContainer: {
    marginTop: 44,
    borderColor: colors.divider,
    borderWidth: StyleSheet.hairlineWidth,
    // backgroundColor: '#D2D5DB'
    backgroundColor: colors.lightDivider,
  },
});
