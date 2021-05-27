import React, {useState, useEffect, useRef} from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
  Button,
  Image,
  ScrollView,
  SafeAreaView,
  DevSettings,
} from 'react-native';

import {AsyncStorage} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {authorizedRequest, dump, updateUserInfo} from '../Service';

import InputDialog from '../src/components/dialogs/InputDialog';
import RBSheet from 'react-native-raw-bottom-sheet';

// we need to re-request user data after any changes on this page

const CanSendFRSheet = ({refs, selected}) => {
  return (
    <RBSheet
      ref={refs}
      closeOnDragDown={true}
      closeOnPressMask={true}
      customStyles={{
        wrapper: {
          backgroundColor: 'rgba(0,0,0,.3)',
        },
        draggableIcon: {
          backgroundColor: '#000',
        },
        container: {
          backgroundColor: '#fff',
        },
      }}>
      <Text style={{padding: 12, fontSize: 16}}>
        Arkadaşlık İsteği Gönderilebilsin
      </Text>

      <TouchableOpacity
        style={{padding: 12, paddingBottom: 6}}
        onPress={() => selected('true')}>
        <Text style={{fontWeight: 'bold', fontSize: 16}}>Evet</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{padding: 12, paddingBottom: 6}}
        onPress={() => selected('false')}>
        <Text style={{fontWeight: 'bold', fontSize: 16}}>Hayır</Text>
      </TouchableOpacity>
    </RBSheet>
  );
};

const ReportsAccessSheet = ({refs, selected}) => {
  return (
    <RBSheet
      ref={refs}
      closeOnDragDown={true}
      closeOnPressMask={true}
      customStyles={{
        wrapper: {
          backgroundColor: 'rgba(0,0,0,.3)',
        },
        draggableIcon: {
          backgroundColor: '#000',
        },
        container: {
          backgroundColor: '#fff',
        },
      }}>
      <Text style={{padding: 12, fontSize: 16}}>
        Çalışma Raporlarımı Görebilenler
      </Text>

      <TouchableOpacity
        style={{padding: 12, paddingBottom: 6}}
        onPress={() => selected('OnlyMe')}>
        <Text style={{fontWeight: 'bold', fontSize: 16}}>Sadece Ben</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{padding: 12, paddingBottom: 6}}
        onPress={() => selected('OnlyFriends')}>
        <Text style={{fontWeight: 'bold', fontSize: 16}}>
          Sadece Arkadaşlarım
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{padding: 12, paddingBottom: 6}}
        onPress={() => selected('Everyone')}>
        <Text style={{fontWeight: 'bold', fontSize: 16}}>Herkes</Text>
      </TouchableOpacity>
    </RBSheet>
  );
};

const SettingsScreen = ({route, navigation}) => {
  const [key, setKey] = useState(new Date());
  const [unChangeVisible, setUnChangeVisible] = useState(false);
  const [dnChangeVisible, setDnChangeVisible] = useState(false);
  const [emChangeVisible, setEmChangeVisible] = useState(false);
  const [psChangeVisible, setPsChangeVisible] = useState(false);

  const frSheet = useRef();
  const accessSheet = useState();

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

  const setSetting = (s_key, s_val, s_type) => {
    console.log(s_key, s_val, s_type);

    authorizedRequest('ss/a/settings/set', {s_key, s_val, s_type})
      .then((response) => {
        updateUserInfo(() => {
          // reload here
          setKey(new Date().getTime());
        });
      })
      .catch((error) => console.error(error));
  };

  const changeName = (which, newValue) => {
    /* parameter "info" possible values:
       0 => username,
       1 => display_name,
       2 => random_username,
       3 => email change,
       4 => password change (adcsr only!!)
     */

    authorizedRequest('ss/a/name/change', {
      f: false,
      value: newValue,
      info: which,
    })
      .then((response) => response.json())
      .then((json) => {
        updateUserInfo(() => {
          // reload here
          setKey(new Date().getTime());
        });
      })
      .catch((error) => console.error(error))
      .finally(() => {});
  };

  const hideInputs = () => {
    setEmChangeVisible(false);
    setPsChangeVisible(false);
    setUnChangeVisible(false);
    setDnChangeVisible(false);
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      {key && (
        <ScrollView style={{flex: 1, padding: 16}}>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              marginTop: 12,
            }}>
            <View
              style={{
                borderRadius: 35,
                overflow: 'hidden',
                alignSelf: 'center',
              }}>
              <Image
                source={
                  global.user.p_img != null
                    ? {uri: global.user.p_img}
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

            <Button
              title="Refresh"
              onPress={() => {
                updateUserInfo(() => {
                  // reload here
                  setKey(new Date().getTime());
                });
              }}></Button>

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

            <TouchableOpacity
              onPress={() => setPsChangeVisible(true)}
              style={styles.actionButton}>
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

            <TouchableOpacity
              onPress={() => setUnChangeVisible(true)}
              style={styles.actionButton}>
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

            <TouchableOpacity
              onPress={() => setDnChangeVisible(true)}
              style={styles.actionButton}>
              <View style={{flexDirection: 'row', marginStart: 12}}>
                <MaterialIcons
                  style={{alignSelf: 'center', marginEnd: 8}}
                  name="edit"
                  color={'rgb(58,79,101)'}
                  size={22}
                />
                <View style={{alignSelf: 'center'}}>
                  <Text>Görünür İsim</Text>
                  <Text style={{fontWeight: 'bold', fontSize: 13}}>
                    @{global.user.disp_name}
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

            <TouchableOpacity
              onPress={() => setEmChangeVisible(true)}
              style={styles.actionButton}>
              <View style={{flexDirection: 'row', marginStart: 12}}>
                <MaterialIcons
                  style={{alignSelf: 'center', marginEnd: 8}}
                  name="edit"
                  color={'rgb(58,79,101)'}
                  size={22}
                />
                <View style={{alignSelf: 'center'}}>
                  <Text>Email Adresim</Text>
                  <Text style={{fontWeight: 'bold', fontSize: 13}}>
                    {global.user.user_mail}
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

            <TouchableOpacity
              onPress={() => frSheet.current.open()}
              style={styles.actionButton}>
              <View style={{flexDirection: 'row', marginStart: 12}}>
                <MaterialIcons
                  style={{alignSelf: 'center', marginEnd: 8}}
                  name="edit"
                  color={'rgb(58,79,101)'}
                  size={22}
                />
                <View style={{alignSelf: 'center'}}>
                  <Text>Arkadaşlık İsteği Gönderilebilsin</Text>
                  <Text style={{fontWeight: 'bold', fontSize: 13}}>
                    {global.user.set.fri_req_cb_sent ? 'Evet' : 'Hayır'}
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

            <TouchableOpacity
              onPress={() => accessSheet.current.open()}
              style={styles.actionButton}>
              <View style={{flexDirection: 'row', marginStart: 12}}>
                <MaterialIcons
                  style={{alignSelf: 'center', marginEnd: 8}}
                  name="edit"
                  color={'rgb(58,79,101)'}
                  size={22}
                />
                <View style={{alignSelf: 'center'}}>
                  <Text>Çalışma Raporlarımı Görebilenler</Text>
                  <Text style={{fontWeight: 'bold', fontSize: 13}}>
                    {global.user.set.st_det_rep_acc === 'OnlyMe'
                      ? 'Sadece Ben'
                      : global.user.set.st_det_rep_acc === 'OnlyFriends'
                      ? 'Sadece Arkadaşlarım'
                      : 'Herkes'}
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
      )}

      <InputDialog
        title="Şifre Değiştir"
        visible={psChangeVisible}
        confirm={(val) => {
          changeName(4, val);
        }}
        dismiss={() => hideInputs()}
      />

      <InputDialog
        title="Email Adres"
        visible={emChangeVisible}
        confirm={(val) => {
          changeName(3, val);
        }}
        dismiss={() => hideInputs()}
      />

      <InputDialog
        title="Hesap İsmi"
        visible={dnChangeVisible}
        confirm={(val) => {
          changeName(1, val);
        }}
        dismiss={() => hideInputs()}
      />

      <InputDialog
        title="Kullanıcı Adı Değiştir"
        visible={unChangeVisible}
        confirm={(val) => {
          changeName(0, val);
        }}
        dismiss={() => hideInputs()}
      />

      <CanSendFRSheet
        refs={frSheet}
        selected={(val) => {
          frSheet.current.close();
          setSetting('FriendRequestsCanBeSent', val, 'bool');
        }}
      />

      <ReportsAccessSheet
        refs={accessSheet}
        selected={(val) => {
          accessSheet.current.close();
          setSetting('StudyDetailedReportAccesibleBy', val, 'string');
        }}
      />
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
    elevation: 0.5,
  },
});
export default SettingsScreen;
