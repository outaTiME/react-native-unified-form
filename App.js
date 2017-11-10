import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
  TouchableOpacity,
} from 'react-native';
import { Constants } from 'expo';
import TextInput from './components/TextInput.js';
import DatePicker from './components/DatePicker.js';
import { colors } from "./config/colors";
import Layout from './config/layout'

export default class App extends Component {
  state = {
    disabled: false,
  };
  _enableInputs() {
    this.setState({ disabled: false });
  }
  _disableInputs() {
    this.setState({ disabled: true });
  }
  render() {
    console.log('>>> App render()');
    const disabled = this.state.disabled;
    return (
      <View style={styles.container}>
        <View style={{ flexGrow: 1, }}>
          <KeyboardAvoidingView behavior='padding' keyboardVerticalOffset={Constants.statusBarHeight} style={{ flex: 1, }}>
            <ScrollView>
              <View style={styles.readonly}>
                <Text style={{ textAlign: 'center' }}>La visita actual ya ha sido confirmada y no puede ser modificada.</Text>
              </View>
              <View style={{ margin: Layout.CONTAINER_PADDING, }}>
                <View style={[ styles.field, ]}>
                  <Text numberOfLines={1} style={styles.field_label}>Cliente</Text>
                  <TextInput
                    // always disabled
                    disabled
                    defaultValue="EFFIO CROVETTO, FELIPE ALBERTO"
                  />
                </View>
                <View style={[ styles.field, ]}>
                  <Text numberOfLines={1} style={styles.field_label}>Fecha y hora</Text>
                  <DatePicker
                    disabled={disabled}
                    defaultValue="foo #1"
                  />
                </View>
                <View style={[ styles.field, ]}>
                  <Text numberOfLines={1} style={styles.field_label}>Tiempo (minutos)</Text>
                  <TextInput
                    disabled={disabled}
                    keyboardType="numeric"
                  />
                </View>
                <View style={[ styles.field, ]}>
                  <Text numberOfLines={1} style={styles.field_label}>Paquetes (1)</Text>
                  <TextInput
                    disabled={disabled}
                    keyboardType="numeric"
                    defaultValue="1"
                  />
                </View>
                <View style={[ styles.field, { marginBottom: 0 } ]}>
                  <Text numberOfLines={1} style={styles.field_label}>Notas</Text>
                  <TextInput
                    disabled={disabled}
                  />
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
        <View style={styles.actionBar}>
          <TouchableOpacity style={[ styles.button, { marginRight: 8 }]} onPress={this._enableInputs.bind(this)}>
            <Text>Habilitar inputs</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[ styles.button, { marginLeft: 8 }]} onPress={this._disableInputs.bind(this)}>
            <Text>Deshabilitar inputs</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
    backgroundColor: colors.container,
  },
  field: {
    flex: 1,
    marginBottom: Layout.CONTAINER_PADDING,
    // borderColor: colors.divider,
    // borderWidth: StyleSheet.hairlineWidth,
  },
  field_label: {
    flex: 1,
    fontWeight: 'bold',
    color: '#2980B9',
    // marginTop: 8,
    // paddingHorizontal: Layout.CONTAINER_PADDING,
    marginBottom: Layout.CONTAINER_PADDING,
  },
  readonly: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: colors.divider,
    backgroundColor: colors.lightDivider,
    padding: Layout.CONTAINER_PADDING,
    // margin: Layout.CONTAINER_PADDING,
    // marginBottom: Layout.CONTAINER_PADDING,
  },
  button: {
    flex: 1,
    height: Layout.INPUT_HEIGHT,
    borderColor: colors.divider,
    borderWidth: StyleSheet.hairlineWidth,
    backgroundColor: colors.lightDivider,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
  },
  actionBar: {
    // height: 49,
    // backgroundColor: colors.lightDivider,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: colors.divider,
    padding: Layout.CONTAINER_PADDING,
    flexDirection: 'row',
  }
});
