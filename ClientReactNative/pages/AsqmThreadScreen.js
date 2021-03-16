import React, {useState, useEffect, useLayoutEffect} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  FlatList,
  Image,
} from 'react-native';

import GlobalStyles from '../src/GlobalStyles';

const AsqmContainer = ({post, type}) => {
  return (
    <View
      style={[
        GlobalStyles.sscard,
        {marginStart: 0, marginEnd: 0, borderRadius: 0},
      ]}>
      <View style={styles.userbar}>
        <Image
          style={{
            height: 32,
            width: 32,
            borderRadius: 32 / 2,
            alignSelf: 'center',
            marginStart: 8,
          }}
          source={{uri: post.poster_pic}}
        />

        <View style={{flexDirection: 'column', marginStart: 8}}>
          <Text>Soran</Text>
          <Text style={{fontWeight: 'bold'}}>@{post.poster}</Text>
        </View>
      </View>

      <View style={{margin: 8}}>
        <Text style={{color: 'rgba(0, 0, 0, .6)'}}>{post.p_date}</Text>
        <Text>{post.body}</Text>

        {/* Pictures Container */}
        {post.images != null && post.images.length > 0 ? (
          <View
            style={{
              width: '100%',
              marginTop: 8,
              flexDirection: 'row',
              marginBottom: 8,
            }}>
            {post.images.map((imagePair) => {
              return (
                <>
                  <Image
                    style={{
                      flex: 1,
                      height: 150,
                      marginStart: 4,
                      marginEnd: 4,
                      borderRadius: 8,
                    }}
                    source={{uri: imagePair.thumbSrc}}
                  />
                </>
              );
            })}
          </View>
        ) : null}
      </View>

      {/* Replies */}
      <View style={{backgroundColor: 'rgb(236, 236, 236)'}}>
        {post.replies.map((reply) => {
          return (
            <View
              style={{
                marginStart: '40%',
                marginTop: 6,
                marginBottom: 6,
                marginEnd: 12,
              }}>
              <Text style={{fontWeight: 'bold'}}>@{reply.poster}</Text>
              <Text>{reply.body}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const AsqmThreadScreen = ({route, navigation}) => {
  const {threadId} = route.params;
  const [isLoading, setLoading] = useState(true);
  const [thread, setThread] = useState([]);

  useEffect(() => {
    fetch('http://192.168.1.104:5000/ss/asqm/thread?pid=' + threadId)
      .then((response) => response.json())
      .then((json) => {
        setThread(json.thread);
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
  }, []);

  return (
    <SafeAreaView style={{flex: 1}}>
      <View>
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
          <ScrollView>
            {/* Poster Card */}

            <Text>SORU</Text>
            <AsqmContainer post={thread} type="question" />

            <Text>ÇÖZÜMLER</Text>

            {/* Answer Cards (if any) */}
            {thread.answers != null && thread.answers.length > 0 ? (
              thread.answers.map((post) => (
                <AsqmContainer post={post} type="answer" />
              ))
            ) : (
              <></>
            )}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  userbar: {
    paddingTop: 8,
    paddingBottom: 4,
    width: '100%',
    flexDirection: 'row',
  },
});

export default AsqmThreadScreen;
