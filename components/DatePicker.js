import React, { Component } from 'react';
import {
  TouchableWithoutFeedback,
  View,
  Text,
  Platform,
  StyleSheet,
  TimePickerAndroid,
  DatePickerAndroid,
  DatePickerIOS,
  Keyboard,
} from 'react-native';
import TextInput from './TextInput.js';
import ModalPicker from './ModalPicker.js';
import Moment from 'moment';
import { colors } from "../config/colors";
import Layout from '../config/layout'

const FORMATS = {
  'date': 'DD/MM/YY',
  'datetime': 'DD/MM/YY HH:mm',
  'time': 'HH:mm'
};

export default class DatePicker extends Component {

  static defaultProps = {
    mode: 'datetime',
  }

  constructor(props) {
    super(props);
    this.state = {
      date: this.getDate(),
    };
    this.getDate = this.getDate.bind(this);
    this.getDateStr = this.getDateStr.bind(this);
    this._datePicked = this._datePicked.bind(this);
    this._onPressButton = this._onPressButton.bind(this);
    this._onDatePicked = this._onDatePicked.bind(this);
    this._onTimePicked = this._onTimePicked.bind(this);
    this._onDatetimePicked = this._onDatetimePicked.bind(this);
    this._onDatetimeTimePicked = this._onDatetimeTimePicked.bind(this);
    this._onDateChange = this._onDateChange.bind(this);
    this._onPressCancel = this._onPressCancel.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.date !== this.props.date) {
      console.log('>>> DatePicker componentWillReceiveProps', nextProps.date);
      this.setState({
        date: this.getDate(nextProps.date),
      });
    }
  }

  getDate(date = this.props.date) {
    const {mode, minDate, maxDate, format = FORMATS[mode]} = this.props;
    if (!date) {
      let now = new Date();
      if (minDate) {
        let _minDate = this.getDate(minDate);
        if (now < _minDate) {
          return _minDate;
        }
      }
      if (maxDate) {
        let _maxDate = this.getDate(maxDate);
        if (now > _maxDate) {
          return _maxDate;
        }
      }
      return now;
    }
    if (date instanceof Date) {
      return date;
    }
    return Moment(date, format).toDate();
  }

  getDateStr(date = this.props.date) {
    const {mode, format = FORMATS[mode]} = this.props;
    if (date instanceof Date) {
      return Moment(date).format(format);
    } else {
      return Moment(this.getDate(date)).format(format);
    }
  }

  _datePicked() {
    const { date } = this.state;
    if (typeof this.props.onDateChange === 'function') {
      this.props.onDateChange(date);
    }
  }

  _is24Hour(format) {
    return !format.match(/h|a/);
  }

  _onPressButton() {
    const { disabled } = this.props;
    if (disabled === true) {
      console.log('>>> DatePicker disabled, ignoring events');
    } else {
      console.log('>>> DatePicker _onPressButton');
      // Keyboard.dismiss();
      // reset state
      this.setState({
        date: this.getDate()
      });
      // check for modal
      const modal = this._modal;
      if (modal) {
        // iOS
        console.log('>>> DatePicker _onPressButton (iOS)');
        modal.show();
      } else {
        // android
        console.log('>>> DatePicker _onPressButton (android)');
         const {mode, format = FORMATS[mode], minDate, maxDate, is24Hour = this._is24Hour(format)} = this.props;
        if (mode === 'date') {
          DatePickerAndroid.open({
            date: this.state.date,
            minDate: minDate && this.getDate(minDate),
            maxDate: maxDate && this.getDate(maxDate),
            // mode: androidMode
          }).then(this._onDatePicked);
        } else if (mode === 'time') {
          let timeMoment = Moment(this.state.date);
          TimePickerAndroid.open({
            hour: timeMoment.hour(),
            minute: timeMoment.minutes(),
            is24Hour: is24Hour
          }).then(this._onTimePicked);
        } else if (mode === 'datetime') {
            DatePickerAndroid.open({
              date: this.state.date,
            }).then(this._onDatetimePicked);
        }
      }
    }
  }

  _onDatePicked({action, year, month, day}) {
    if (action !== DatePickerAndroid.dismissedAction) {
      this.setState({
        date: new Date(year, month, day),
      });
      this._datePicked();
    } else {
      this._onPressCancel();
    }
  }

  _onTimePicked({action, hour, minute}) {
    if (action !== DatePickerAndroid.dismissedAction) {
      this.setState({
        date: Moment().hour(hour).minute(minute).toDate(),
      });
      this._datePicked();
    } else {
      this._onPressCancel();
    }
  }

  _onDatetimePicked({action, year, month, day}) {
    const {mode, format = FORMATS[mode], is24Hour = this._is24Hour(format)} = this.props;
    if (action !== DatePickerAndroid.dismissedAction) {
      let timeMoment = Moment(this.state.date);
      TimePickerAndroid.open({
        hour: timeMoment.hour(),
        minute: timeMoment.minutes(),
        is24Hour: is24Hour
      }).then(this._onDatetimeTimePicked.bind(this, year, month, day));
    } else {
      this._onPressCancel();
    }
  }

  _onDatetimeTimePicked(year, month, day, {action, hour, minute}) {
    if (action !== DatePickerAndroid.dismissedAction) {
      this.setState({
        date: new Date(year, month, day, hour, minute),
      });
      this._datePicked();
    } else {
      this._onPressCancel();
    }
  }

  _onDateChange(date) {
    this.setState({
      date: date
    });
    /*
    this.setState({
      allowPointerEvents: false,
      date: date
    });
    const timeoutId = setTimeout(() => {
      this.setState({
        allowPointerEvents: true
      });
      clearTimeout(timeoutId);
    }, 200); */
  }

  _onPressCancel() {
    /* console.log('>>> DatePicker _onPressCancel()');
    const modal = this._modal;
    if (modal) {
      // iOS
      console.log('>>> DatePicker _onPressCancel (iOS)');
      modal.hide();
    } else {
      // android
      console.log('>>> DatePicker _onPressCancel (android)');
    } */
    // reset state
    /* this.setState({
      date: this.getDate(),
    }); */
  }

  /*
            <View style={[
            { flex: 1, height: 20 },
            modalVisible == true ? { backgroundColor: 'green' } : { backgroundColor: 'blue' }
          ]} />
*/

  render() {
    // TODO: use state to display ModalPicker
    console.log('>>> DatePicker render()');
    const { mode, date, minDate, maxDate, ...attributes } = this.props;
    return (
      <TouchableWithoutFeedback onPress={this._onPressButton}>
        <View>
          <TextInput
            readonly
            {...attributes}
            value={this.getDateStr(date)}
          />
          {Platform.OS === 'ios' && <ModalPicker
            ref={component => this._modal = component}
            onCancel={() => {
              console.log('>>> DatePicker ModalPicker onCancel');
              this._onPressCancel();
            }}
            onConfirm={() => {
              console.log('>>> DatePicker ModalPicker onConfirm');
              this._datePicked();
            }}>
            <DatePickerIOS
              date={this.state.date}
              mode={mode}
              minimumDate={minDate && this.getDate(minDate)}
              maximumDate={maxDate && this.getDate(maxDate)}
              onDateChange={this._onDateChange}
              // minuteInterval={minuteInterval}
              // timeZoneOffsetInMinutes={timeZoneOffsetInMinutes}
              // style={[ styles.datePicker ]}
            />
          </ModalPicker>}
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
});
