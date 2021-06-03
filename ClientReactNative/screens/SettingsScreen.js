import React, {useState, useEffect, useRef} from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
  Alert,
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
import {GlobalColors} from '../src/GlobalStyles';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {useIsFocused} from '@react-navigation/native';
import DataTransmission from '../src/transmission/DataTransmission';

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
  const isFocused = useIsFocused();

  const frSheet = useRef();
  const accessSheet = useRef();

  useEffect(() => {
    updateUserInfo(() => {
      // reload here
      setKey(new Date().getTime());
    });
  }, [isFocused]);

  const logout = async () => {
    Alert.alert(
      'Çıkış Yap?',
      'Hesabınızdan çıkış yapmak istediğine emin misin?',
      [
        {
          text: 'Vazgeç',
          style: 'cancel',
        },
        {
          text: 'Evet',
          onPress: async () => {
            try {
              global.cred = null;
              global.pwd = null;
              global.user = null;
              await AsyncStorage.removeItem('login_user');
              await AsyncStorage.removeItem('login_pwd');
              DevSettings.reload();
            } catch (error) {}
          },
        },
      ],
    );
  };

  const setSetting = (s_key, s_val, s_type) => {
    authorizedRequest('ss/a/settings/set', {s_key, s_val, s_type})
      .then((response) => {
        updateUserInfo(() => {
          // reload here
          setKey(new Date().getTime());
        });
      })
      .catch((error) => console.error(error));
  };

  const changeUsername = (newValue) => {
    authorizedRequest('ss/a/name/change', {
      f: false,
      value: newValue,
      info: 0,
    })
      .then((response) => response.json())
      .then(async (json) => {
        // Update creds info
        await AsyncStorage.setItem('login_user', newValue);
        global.cred = newValue;

        updateUserInfo(() => {
          // reload here
          setKey(new Date().getTime());
        });
      })
      .catch((error) => console.error(error))
      .finally(() => {});
  };

  const changeUserInfo = (which, newValue) => {
    /* parameter "info" possible values:
       0 => display_name,
       1 => email change (adcsr only!!),
       2 => password change (adcsr only!!)
     */

    var params;

    if (which === 0) params = {dn_changed: true, dn: newValue};
    if (which === 1) params = {em_changed: true, em: newValue};
    if (which === 2) params = {pwd_changed: true, pwd: newValue};

    authorizedRequest('api/account/info/edit', params)
      .then(async (response) => {
        if (response.status === 400) {
          response.text().then(function (text) {
            alert(text);
          });
          return;
        }

        if (which === 2) {
          await AsyncStorage.setItem('login_pwd', newValue);
          global.pwd = newValue;
        }

        hideInputs();
        updateUserInfo(() => {
          // reload here
          setKey(new Date().getTime());
        });
      })
      .catch((error) => alert(error));
  };

  const setUserPicture = () => {
    launchImageLibrary(
      {mediaType: 'photo', quality: 0.4, includeBase64: true},
      (response) => {
        if (response.didCancel) return;

        var transmitter = new DataTransmission();
        transmitter.setEntryPoint('ss/a/picture/change');

        transmitter.dataBytes = [];
        transmitter.request.ds = [];

        var Buffer = require('buffer/').Buffer;

        let bytes = Buffer.from(response.base64, 'base64');
        var sbytes = [];

        // Convert byte[] to sbyte[] because server prefers that
        for (var b = 0; b != bytes.length; b++) {
          var sbyte = (bytes[b] & 127) - (bytes[b] & 128);
          sbytes.push(sbyte);
        }

        transmitter.dataBytes.push(sbytes);
        transmitter.request.ds.push(response.fileSize);

        transmitter.registerEvents(
          null,
          (completed) => {
            updateUserInfo(() => {
              // reload here
              setKey(new Date().getTime());
            });
          },
          (failed) => {},
        );

        transmitter.beginTransmission();
      },
    );
  };

  const removeUserPicture = () => {
    authorizedRequest('ss/a/picture/remove', {})
      .then(async (response) => {
        updateUserInfo(() => {
          // reload here
          setKey(new Date().getTime());
        });
      })
      .catch((error) => alert(error));
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
              marginTop: 12,
            }}>
            <View
              style={{backgroundColor: 'white', elevation: 2, borderRadius: 6}}>
              <Text style={{marginTop: 12, marginStart: 12}}>Profil Resmi</Text>

              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <View
                  style={{
                    borderRadius: 24,
                    overflow: 'hidden',
                    alignSelf: 'center',
                    margin: 12,
                  }}>
                  <Image
                    source={
                      global.user.p_url != null
                        ? {uri: global.user.p_url}
                        : require('../assets/profile_default.png')
                    }
                    style={{
                      width: 48,
                      height: 48,
                    }}
                    resizeMode="cover"
                  />
                </View>

                <View
                  style={{marginEnd: 12, alignSelf: 'center', marginTop: -27}}>
                  {global.user.p_url ? (
                    <>
                      <TouchableOpacity
                        onPress={setUserPicture}
                        style={{
                          backgroundColor: GlobalColors.accentColor,
                          borderRadius: 6,
                          padding: 8,
                          alignItems: 'center',
                        }}>
                        <Text style={{color: 'white'}}>Resmi Değiştir</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={removeUserPicture}
                        style={{
                          marginTop: 4,
                          backgroundColor: GlobalColors.accentColor,
                          borderRadius: 6,
                          padding: 8,
                          alignItems: 'center',
                        }}>
                        <Text style={{color: 'white'}}>Resmi Kaldır</Text>
                      </TouchableOpacity>
                    </>
                  ) : (
                    <TouchableOpacity
                      onPress={setUserPicture}
                      style={{
                        backgroundColor: GlobalColors.accentColor,
                        borderRadius: 6,
                        padding: 8,
                        alignItems: 'center',
                      }}>
                      <Text style={{color: 'white'}}>Resim Yükle</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>

            <View
              style={{
                backgroundColor: 'white',
                elevation: 2,
                borderRadius: 6,
                marginTop: 12,
              }}>
              <Text style={{marginTop: 12, marginStart: 12, marginBottom: 12}}>
                Hesap Ayarlarım
              </Text>

              <TouchableOpacity
                onPress={() => setUnChangeVisible(true)}
                style={styles.actionButton}>
                <View style={{flexDirection: 'row'}}>
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
                  style={{alignSelf: 'center', marginEnd: 24}}
                  name="chevron-right"
                  color={'rgb(58,79,101)'}
                  size={23}
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setDnChangeVisible(true)}
                style={styles.actionButton}>
                <View style={{flexDirection: 'row'}}>
                  <MaterialIcons
                    style={{alignSelf: 'center', marginEnd: 8}}
                    name="edit"
                    color={'rgb(58,79,101)'}
                    size={22}
                  />
                  <View style={{alignSelf: 'center'}}>
                    <Text>Hesap İsmim</Text>
                    <Text style={{fontWeight: 'bold', fontSize: 13}}>
                      {global.user.disp_name}
                    </Text>
                  </View>
                </View>
                <MaterialIcons
                  style={{alignSelf: 'center', marginEnd: 24}}
                  name="chevron-right"
                  color={'rgb(58,79,101)'}
                  size={23}
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setEmChangeVisible(true)}
                style={styles.actionButton}>
                <View style={{flexDirection: 'row'}}>
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
                  style={{alignSelf: 'center', marginEnd: 24}}
                  name="chevron-right"
                  color={'rgb(58,79,101)'}
                  size={23}
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setPsChangeVisible(true)}
                style={styles.actionButton}>
                <View style={{flexDirection: 'row'}}>
                  <MaterialIcons
                    style={{alignSelf: 'center', marginEnd: 8}}
                    name="edit"
                    color={'rgb(58,79,101)'}
                    size={22}
                  />
                  <View style={{alignSelf: 'center'}}>
                    <Text>Şifremi Değiştir</Text>
                    <Text style={{fontWeight: 'bold', fontSize: 13}}>
                      Değiştirmek İçin Dokun
                    </Text>
                  </View>
                </View>
                <MaterialIcons
                  style={{alignSelf: 'center', marginEnd: 24}}
                  name="chevron-right"
                  color={'rgb(58,79,101)'}
                  size={23}
                />
              </TouchableOpacity>
            </View>

            <View
              style={{
                backgroundColor: 'white',
                elevation: 2,
                borderRadius: 6,
                marginTop: 12,
              }}>
              <Text style={{marginTop: 12, marginStart: 12, marginBottom: 12}}>
                Gizlilik Ayarlarım
              </Text>

              <TouchableOpacity
                onPress={() => frSheet.current.open()}
                style={styles.actionButton}>
                <View style={{flexDirection: 'row'}}>
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
                  style={{alignSelf: 'center', marginEnd: 24}}
                  name="chevron-right"
                  color={'rgb(58,79,101)'}
                  size={23}
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => accessSheet.current.open()}
                style={styles.actionButton}>
                <View style={{flexDirection: 'row'}}>
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
                  style={{alignSelf: 'center', marginEnd: 24}}
                  name="chevron-right"
                  color={'rgb(58,79,101)'}
                  size={23}
                />
              </TouchableOpacity>
            </View>

            {/* <Button
              title="Refresh"
              onPress={() => {
                updateUserInfo(() => {
                  // reload here
                  setKey(new Date().getTime());
                });
              }}></Button> */}

            <View
              style={{
                backgroundColor: 'white',
                elevation: 2,
                borderRadius: 6,
                marginTop: 12,
              }}>
              <TouchableOpacity
                onPress={() => logout()}
                style={styles.actionButton}>
                <View style={{flexDirection: 'row'}}>
                  <MaterialIcons
                    style={{alignSelf: 'center', marginEnd: 8}}
                    name="edit"
                    color={'rgb(58,79,101)'}
                    size={22}
                  />
                  <Text style={{alignSelf: 'center'}}>
                    Hesabımdan Çıkış Yap
                  </Text>
                </View>
                <MaterialIcons
                  style={{alignSelf: 'center', marginEnd: 24}}
                  name="chevron-right"
                  color={'rgb(58,79,101)'}
                  size={23}
                />
              </TouchableOpacity>
            </View>

            <Text style={{marginTop: 18}}>id = {global.user.a_id}</Text>
          </View>
        </ScrollView>
      )}

      <InputDialog
        title="Şifre Değiştir"
        inputType="password"
        current=""
        visible={psChangeVisible}
        confirm={(val) => {
          changeUserInfo(2, val);
        }}
        dismiss={() => hideInputs()}
      />

      <InputDialog
        title="Email Adres"
        inputType="email-address"
        current={global.user.user_mail}
        visible={emChangeVisible}
        confirm={(val) => {
          changeUserInfo(1, val);
        }}
        dismiss={() => hideInputs()}
      />

      <InputDialog
        title="Hesap İsmi"
        inputType="default"
        current={global.user.disp_name}
        visible={dnChangeVisible}
        confirm={(val) => {
          changeUserInfo(0, val);
        }}
        dismiss={() => hideInputs()}
      />

      <InputDialog
        title="Kullanıcı Adı Değiştir"
        visible={unChangeVisible}
        current={global.user.username}
        confirm={(val) => {
          changeUsername(val);
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
          setSetting('StudySummaryReportAccesibleBy', val, 'string');
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
    justifyContent: 'space-between',
    backgroundColor: 'white',
    height: 54,
  },
});
export default SettingsScreen;
