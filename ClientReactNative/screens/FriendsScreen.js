import React, {useEffect, useState, useRef} from 'react';
import {
  Text,
  SafeAreaView,
  Button,
  Image,
  ScrollView,
  View,
  TouchableOpacity,
} from 'react-native';
import {authorizedRequest} from '../Service';
import {GlobalColors} from '../src/GlobalStyles';
import {useIsFocused} from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

function App({route, navigation}) {
  const [screenMode, setScreenMode] = useState('friends'); //friends, requests
  const [friends, setFriends] = useState();
  const [requests, setRequests] = useState();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (screenMode === 'friends') getFriends();
    else getFriendRequests();
  }, [isFocused]);

  const getFriends = () => {
    setScreenMode('friends');
    authorizedRequest('ss/a/friends', {})
      .then((response) => response.json())
      .then((json) => {
        setFriends(json.friends);
      })
      .catch((error) => console.error(error))
      .finally(() => {});
  };

  const getFriendRequests = () => {
    setScreenMode('requests');
    authorizedRequest('ss/a/friends/requests', {})
      .then((response) => response.json())
      .then((json) => {
        setRequests(json.frs);
      })
      .catch((error) => console.error(error))
      .finally(() => {});
  };

  const acceptFriendRequest = (user_id) => {
    authorizedRequest('ss/a/friends/requests/accept', {user_id})
      .then((response) => response.json())
      .then((json) => {
        getFriendRequests();
      })
      .catch((error) => console.error(error))
      .finally(() => {});
  };

  const dismissFriendRequest = (user_id) => {
    authorizedRequest('ss/a/friends/requests/dismiss', {user_id})
      .then((response) => response.json())
      .then((json) => {
        getFriendRequests();
      })
      .catch((error) => console.error(error))
      .finally(() => {});
  };

  return (
    <SafeAreaView
      style={{flex: 1, backgroundColor: GlobalColors.windowBackground}}>
      <View style={{flexDirection: 'row', marginBottom: 4}}>
        <TouchableOpacity
          onPress={() => getFriends()}
          style={{
            flex: 1,
            paddingTop: 12,
            paddingBottom: 12,
            alignItems: 'center',
          }}>
          <Text
            style={{
              color: 'black',
              fontSize: 16,
              fontWeight: screenMode === 'friends' ? 'bold' : 'normal',
            }}>
            Arkadaşlarım
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => getFriendRequests()}
          style={{
            flex: 1,
            paddingTop: 12,
            paddingBottom: 12,
            alignItems: 'center',
          }}>
          <Text
            style={{
              color: 'black',
              fontSize: 16,
              fontWeight: screenMode === 'requests' ? 'bold' : 'normal',
            }}>
            İstekler
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView>
        {screenMode === 'friends' ? (
          <View>
            {friends && (
              <>
                {friends.length > 0 ? (
                  <>
                    {friends.map((f) => (
                      <TouchableOpacity
                        onPress={() => {
                          navigation.navigate('Profile', {
                            username: f.username,
                          });
                        }}
                        style={{
                          backgroundColor: GlobalColors.primaryCard,
                          elevation: 4,
                          justifyContent: 'space-between',
                          borderRadius: 12,
                          marginStart: 12,
                          marginEnd: 12,
                          height: 64,
                          flexDirection: 'row',
                        }}>
                        <View style={{flexDirection: 'row'}}>
                          <View
                            style={{
                              borderRadius: 18,
                              overflow: 'hidden',
                              alignSelf: 'center',
                              marginStart: 12,
                            }}>
                            <Image
                              source={
                                f.pic
                                  ? {uri: f.pic}
                                  : require('../assets/profile_default.png')
                              }
                              style={{
                                width: 36,
                                height: 36,
                              }}
                              resizeMode="contain"
                            />
                          </View>

                          <View style={{alignSelf: 'center', marginStart: 8}}>
                            <Text style={{fontWeight: 'bold'}}>
                              @{f.username}
                            </Text>

                            {f.sumrep_access && (
                              <View
                                style={{flexDirection: 'row', marginTop: 4}}>
                                <Text>Bugün: </Text>
                                <Text style={{marginEnd: 8}}>{f.sr_today}</Text>

                                <Text>Son 7 gün: </Text>
                                <Text style={{marginEnd: 8}}>
                                  {f.sr_seven_days}
                                </Text>
                              </View>
                            )}
                          </View>
                        </View>

                        <MaterialIcons
                          style={{alignSelf: 'center', marginEnd: 12}}
                          name="person-add"
                          color={'rgb(0,0,0)'}
                          size={28}
                        />
                      </TouchableOpacity>
                    ))}
                  </>
                ) : (
                  <>
                    <View
                      style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: 76,
                      }}>
                      <Image
                        source={require('../assets/study.png')}
                        style={{width: 70, height: 70, margin: 12}}
                        resizeMode="contain"
                      />
                      <Text style={{fontWeight: 'bold', fontSize: 16}}>
                        Henüz arkadaşınız yok
                      </Text>
                      <Text
                        style={{
                          fontSize: 14,
                          marginTop: 2,
                          maxWidth: '80%',
                          textAlign: 'center',
                        }}>
                        Arkadaşlarını ekleyin ve birlikte çalışmaya başlayın
                      </Text>
                    </View>
                  </>
                )}
              </>
            )}
          </View>
        ) : (
          <View>
            {requests && (
              <>
                {requests.length > 0 ? (
                  <>
                    {requests.map((f) => (
                      <View
                        style={{
                          backgroundColor: GlobalColors.primaryCard,
                          elevation: 4,
                          borderRadius: 12,
                          height: 64,
                          flexDirection: 'row',
                        }}>
                        <View
                          style={{
                            borderRadius: 35,
                            overflow: 'hidden',
                            alignSelf: 'center',
                            marginStart: 12,
                          }}>
                          <Image
                            source={
                              f.pic
                                ? {uri: f.pic}
                                : require('../assets/profile_default.png')
                            }
                            style={{
                              width: 70,
                              height: 70,
                            }}
                            resizeMode="contain"
                          />
                        </View>

                        <View style={{alignSelf: 'center'}}>
                          <Text>@{f.username}</Text>
                          <Text>{f.r_fdate}</Text>
                        </View>

                        <Button
                          title="Kabul Et"
                          onPress={() =>
                            acceptFriendRequest(f.user_id)
                          }></Button>

                        <Button
                          title="Reddet"
                          onPress={() =>
                            dismissFriendRequest(f.user_id)
                          }></Button>
                      </View>
                    ))}
                  </>
                ) : (
                  <>
                    <View
                      style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: 76,
                      }}>
                      <Image
                        source={require('../assets/study.png')}
                        style={{width: 70, height: 70, margin: 12}}
                        resizeMode="contain"
                      />
                      <Text style={{fontWeight: 'bold', fontSize: 16}}>
                        Arkadaşlık İsteği Yok
                      </Text>
                      <Text
                        style={{
                          fontSize: 14,
                          marginTop: 2,
                          maxWidth: '80%',
                          textAlign: 'center',
                        }}>
                        Henüz size bir arkadaşlık isteği gelmemiş
                      </Text>
                    </View>
                  </>
                )}
              </>
            )}
          </View>
        )}
      </ScrollView>

      <View
        style={{
          bottom: 0,
          right: 0,
          position: 'absolute',
        }}>
        <TouchableOpacity
          onPress={() => navigation.navigate('AsqmAdd', {})}
          style={{
            backgroundColor: 'rgba(52, 106, 172, 1)',
            width: 64,
            borderRadius: 32,
            height: 64,
            shadowOpacity: 0.43,
            shadowRadius: 2.62,
            elevation: 1,
            alignItems: 'center',
            margin: 16,
          }}>
          <MaterialIcons
            style={{alignSelf: 'center', marginTop: 15}}
            name="person-add"
            color={'rgb(255,255,255)'}
            size={32}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
export default App;
