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
    confirmBtnText: 'Aceptar',
    // component height: 216(DatePickerIOS) + 1(borderTop) + 42(marginTop), IOS only
    height: 259,
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
                <Text style={[ styles.btnTextText ]}>{confirmBtnText}</Text>
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
    backgroundColor: '#fff',
    height: 0,
    overflow: 'hidden',
  },
  btnText: {
    position: 'absolute',
    top: 0,
    height: 42,
    padding: Layout.CONTAINER_PADDING,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnTextText: {
    fontSize: 16,
    color: '#46cf98',
  },
  btnTextCancel: {
    color: '#666',
  },
  btnCancel: {
    left: 0,
  },
  btnConfirm: {
    right: 0,
  },
  contentContainer: {
    marginTop: 42,
    borderTopColor: colors.divider,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});
