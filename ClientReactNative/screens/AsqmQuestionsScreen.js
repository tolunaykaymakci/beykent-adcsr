import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  FlatList,
  Image,
} from 'react-native';

import AsqmGridItem from '../src/components/AsqmGridItem';

const AsqmQuestionsScreen = ({route, navigation}) => {
  const {lessonId} = route.params;
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    fetch(
      'http://192.168.1.104:5000/ss/asqm/posts?&type=0&count=50&lid=' +
        lessonId,
    )
      .then((response) => response.json())
      .then((json) => setData(json.items))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, []);

  const loadMore = () => {
    if (!hasScrolled) return;

    fetch(
      'http://192.168.1.104:5000/ss/asqm/posts?&type=0&count=50&lid=' +
        lessonId +
        '&lastid=' +
        data[data.length - 1].id,
    )
      .then((response) => response.json())
      .then((json) => setData([...data, ...json.items]))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{paddingStart: 6, paddingEnd: 9}}>
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
          <FlatList
            data={data}
            renderItem={({item}) => (
              <AsqmGridItem post={item} navigation={navigation} />
            )}
            //Setting the number of column
            numColumns={2}
            onScroll={() => setHasScrolled(true)}
            onEndReached={loadMore}
            onEndReachedThreshold="100"
            keyExtractor={(item, index) => index}
          />
        )}
      </View>
    </SafeAreaView>
  );
};
export default AsqmQuestionsScreen;
