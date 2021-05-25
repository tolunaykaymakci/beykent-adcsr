import React, {useState, useEffect} from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  SafeAreaView,
  DevSettings,
} from 'react-native';

import {AsyncStorage} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {dump} from '../Service';

const SettingsScreen = ({route, navigation}) => {
  useEffect(() => {
    dump(global.user);
  }, []);

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
      <ScrollView style={{flex: 1, padding: 16}}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            marginTop: 12,
          }}>
          <View
            style={{borderRadius: 35, overflow: 'hidden', alignSelf: 'center'}}>
            <Image
              source={
                global.user.p_img != null
                  ? {uri: 'https://reactnative.dev/img/tiny_logo.png'}
                  : require('../assets/profile_default.png')
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
              marginTop: 8,
              marginBottom: 16,
            }}>
            @{global.user.username}
          </Text>

          <TouchableOpacity style={styles.actionButton}>
            <View style={{flexDirection: 'row', marginStart: 12}}>
              <MaterialIcons
                style={{alignSelf: 'center', marginEnd: 8}}
                name="edit"
                color={'rgb(58,79,101)'}
                size={22}
              />
              <Text style={{alignSelf: 'center'}}>Fotoğrafı Değiştir</Text>
            </View>
            <MaterialIcons
              style={{alignSelf: 'center', marginEnd: 12}}
              name="close"
              color={'rgb(58,79,101)'}
              size={23}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <View style={{flexDirection: 'row', marginStart: 12}}>
              <MaterialIcons
                style={{alignSelf: 'center', marginEnd: 8}}
                name="edit"
                color={'rgb(58,79,101)'}
                size={22}
              />
              <Text style={{alignSelf: 'center'}}>Şifremi Değiştir</Text>
            </View>
            <MaterialIcons
              style={{alignSelf: 'center', marginEnd: 12}}
              name="close"
              color={'rgb(58,79,101)'}
              size={23}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <View style={{flexDirection: 'row', marginStart: 12}}>
              <MaterialIcons
                style={{alignSelf: 'center', marginEnd: 8}}
                name="edit"
                color={'rgb(58,79,101)'}
                size={22}
              />
              <View style={{alignSelf: 'center'}}>
                <Text>Kullanıcı Adım</Text>
                <Text style={{fontWeight: 'bold', fontSize: 13}}>
                  @{global.user.username}
                </Text>
              </View>
            </View>
            <MaterialIcons
              style={{alignSelf: 'center', marginEnd: 12}}
              name="close"
              color={'rgb(58,79,101)'}
              size={23}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <View style={{flexDirection: 'row', marginStart: 12}}>
              <MaterialIcons
                style={{alignSelf: 'center', marginEnd: 8}}
                name="edit"
                color={'rgb(58,79,101)'}
                size={22}
              />
              <View style={{alignSelf: 'center'}}>
                <Text>Email Adresim</Text>
                <Text style={{fontWeight: 'bold', fontSize: 13}}></Text>
              </View>
            </View>
            <MaterialIcons
              style={{alignSelf: 'center', marginEnd: 12}}
              name="close"
              color={'rgb(58,79,101)'}
              size={23}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => logout()}
            style={styles.actionButton}>
            <View style={{flexDirection: 'row', marginStart: 12}}>
              <MaterialIcons
                style={{alignSelf: 'center', marginEnd: 8}}
                name="edit"
                color={'rgb(58,79,101)'}
                size={22}
              />
              <Text style={{alignSelf: 'center'}}>Hesabımdan Çıkış Yap</Text>
            </View>
            <MaterialIcons
              style={{alignSelf: 'center', marginEnd: 12}}
              name="close"
              color={'rgb(58,79,101)'}
              size={23}
            />
          </TouchableOpacity>

          <Text>id = {global.user.a_id}</Text>
        </View>
      </ScrollView>
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
  actionButton: {
    flexDirection: 'row',
    marginStart: 16,
    width: '100%',
    marginEnd: 16,
    marginTop: 3,
    justifyContent: 'space-between',
    marginBottom: 3,
    backgroundColor: 'white',
    height: 54,
    elevation: 2,
  },
});
export default SettingsScreen;
