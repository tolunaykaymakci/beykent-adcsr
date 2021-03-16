// React Native Bottom Navigation
// https://aboutreact.com/react-native-bottom-navigation/
import React, {useState} from 'react';
import {
  TouchableOpacity,
  TouchableHighlight,
  TouchableNativeFeedback,
  StyleSheet,
  View,
  TextInput,
  ScrollView,
  Text,
  Button,
  SafeAreaView,
} from 'react-native';

import GlobalStyles from '../src/GlobalStyles';

const HomeScreen = ({navigation}) => {
  /*
    HOME_MODE 0 => TODAYS SUMMARY,
    HOME_MODE 1 => TIMERS,
    HOME_MODE 2 => FRIENDS
  */
  const [homeMode, setHomeMode] = useState(0);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <>
          <Button onPress={() => alert('poncik!')} title="Soru Ekle" />
        </>
      ),
    });
  }, [navigation]);

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{...styles.tabsContainer, display: 'none'}}>
      <View style={[styles.tabsContainer, {display: 'none'}]}>
        <TouchableHighlight
          activeOpacity={0.6}
          underlayColor="#edf3ff"
          onPress={() => setHomeMode(0)}
          style={homeMode == 0 ? styles.tabButtonSelected : styles.tabButton}>
          <Text
            style={
              homeMode == 0
                ? styles.tabButtonTextSelected
                : styles.tabButtonText
            }>
            BUGÜNÜN ÖZETİ
          </Text>
        </TouchableHighlight>

        <TouchableHighlight
          activeOpacity={0.6}
          underlayColor="#edf3ff"
          onPress={() => setHomeMode(1)}
          style={homeMode == 1 ? styles.tabButtonSelected : styles.tabButton}>
          <Text
            style={
              homeMode == 1
                ? styles.tabButtonTextSelected
                : styles.tabButtonText
            }>
            SAYAÇLARIM
          </Text>
        </TouchableHighlight>

        <TouchableHighlight
          activeOpacity={0.6}
          underlayColor="#edf3ff"
          onPress={() => setHomeMode(2)}
          style={homeMode == 2 ? styles.tabButtonSelected : styles.tabButton}>
          <Text
            style={
              homeMode == 2
                ? styles.tabButtonTextSelected
                : styles.tabButtonText
            }>
            ARKADAŞLARIM
          </Text>
        </TouchableHighlight>
      </View>

      {homeMode == 0 ? (
        <HomeSummaryScreen nav={navigation} />
      ) : (
        <Text>Not Implemented Yet</Text>
      )}
    </SafeAreaView>
  );
};

const HomeSummaryScreen = ({nav}) => {
  const [gosterilecekMesaj, mesajiAyarla] = useState('Osman');
  return (
    <View style={{flex: 1}}>
      <ScrollView style={{flex: 1, paddingTop: 12}}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => nav.navigate('SettingsStack', {screen: 'Settings'})}>
          <Text>Soru Çözümlerim</Text>
        </TouchableOpacity>

        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity
            style={{...styles.button, marginEnd: 6}}
            onPress={() => nav.navigate('SettingsStack', {screen: 'Settings'})}>
            <Text>Konu Çalışmalarım</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{...styles.button, marginStart: 6}}
            onPress={() => nav.navigate('SettingsStack', {screen: 'Settings'})}>
            <Text>Tüm Kayıtlarım</Text>
          </TouchableOpacity>
        </View>

        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity
            style={{...styles.button, marginEnd: 6}}
            onPress={() => nav.navigate('SettingsStack', {screen: 'Settings'})}>
            <Text>İstatistiklerim</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{...styles.button, marginStart: 6}}
            onPress={() => nav.navigate('SettingsStack', {screen: 'Settings'})}>
            <Text>Plan Detayları</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => nav.navigate('Details')}>
          <Text>Reklamlaar</Text>
        </TouchableOpacity>

        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity
            style={{...styles.button, marginEnd: 6}}
            onPress={() => nav.navigate('Plans')}>
            <Text>Çalışma Planlarım</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{...styles.button, marginStart: 6}}
            onPress={() => nav.navigate('SettingsStack', {screen: 'Settings'})}>
            <Text>Sayaçlarım</Text>
          </TouchableOpacity>
        </View>

        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity
            style={{...styles.button, marginEnd: 6}}
            onPress={() => nav.navigate('SettingsStack', {screen: 'Settings'})}>
            <Text>Puanlar & Tercih</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{...styles.button, marginStart: 6}}
            onPress={() => nav.navigate('SettingsStack', {screen: 'Settings'})}>
            <Text>Ayarlar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'flex-start',
    backgroundColor: '#DDDDDD',
    padding: 12,
    height: 102,
    flex: 1,
    marginTop: 6,
    marginStart: 12,
    marginEnd: 12,
    borderRadius: 9,
    marginBottom: 6,
  },
  tabsContainer: {
    backgroundColor: 'white',
    flexDirection: 'row',
  },
  tabButton: {
    flex: 1,
    backgroundColor: 'white',
    height: 46,
    alignItems: 'center',
    borderBottomColor: '#dedede',
    borderBottomWidth: 0.8,
    borderTopColor: '#dedede',
    borderTopWidth: 0.8,
    justifyContent: 'center',
  },
  tabButtonSelected: {
    flex: 1,
    backgroundColor: 'white',
    height: 46,
    alignItems: 'center',
    borderBottomColor: '#dedede',
    borderBottomWidth: 0.6,
    borderTopColor: '#dedede',
    borderTopWidth: 0.6,
    justifyContent: 'center',
  },
  tabButtonText: {
    fontSize: 12.75,
    fontWeight: 'bold',
    color: '#646464',
  },
  tabButtonTextSelected: {
    fontSize: 12.75,
    fontWeight: 'bold',
    color: '#5670a3',
  },
});
export default HomeScreen;
