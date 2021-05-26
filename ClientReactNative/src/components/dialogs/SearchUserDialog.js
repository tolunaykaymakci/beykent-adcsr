import React, {useState, useEffect, useRef} from 'react';

import {
  View,
  Modal,
  Pressable,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
} from 'react-native';

import {getRequest} from '../../../Service';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {GlobalStyles} from '../../GlobalStyles';

const SearchUserDialog = (navigation, dismiss) => {
  const [currentValue, setCurrentValue] = useState('');
  const [result, setResult] = useState();

  const searchOnService = () => {
    getRequest('ss/sdb/search', {pattern: currentValue, adcsr: true})
      .then((response) => response.json())
      .then((json) => {
        setResult(json.users);
      })
      .catch((error) => console.error(error));
  };

  return (
    <View>
      <Modal
        animationType="none"
        transparent={true}
        visible={visible}
        onRequestClose={() => {
          dismiss();
        }}>
        <View
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,.4)',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              ...GlobalStyles.primaryCard,
              padding: 16,
              width: '80%',
              paddingBottom: 10,
            }}>
            <Text style={{fontWeight: 'bold', fontSize: 19, marginBottom: 12}}>
              {title == null ? 'Kullanıcı Ara' : title}
            </Text>

            <TextInput
              keyboardType="text"
              autoFocus={true}
              onChangeText={(text) => {
                setCurrentValue(text);
                searchOnService();
              }}
              style={{
                fontSize: 22,
                textAlign: 'center',
                backgroundColor: 'rgb(238,238,238)',
                borderBottomColor: 'rgb(226,226,226)',
                borderBottomWidth: 3,
              }}>
              {currentValue}
            </TextInput>

            {!result ? (
              <Text style={{textAlign: 'center'}}>En az üç karakter girin</Text>
            ) : (
              <View>
                {result.length > 0 ? (
                  <ScrollView>
                    {result.map(() => (
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
                  </ScrollView>
                ) : (
                  <Text style={{textAlign: 'center'}}>Sonuç Bulunamadı</Text>
                )}
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default SearchUserDialog;
