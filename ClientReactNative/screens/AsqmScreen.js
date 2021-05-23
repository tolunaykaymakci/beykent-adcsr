import React, {useState, useEffect} from 'react';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {
  View,
  Text,
  SafeAreaView,
  SectionList,
  StyleSheet,
  ScrollView,
  RefreshControl,
  FlatList,
  ActivityIndicator,
  Image,
} from 'react-native';

import {
  TouchableOpacity,
  TouchableNativeFeedback,
} from 'react-native-gesture-handler';

import AsqmGridItem from '../src/components/AsqmGridItem';
import {getRequest} from '../Service';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import {useIsFocused} from '@react-navigation/native';

const AsqmScreen = ({navigation}) => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    requestEntrance();
  }, []);

  const requestEntrance = () => {
    getRequest('ss/asqm/entrance')
      .then((response) => response.json())
      .then((json) => {
        setData(json.lessons);
        // var newData = [];
        // for (var i = 0; i != json.lessons.length; i++) {
        //   let lesson = json.lessons[i];

        //   newData.push({
        //     title: {name: lesson.name, p: lesson.pc},
        //     data: [{id: lesson.id, value: json.lessons[i].mostRecentPosts}],
        //   });
        // }
        // console.log(newData);
        // setData(newData);
      })
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  };

  const TestHeader = ({title, count, id, navigation}) => {
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('AsqmQuestions', {lessonId: id == 0 ? -1 : id})
        }
        style={{
          paddingTop: 20,
          paddingBottom: 5,
          paddingStart: 9,
          paddingEnd: 9,
        }}>
        <View>
          <Text style={{fontSize: 17, fontWeight: 'bold'}}>{title}</Text>
          <Text style={{fontSize: 11.5}}>{count} SORU</Text>
          <Text
            style={{
              position: 'absolute',
              right: 0,
              top: 8,
              color: '#395a8f',
              fontSize: 13.25,
              fontWeight: 'bold',
            }}>
            {count == 0 ? 'TÜM SORULAR' : 'HEPSİ'}{' '}
            <MaterialCommunityIcons
              name="chevron-right"
              color={'#395a8f'}
              size={17}
            />
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const onRefresh = React.useCallback(() => {
    setLoading(true);
    requestEntrance();
  }, []);

  return (
    <SafeAreaView>
      <View
        style={{
          backgroundColor: 'rgb(250, 250, 250)',
        }}>
        {isLoading ? (
          <View
            style={{
              flex: 1,
              marginTop: 12,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text>Yükleniyor... bir sn lütfen</Text>
          </View>
        ) : (
          <ScrollView
            refreshControl={
              <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
            }>
            <View
              style={{
                height: 130,
                backgroundColor: '#6d91bd',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  color: 'white',
                  fontSize: 20,
                  marginStart: 18,
                  marginEnd: 18,
                  textAlign: 'center',
                }}>
                Diğer kullanıcılar ile çözemediğin soruları paylaşabilir yada
                onların sorduğu sorulara gözatabilirsin!
              </Text>
            </View>
            {data.map(
              (item) =>
                item.pc !== 0 && (
                  <View style={{paddingStart: 6, paddingEnd: 6}}>
                    <TestHeader
                      title={item.name}
                      id={item.id}
                      navigation={navigation}
                      count={item.pc}
                    />

                    <FlatList
                      data={item.mostRecentPosts}
                      horizontal
                      keyExtractor={({id}, index) => id}
                      renderItem={({item}) => (
                        <AsqmGridItem post={item} navigation={navigation} />
                      )}
                    />
                  </View>
                ),
            )}
          </ScrollView>
        )}
      </View>

      {!isLoading && (
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
              name="add"
              color={'rgb(255,255,255)'}
              size={32}
            />
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  sectionHeaderStyle: {
    backgroundColor: '#CDDC89',
    fontSize: 20,
    padding: 5,
    color: '#fff',
  },
  sectionListItemStyle: {
    fontSize: 15,
    padding: 15,
    color: '#000',
  },
  listItemSeparatorStyle: {
    height: 0.5,
    width: '100%',
    backgroundColor: '#C8C8C8',
  },
});

export default AsqmScreen;
