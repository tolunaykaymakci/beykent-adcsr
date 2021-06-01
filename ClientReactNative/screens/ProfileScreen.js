import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Button,
  Image,
  Alert,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {authorizedRequest, dump} from '../Service';
import {GlobalColors} from '../src/GlobalStyles';

const ProfileScreen = ({route, navigation}) => {
  const {username} = route.params;
  const [userInfo, setUserInfo] = useState();
  const [userReport, setUserReport] = useState();

  const userInfoRef = useRef();

  useEffect(() => {
    requestUserInfo();
  }, []);

  const requestUserInfo = () => {
    authorizedRequest('api/account/info', {
      info_self: false,
      info_user: username,
      grsip: true,
    })
      .then((response) => response.json())
      .then((json) => {
        navigation.setOptions({
          headerTitle: '@' + json.username,
        });

        userInfoRef.current = json;
        setUserInfo(json);
        if (json.reports_accesible) {
          requestUserReports(json.username);
        }
      })
      .catch((error) => console.error(error))
      .finally(() => {});
  };

  const requestUserReports = (targetUsername) => {
    authorizedRequest('ss/sdb/reports/user/dash', {
      target: targetUsername,
      current: global.user.username,
    })
      .then((response) => response.json())
      .then((json) => {
        setUserReport(json); // basic user report info
      })
      .catch((error) => console.error(error))
      .finally(() => {});
  };

  const friendButtonAction = (fri) => {
    if (fri === 'friends') {
      Alert.alert(
        'Arkadaşlıktan Çıkart?',
        'Bu kullanıcı arkadaşlarınızdan çıkarılsın mı?',
        [
          {
            text: 'Vazgeç',
            style: 'cancel',
          },
          {
            text: 'Evet',
            onPress: () => {
              authorizedRequest('ss/a/friends/remove', {
                fr_id: userInfo.fri_id,
              })
                .then((response) => requestUserInfo())
                .catch((error) => console.error(error))
                .finally(() => {});
            },
          },
        ],
      );
    } else if (fri === 'notfriends') {
      // Send friend request

      authorizedRequest('ss/a/friends/request', {
        requested: userInfo.a_id,
      })
        .then((response) => requestUserInfo())
        .catch((error) => console.error(error))
        .finally(() => {});
    } else if (fri === 'notfriends_current_requested') {
      // Cancel friend request

      authorizedRequest('ss/a/friends/requests/cancel', {
        acc_id: userInfo.a_id,
      })
        .then((response) => requestUserInfo())
        .catch((error) => console.error(error))
        .finally(() => {});
    }
  };

  const acceptFriendRequest = (user_id) => {
    authorizedRequest('ss/a/friends/requests/accept', {user_id})
      .then((response) => response.json())
      .then((json) => {
        requestUserInfo();
      })
      .catch((error) => console.error(error))
      .finally(() => {});
  };

  const dismissFriendRequest = (user_id) => {
    authorizedRequest('ss/a/friends/requests/dismiss', {user_id})
      .then((response) => response.json())
      .then((json) => {
        requestUserInfo();
      })
      .catch((error) => console.error(error))
      .finally(() => {});
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView style={{flex: 1, padding: 16}}>
        {userInfo && (
          <View>
            <View
              style={{
                marginStart: 12,
                marginEnd: 12,
                marginTop: 12,
                elevation: 4,
                borderRadius: 12,
                backgroundColor: GlobalColors.primaryCard,
              }}>
              <View
                style={{
                  marginTop: 12,
                  borderRadius: 45,
                  overflow: 'hidden',
                  alignSelf: 'center',
                }}>
                <Image
                  source={
                    userInfo.p_url != null
                      ? {uri: userInfo.p_url}
                      : require('../assets/profile_default.png')
                  }
                  style={{
                    width: 90,
                    height: 90,
                  }}
                  resizeMode="cover"
                />
              </View>

              <Text
                style={{
                  fontSize: 20,
                  textAlign: 'center',
                  marginTop: 8,
                }}>
                {userInfo.disp_name}
              </Text>

              <Text
                style={{
                  fontSize: 18,
                  fontWeight: 'bold',
                  textAlign: 'center',
                  marginTop: 3,
                }}>
                @{userInfo.username}
              </Text>

              <Text
                style={{
                  fontSize: 16,
                  textAlign: 'center',
                  marginTop: 4,
                  marginBottom: 16,
                }}>
                {userInfo.user_mail}
              </Text>
            </View>

            {/* Friendship Status information and controls */}

            {['friends', 'notfriends', 'notfriends_current_requested'].indexOf(
              userInfo.fri,
            ) > -1 && (
              <TouchableOpacity
                onPress={() => friendButtonAction(userInfo.fri)}
                style={{
                  alignSelf: 'flex-end',
                  margin: 12,
                  marginTop: 18,
                  backgroundColor: GlobalColors.accentColor,
                  paddingTop: 6,
                  paddingBottom: 6,
                  paddingStart: 12,
                  borderRadius: 20,
                  paddingEnd: 12,
                }}>
                <Text style={{color: 'white', fontSize: 16}}>
                  {userInfo.fri === 'friends'
                    ? 'Arkadaşlarımdan Çıkart'
                    : userInfo.fri === 'notfriends'
                    ? 'Arkadaş Olarak Ekle'
                    : userInfo.fri === 'notfriends_current_requested'
                    ? 'İstek Gönderildi'
                    : ''}
                </Text>
              </TouchableOpacity>
            )}

            {/* Friend request handling.. */}
            {userInfo.fri === 'notfriends_target_requested' && (
              <View
                style={{
                  justifyContent: 'space-between',
                  marginStart: 12,
                  flexDirection: 'row',
                  borderRadius: 12,
                  marginEnd: 12,
                  backgroundColor: GlobalColors.accentColor,
                }}>
                <Text
                  style={{
                    color: 'white',
                    marginStart: 12,
                    alignSelf: 'center',
                  }}>
                  Size arkadaşlık isteği gönderdi
                </Text>

                <View style={{margin: 6}}>
                  <TouchableOpacity
                    style={{
                      padding: 14,
                      paddingTop: 8,
                      paddingBottom: 8,
                      borderRadius: 9,
                      backgroundColor: 'white',
                      justifyContent: 'center',
                      alignItems: 'center',
                      margin: 3,
                      marginBottom: 6,
                    }}
                    onPress={() => acceptFriendRequest(userInfo.a_id)}>
                    <Text>Kabul Et</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{
                      padding: 14,
                      paddingTop: 8,
                      paddingBottom: 8,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: 9,
                      margin: 3,
                      backgroundColor: 'white',
                    }}
                    onPress={() => dismissFriendRequest(userInfo.a_id)}>
                    <Text>Reddet</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Reports Stuff If Permitted */}
            {/* There may be graph hereeeeee */}

            {userReport && userReport.plans && (
              <View style={{margin: 12}}>
                <Text
                  style={{
                    margin: 6,
                    marginTop: 6,
                    fontWeight: 'bold',
                    fontSize: 18,
                    marginBottom: 14,
                  }}>
                  Çalışma Özeti
                </Text>

                <View
                  style={{
                    flexDirection: 'row',
                    overflow: 'hidden',
                    borderTopLeftRadius: 12,
                    borderTopRightRadius: 12,
                  }}>
                  <View
                    style={{
                      flex: 1,
                      height: 64,
                      justifyContent: 'center',
                      backgroundColor: 'rgba(255,0,0,.2)',
                      alignItems: 'center',
                    }}>
                    <Text>Bugün: {userReport.tv}</Text>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      height: 64,
                      justifyContent: 'center',
                      backgroundColor: 'rgba(0,255,0,.2)',
                      alignItems: 'center',
                    }}>
                    <Text>Bu hafta: {userReport.tw}</Text>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    overflow: 'hidden',
                    borderBottomLeftRadius: 12,
                    borderBottomRightRadius: 12,
                  }}>
                  <View
                    style={{
                      flex: 1,
                      height: 64,
                      justifyContent: 'center',
                      backgroundColor: 'rgba(0,0,255,.2)',
                      alignItems: 'center',
                    }}>
                    <Text>Bu ay: {userReport.tm}</Text>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      height: 64,
                      justifyContent: 'center',
                      backgroundColor: 'rgba(255,0,255,.2)',
                      alignItems: 'center',
                    }}>
                    <Text>Toplam: {userReport.ttl}</Text>
                  </View>
                </View>

                {userReport.plans.map((plan) => (
                  <View
                    style={{
                      backgroundColor: GlobalColors.primaryCard,
                      elevation: 4,
                      padding: 12,
                      borderRadius: 12,
                      marginTop: 12,
                      marginBottom: 12,
                    }}>
                    <Text
                      style={{
                        fontWeight: 'bold',
                        fontSize: 15,
                        marginBottom: 6,
                      }}>
                      {plan.name}
                    </Text>
                    <Button
                      title="Soru Çözümleri ->"
                      onPress={() =>
                        navigation.navigate('Reports', {
                          planId: plan.plan_id,
                          mode: 'daily',
                          type: 'questions',
                          userref: userInfoRef.current,
                        })
                      }
                    />
                    <Button
                      title="Konu Tekrarları ->"
                      onPress={() =>
                        navigation.navigate('Reports', {
                          planId: plan.plan_id,
                          mode: 'daily',
                          type: 'studies',
                          userref: userInfoRef.current,
                        })
                      }
                    />
                  </View>
                ))}
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};
export default ProfileScreen;
