import React, {useState, useEffect} from 'react';

import {useIsFocused} from '@react-navigation/native';

import {
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {authorizedRequest} from '../Service';
import moment from 'moment';

function App({route, navigation}) {
  const [timers, setTimers] = useState();
  const isFocused = useIsFocused();

  useEffect(() => {
    gatherTimers();
  }, [isFocused]);

  function gatherTimers() {
    authorizedRequest('ss/sdb/timers', {timer_id: -1})
      .then((response) => response.json())
      .then((json) => {
        setTimers(json.timers);
      })
      .catch((error) => console.error(error))
      .finally(() => {});
  }

  const deleteTimerAlert = (timerId) =>
    Alert.alert('Sayacı Sil?', 'Bu sayaç silinsin mi?', [
      {
        text: 'VAZGEÇ',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'EVET',
        onPress: () => {
          authorizedRequest('ss/sdb/timers/delete', {timer_id: timerId})
            .then((response) => {
              gatherTimers();
            })
            .catch((error) => console.error(error))
            .finally(() => {});
        },
      },
    ]);

  const TimerWidget = ({sdbtimer, mini, nav}) => {
    const [timerText, setTimerText] = useState('');

    useEffect(() => {
      progressTimer();
      setInterval(
        function () {
          progressTimer();
        }.bind(this),
        100,
      );
    }, []);

    const backColor = () => {
      switch (sdbtimer.color) {
        case 'green':
          return 'rgba(60,143,85,.8)';
        case 'red':
          return 'rgba(163,67,67,.8)';
        case 'purple':
          return 'rgba(126,75,170,.8)';
        case 'orange':
          return 'rgba(211,135,55,.8)';
        default:
          return 'rgba(66,119,154,.8)';
      }
    };

    function progressTimer() {
      var timer = sdbtimer;

      //let date1 = new Date();
      //let date2 = new Date(Number(timer.date));
      //var millis = Math.abs(date1 - date2);

      globalThis.infront = timer;

      let millis =
        new Date().getTime() - moment(timer.target_date).toDate().getTime();

      if ((timer.future && millis >= 0) || (!timer.future && millis <= 0)) {
        timer.done = true;
      }

      let secondsInMilli = 1000;
      let minutesInMilli = secondsInMilli * 60;
      let hoursInMilli = minutesInMilli * 60;
      let daysInMilli = hoursInMilli * 24;

      let elapsedDays = millis / daysInMilli;
      millis = millis % daysInMilli;
      let elapsedHours = millis / hoursInMilli;
      millis = millis % hoursInMilli;
      let elapsedMinutes = millis / minutesInMilli;
      millis = millis % minutesInMilli;
      let elapsedSeconds = millis / secondsInMilli;

      elapsedDays = Math.floor(elapsedDays);
      elapsedHours = Math.floor(elapsedHours);
      elapsedMinutes = Math.floor(elapsedMinutes);
      elapsedSeconds = Math.floor(elapsedSeconds);

      var made = '';
      if (elapsedDays == 0) {
        made =
          (elapsedHours.toString().length == 1
            ? '0' + elapsedHours
            : elapsedHours) +
          ':' +
          (elapsedMinutes.toString().length == 1
            ? '0' + elapsedMinutes
            : elapsedMinutes) +
          ':' +
          (elapsedSeconds.toString().length == 1
            ? '0' + elapsedSeconds
            : elapsedSeconds + '');
      } else {
        made = (
          elapsedDays +
          ' gün ' +
          elapsedHours +
          ' saat ' +
          elapsedMinutes +
          ' dakika ' +
          elapsedSeconds +
          ' saniye'
        )
          .replace('  ', '')
          .trim();
      }

      setTimerText(made);

      /*
      
          private String makeTimerProcessText(SDBTimer timer) {

        long millis = Calendar.getInstance().getTimeInMillis() - timer.getDate().getTimeInMillis();

        if (timer.isFuture() && millis >= 0) {
            timer.setDone(true);
        }

        if (!timer.isFuture() && millis <= 0) {
            timer.setDone(true);
        }

        millis = Math.abs(millis);

        long secondsInMilli = 1000;
        long minutesInMilli = secondsInMilli * 60;
        long hoursInMilli = minutesInMilli * 60;
        long daysInMilli = hoursInMilli * 24;

        long elapsedDays = millis / daysInMilli;
        millis = millis % daysInMilli;
        long elapsedHours = millis / hoursInMilli;
        millis = millis % hoursInMilli;
        long elapsedMinutes = millis / minutesInMilli;
        millis = millis % minutesInMilli;
        long elapsedSeconds = millis / secondsInMilli;

        if (elapsedDays == 0) {
            return (String.valueOf(elapsedHours).length() == 1 ? "0" + elapsedHours : elapsedHours) + ":" +
                    (String.valueOf(elapsedMinutes).length() == 1 ? "0" + elapsedMinutes : elapsedMinutes) + ":" +
                    (String.valueOf(elapsedSeconds).length() == 1 ? "0" + elapsedSeconds : elapsedSeconds + "");
        }

        return (elapsedDays + " gün " + elapsedHours + " saat " + elapsedMinutes + " dakika " + elapsedSeconds + " saniye").replace("  ", "").trim();
    }

      
      */
    }

    const widgetStyle = function () {
      return {
        ...styles.timerWidget,
        backgroundColor: backColor(),
      };
    };

    return (
      <TouchableOpacity
        style={widgetStyle()}
        onPress={() => deleteTimerAlert(sdbtimer.timer_id)}>
        <View style={{padding: 12, backgroundColor: 'rgba(255,255,255,.12)'}}>
          <Text style={{color: 'white'}}>{sdbtimer.name}</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            flex: 1,
          }}>
          <MaterialIcons
            style={{marginStart: 12, marginEnd: 12, alignSelf: 'center'}}
            name="timer"
            color={'rgb(255,255,255)'}
            size={29}
          />
          <View style={{alignSelf: 'center'}}>
            <Text style={{color: 'white'}}>Kalan Süre</Text>
            <Text style={{color: 'white', fontWeight: 'bold', marginTop: 4}}>
              {timerText}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      {timers == null ? (
        <Text>Bir saniye...</Text>
      ) : (
        <ScrollView>
          {timers.map((timer, i) => (
            <TimerWidget sdbtimer={timer} nav={navigation} mini={false} />
          ))}
        </ScrollView>
      )}

      <TouchableOpacity
        onPress={() => navigation.navigate('AddTimer', {})}
        style={{
          backgroundColor: 'rgba(52, 106, 172, 1)',
          width: 64,
          borderRadius: 32,
          height: 64,
          shadowOpacity: 0.43,
          shadowRadius: 2.62,
          elevation: 1,
          position: 'absolute',
          alignItems: 'center',
          bottom: 0,
          right: 0,
          margin: 16,
        }}>
        <MaterialIcons
          style={{alignSelf: 'center', marginTop: 15}}
          name="add-alarm"
          color={'rgb(255,255,255)'}
          size={32}
        />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  timerWidget: {
    marginStart: 12,
    marginEnd: 12,
    flexDirection: 'column',
    backgroundColor: 'firebrick',
    height: 120,
    marginTop: 6,
    marginBottom: 6,
    borderRadius: 12,
  },
});

export default App;
