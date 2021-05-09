import * as React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
  Image,
  SafeAreaView,
  DevSettings,
} from 'react-native';

import {AsyncStorage} from 'react-native';

const SettingsScreen = ({route, navigation}) => {
  const logout = async () => {
    try {
      global.cred = null;
      global.pwd = null;
      global.user = null;
      await AsyncStorage.removeItem('login_user');
      await AsyncStorage.removeItem('login_pwd');
      DevSettings.reload();
    } catch (error) {}
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1, padding: 16}}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View
            style={{borderRadius: 35, overflow: 'hidden', alignSelf: 'center'}}>
            <Image
              source={
                global.user.p_img != null
                  ? {uri: 'https://reactnative.dev/img/tiny_logo.png'}
                  : require('../assest/profile_default.png')
              }
              style={{
                width: 70,
                height: 70,
              }}
              resizeMode="contain"
            />
          </View>

          <Text
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              textAlign: 'center',
              marginTop: 12,
              marginBottom: 16,
            }}>
            @{global.user.username}
          </Text>
          <TouchableOpacity style={styles.button} onPress={() => logout()}>
            <Text>Hesabımdan Çıkış Yap</Text>
          </TouchableOpacity>

          <Text>id = {global.user.a_id}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
    width: 300,
    marginTop: 16,
  },
});
export default SettingsScreen;
