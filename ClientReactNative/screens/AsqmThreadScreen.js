import React, {useState, useEffect, useLayoutEffect} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Button,
  Image,
} from 'react-native';

import GlobalStyles from '../src/GlobalStyles';
import ReactNativeZoomableView from '@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView';
import {getRequest} from '../Service';

const AsqmContainer = ({post, type}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalImage, setModalImage] = useState(null);

  return (
    <View
      style={[
        GlobalStyles.sscard,
        {marginStart: 0, marginEnd: 0, borderRadius: 0},
      ]}>
      {/* Modal */}

      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}>
        <View
          onPress={() => alert('helloooo')}
          style={{
            width: '100%',
            backgroundColor: 'rgba(0,0,0,1)',
            height: '100%',
          }}>
          <ReactNativeZoomableView
            maxZoom={1.5}
            minZoom={0.5}
            zoomStep={0.5}
            initialZoom={1}
            bindToBorders={true}
            captureEvent={true}>
            <Image
              style={{
                flex: 1,
                height: 150,
                marginStart: 4,
                marginEnd: 4,
                resizeMode: 'contain',
                borderRadius: 8,
              }}
              source={{uri: modalImage}}
            />
          </ReactNativeZoomableView>
        </View>
      </Modal>

      {/* --- */}

      <View style={styles.userbar}>
        <Image
          style={{
            height: 34,
            width: 34,
            borderRadius: 34 / 2,
            alignSelf: 'center',
            marginStart: 12,
          }}
          source={{uri: post.poster_pic}}
        />

        <View style={{flexDirection: 'column', marginStart: 14}}>
          <Text>Soran</Text>
          <Text style={{fontWeight: 'bold'}}>@{post.poster}</Text>
        </View>
      </View>

      <View style={{margin: 8}}>
        <Text style={{color: 'rgba(0, 0, 0, .6)', marginStart: 6}}>
          {post.p_date}
        </Text>
        <Text style={{marginStart: 6}}>{post.body}</Text>

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
                <TouchableOpacity
                  onPress={() => {
                    setModalImage(imagePair.src);
                    setModalVisible(true);
                  }}
                  style={{
                    flex: 1,
                    height: 150,
                  }}>
                  <Image
                    style={{
                      flex: 1,
                      height: 150,
                      marginStart: 4,
                      marginEnd: 4,
                      borderRadius: 8,
                    }}
                    source={{uri: imagePair.src}}
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        ) : null}
      </View>

      {/* Replies */}
      {post.replies.length == 0 ? null : (
        <View>
          <Text
            style={{
              fontWeight: 'bold',
              marginStart: 12,
            }}>
            ÜYE YORUMLARI
          </Text>

          <View style={{backgroundColor: 'rgb(236, 236, 236)'}}>
            {post.replies.map((reply) => {
              return (
                <View
                  style={{
                    marginStart: 12,
                    marginTop: 17,
                    marginBottom: 6,
                    marginEnd: 12,
                  }}>
                  <View style={styles.userbar}>
                    <Image
                      style={{
                        height: 34,
                        width: 34,
                        borderRadius: 34 / 2,
                        alignSelf: 'center',
                      }}
                      source={{uri: reply.poster_pic}}
                    />
                  </View>
                  <View
                    style={{
                      flexDirection: 'column',
                      marginStart: 50,
                      marginTop: -40,
                    }}>
                    <Text>Üye</Text>
                    <Text style={{fontWeight: 'bold'}}>@{reply.poster}</Text>
                    <Text style={{marginTop: 5}}>{reply.body}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      )}
    </View>
  );
};

const AsqmThreadScreen = ({route, navigation}) => {
  const {threadId} = route.params;
  const [isLoading, setLoading] = useState(true);
  const [thread, setThread] = useState([]);

  useEffect(() => {
    getRequest('ss/asqm/thread?pid=' + threadId)
      .then((response) => response.json())
      .then((json) => {
        console.log(json.thread.images);
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

            <AsqmContainer post={thread} type="question" />
            {thread.answers.length == 0 ? (
              <Button
                onPress={() => alert('Çözüm Ekleme Ekranı')}
                style={{alignSelf: 'center', marginTop: 18, width:80}}
                title="Çözüm Ekle"
              />
            ) : (
              <Text
                style={{
                  fontWeight: 'bold',
                  marginStart: 12,
                  marginTop: 6,
                  marginBottom: 6,
                  marginEnd: 12,
                }}>
                ÇÖZÜMLER
              </Text>
            )}

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
