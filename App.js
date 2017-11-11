import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
  TouchableOpacity,
  Button,
} from 'react-native';
import { Constants } from 'expo';
import TextInput from './components/TextInput.js';
import DatePicker from './components/DatePicker.js';
import { colors } from "./config/colors";
import Layout from './config/layout'
import { Formik } from 'formik';
import Yup from 'yup';
import Moment from 'moment';

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
    const arrival = new Date();
    // TODO: took default from rels ?
    const duration = 5;
    const departure = Moment(arrival).add(duration, 'minutes').toDate();
    // Moment(values.departure).diff(values.arrival, 'minutes')
    const packages = 9;
    const { disabled, } = this.state;
    return (
      <View style={styles.container}>
        <View style={{ flexGrow: 1, }}>
          <Formik
            initialValues={{
              // TODO: took data from waypoint
              status: 1,
              customer: 'EFFIO CROVETTO, FELIPE ALBERTO',
              arrival: arrival,
              // departure: departure,
              duration: duration,
              packages: packages,
              // notes: '',
            }}
            /* validateOnChange={false}
            validationSchema={Yup.object().shape({
              departure: Yup.number().required().positive().integer(),
              packages: Yup.number().required().positive().integer(),
            })} */
            onSubmit={(
              values,
              { setSubmitting, setErrors /* setValues and other goodies */ }
            ) => {
              console.log('>>> Form values', values);
              setTimeout(() => {
                setSubmitting(false);
              }, 2 * 1000);
            }}
            render={({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
              setFieldValue,
            }) => (
              <KeyboardAvoidingView behavior='padding' keyboardVerticalOffset={Constants.statusBarHeight} style={{ flex: 1, }}>
                <ScrollView>
                  {disabled && <View style={styles.readonly}>
                    <Text style={{ textAlign: 'center' }}>La visita actual ya ha sido confirmada y no puede ser modificada.</Text>
                  </View>}
                  <View style={{ margin: Layout.CONTAINER_PADDING, }}>
                    <View style={[ styles.field, ]}>
                      <Text numberOfLines={1} style={styles.field_label}>Cliente</Text>
                      <TextInput
                        // always disabled
                        disabled
                        defaultValue={values.customer}
                      />
                    </View>
                    <View style={[ styles.field, ]}>
                      <Text numberOfLines={1} style={styles.field_label}>Fecha y hora de llegada</Text>
                      <DatePicker
                        date={values.arrival}
                        maxDate={new Date()}
                        disabled={disabled}
                        onDateChange={date => setFieldValue('arrival', date)}
                        error={touched.arrival && errors.arrival}
                      />
                    </View>
                    <View style={[ styles.field, ]}>
                      <Text numberOfLines={1} style={styles.field_label}>Duración (minutos)</Text>
                      <TextInput
                        value={`${values.duration}`}
                        disabled={disabled}
                        keyboardType="numeric"
                        onChangeText={text => setFieldValue('duration', text)}
                        error={touched.duration && errors.duration}
                      />
                    </View>
                    <View style={[ styles.field, ]}>
                      <Text numberOfLines={1} style={styles.field_label}>Paquetes ({packages})</Text>
                      <TextInput
                        value={`${values.packages}`}
                        disabled={disabled}
                        keyboardType="numeric"
                        onChangeText={text => setFieldValue('packages', text)}
                        error={touched.packages && errors.packages}
                      />
                    </View>
                    <View style={[ styles.field, { marginBottom: 0 } ]}>
                      <Text numberOfLines={1} style={styles.field_label}>Notas</Text>
                      <TextInput
                        value={values.notes}
                        disabled={disabled}
                        onChangeText={text => setFieldValue('notes', text)}
                        error={touched.notes && errors.notes}
                      />
                    </View>
                  </View>
                  <Button onPress={(e) => {
                    setFieldValue('status', 3)
                    handleSubmit(e);
                  }} title="Confirmar" disabled={isSubmitting} />
                  <Button onPress={(e) => {
                    setFieldValue('status', 4)
                    handleSubmit(e);
                  }} title="Rechazar" disabled={isSubmitting} />
                </ScrollView>
              </KeyboardAvoidingView>
            )}
          />
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
