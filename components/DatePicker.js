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
} from 'react-native';
import TextInput from './TextInput.js';
import ModalPicker from './ModalPicker.js';
import Moment from 'moment';
import { colors } from "../config/colors";
import Layout from '../config/layout'

const FORMATS = {
  // 'date': 'YYYY-MM-DD',
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
    this._onPressButton = this._onPressButton.bind(this);
    this._onDatePicked = this._onDatePicked.bind(this);
    this._onTimePicked = this._onTimePicked.bind(this);
    this._onDatetimePicked = this._onDatetimePicked.bind(this);
    this._onDatetimeTimePicked = this._onDatetimeTimePicked.bind(this);
    this._onDateChange = this._onDateChange.bind(this);
    this._onPressCancel = this._onPressCancel.bind(this);
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

  _is24Hour(format) {
    return !format.match(/h|a/);
  }

  _onPressButton() {
    const { disabled } = this.props;
    if (disabled === true) {
      console.log('>>> DatePicker disabled, ignoring events');
    } else {
      console.log('>>> DatePicker _onPressButton');
      const modal = this._modal;
      if (modal) {
        // iOS
        console.log('>>> DatePicker _onPressButton (iOS)');
        modal.show();
      } else {
        // android
        console.log('>>> DatePicker _onPressButton (android)');
         const {mode, format = FORMATS[mode], /* minDate, maxDate, */ is24Hour = this._is24Hour(format)} = this.props;
        if (mode === 'date') {
          DatePickerAndroid.open({
            date: this.state.date,
            // minDate: minDate && this.getDate(minDate),
            // maxDate: maxDate && this.getDate(maxDate),
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
      // TODO: call to _onDateChange?
      this.setState({
        date: new Date(year, month, day),
      });
      // this.datePicked();
    } else {
      this._onPressCancel();
    }
  }

  _onTimePicked({action, hour, minute}) {
    if (action !== DatePickerAndroid.dismissedAction) {
      // TODO: call to _onDateChange?
      this.setState({
        date: Moment().hour(hour).minute(minute).toDate(),
      });
      // this.datePicked();
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
      // TODO: call to _onDateChange?
      this.setState({
        date: new Date(year, month, day, hour, minute),
      });
    } else {
      this._onPressCancel();
    }
  }

  _onDateChange(date) {
    this.setState({
      date: date
    });
  }

  _onPressCancel() {
    console.log('>>> DatePicker _onPressCancel()');
    const modal = this._modal;
    if (modal) {
      // iOS
      console.log('>>> DatePicker _onPressCancel (iOS)');
      modal.hide();
    } else {
      // ???
    }
  }

  /*
            <View style={[
            { flex: 1, height: 20 },
            modalVisible == true ? { backgroundColor: 'green' } : { backgroundColor: 'blue' }
          ]} />
*/

  render() {
    console.log('>>> DatePicker render()');
    const { mode, ...attributes } = this.props;
    const { date } = this.state;
    return (
      <TouchableWithoutFeedback onPress={this._onPressButton}>
        <View>
          <TextInput
            readonly
            {...attributes}
            value={this.getDateStr(date)}
          />
           {Platform.OS === 'ios' && <ModalPicker ref={component => this._modal = component}>
            <DatePickerIOS
              date={date}
              mode={mode}
              // minimumDate={minDate && this.getDate(minDate)}
              // maximumDate={maxDate && this.getDate(maxDate)}
              onDateChange={this._onDateChange}
              // minuteInterval={minuteInterval}
              // timeZoneOffsetInMinutes={timeZoneOffsetInMinutes}
              style={[ styles.datePicker ]}
            />
          </ModalPicker>}
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  datePicker: {
    marginTop: 42,
    borderTopColor: colors.divider,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});
