import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Modal,
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Button,
  TextInput,
  Image,
} from 'react-native';

import {GlobalColors, GlobalStyles} from '../src/GlobalStyles';
import RBSheet from 'react-native-raw-bottom-sheet';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ReactNativeZoomableView from '@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {authorizedRequest, dump, getRequest} from '../Service';
import AsqmPostTransmission from '../src/transmission/AsqmPostTransmission';
import * as Progress from 'react-native-progress';

const PostAnswerSheet = ({refs, answerPost, threadPost, reload}) => {
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);
  const [sendProgress, setSendProgress] = useState(0);

  const [image0, setImage0] = useState();
  const [image1, setImage1] = useState();
  const [image2, setImage2] = useState();

  const selectImage = (index) => {
    launchImageLibrary(
      {mediaType: 'photo', quality: 0.8, includeBase64: true},
      (response) => {
        if (response.didCancel) return;

        if (index == 0) {
          setImage0(response);
        } else if (index == 1) {
          setImage1(response);
        } else if (index == 2) {
          setImage2(response);
        }
      },
    );
  };

  const sendAnswer = () => {
    var postra = new AsqmPostTransmission();
    postra.setLessonId(threadPost.lid);
    postra.setSubjectId(threadPost.sid);
    postra.setReplyToId(answerPost.id);
    postra.setPostBody(body);
    if (image2) {
      postra.setPostImages(image0, image1, image2);
    } else if (image1) {
      postra.setPostImages(image0, image1);
    } else if (image0) {
      postra.setPostImages(image0);
    }

    postra.transmitter.registerEvents(
      (progress) => {
        setSendProgress(progress);
      },
      (completed) => {
        reload();
      },
      (failed) => {},
    );

    setSending(true);
    postra.beginTask();
  };

  return (
    <RBSheet
      ref={refs}
      closeOnDragDown={true}
      closeOnPressMask={true}
      height={420}
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
      {sending ? (
        <View>
          <Text style={{fontWeight: 'bold', fontSize: 18, marginTop: 16}}>
            Çözüm Gönderiliyor...
          </Text>
          <Text
            style={{
              fontSize: 15,
              color: GlobalColors.subText,
              opacity: 0.8,
            }}>
            Lütfen bekleyin
          </Text>
          <Progress.Circle
            style={{margin: 16, marginBottom: 24}}
            progress={Number(sendProgress / 100)}
            thickness={8}
            size={80}
            formatText={(progress) => Math.floor(sendProgress) + '%'}
            showsText={true}
            textStyle={{fontSize: 16}}
          />
        </View>
      ) : (
        <View>
          <Text
            style={{
              marginStart: 18,
              fontWeight: 'bold',
              marginTop: 6,
              marginBottom: 10,
            }}>
            Çözüm Açıklamanız
          </Text>

          <TextInput
            style={styles.input}
            onChangeText={setBody}
            value={body}
            maxLength={2000}
            textAlignVertical="top"
            multiline={true}
            placeholderTextColor="rgb(90,90,90)"
            placeholder="Nasıl çözdünüz?.."
          />

          <View
            style={{
              borderBottomColor: 'rgba(0,0,0,.15)',
              paddingBottom: 14,
              borderBottomWidth: 1,
              paddingStart: 6,
              paddingEnd: 6,
            }}>
            <Text
              style={{
                padding: 8,
                fontWeight: 'bold',
                paddingBottom: 6,
                paddingTop: 12,
              }}>
              Çözüm Fotoğrafları
            </Text>

            <Text style={{padding: 8, paddingTop: 0}}>
              Çözümünüze dilerseniz 3 adete kadar fotoğraf ekleyebilirsiniz
            </Text>

            <View style={{flexDirection: 'row', marginStart: 8, marginEnd: 8}}>
              <TouchableOpacity
                onPress={() => selectImage(0)}
                style={{
                  flex: 1,
                  maxWidth: '33%',
                  height: 96,
                }}>
                {!image0 ? (
                  <View style={styles.placeh}>
                    <MaterialIcons
                      name="image"
                      color={'rgba(0,0,0,.8)'}
                      size={32}
                    />
                  </View>
                ) : (
                  <Image
                    source={{
                      uri: image0.uri,
                    }}
                    style={{
                      width: '100%',
                      height: 96,
                    }}
                    resizeMode="cover"
                  />
                )}
              </TouchableOpacity>

              {image0 == null ? (
                <></>
              ) : (
                <TouchableOpacity
                  onPress={() => selectImage(1)}
                  style={{
                    flex: 1,
                    maxWidth: '33%',
                    height: 96,
                  }}>
                  {!image1 ? (
                    <View style={styles.placeh}>
                      <MaterialIcons
                        name="image"
                        color={'rgba(0,0,0,.8)'}
                        size={32}
                      />
                    </View>
                  ) : (
                    <Image
                      source={{
                        uri: image1.uri,
                      }}
                      style={{
                        width: '100%',
                        height: 96,
                      }}
                      resizeMode="cover"
                    />
                  )}
                </TouchableOpacity>
              )}

              {image1 == null ? (
                <></>
              ) : (
                <TouchableOpacity
                  onPress={() => selectImage(2)}
                  style={{
                    flex: 1,
                    maxWidth: '33%',
                    height: 96,
                  }}>
                  {!image2 ? (
                    <View style={styles.placeh}>
                      <MaterialIcons
                        name="image"
                        color={'rgba(0,0,0,.8)'}
                        size={32}
                      />
                    </View>
                  ) : (
                    <Image
                      source={{
                        uri: image2.uri,
                      }}
                      style={{
                        width: '100%',
                        height: 96,
                      }}
                      resizeMode="cover"
                    />
                  )}
                </TouchableOpacity>
              )}
            </View>
          </View>

          <Button title="Gönder" onPress={() => sendAnswer()} />
        </View>
      )}
    </RBSheet>
  );
};

const AsqmContainer = ({
  post,
  type,
  navigation,
  threadId,
  reload,
  threadPost,
}) => {
  const [key, setKey] = useState(new Date());

  const [body, setBody] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalImage, setModalImage] = useState(null);
  const [replyVisible, setReplyVisible] = useState(false);

  const deleteMyPost = () => {
    Alert.alert(
      type === 'question' ? 'Sorumu Sil' : 'Çözümümü Sil',
      type === 'question'
        ? 'Sorunuzu silmek istediğinizden emin misiniz?'
        : 'Çözümünüzü silmek istediğinizden emin misiniz?',
      [
        {
          text: 'Vazgeç',
          style: 'cancel',
        },
        {
          text: 'Evet',
          onPress: () => {
            authorizedRequest('ss/asqm/post/delete', {
              post_id: post.id,
            })
              .then((response) => response.json())
              .then((json) => {
                reload();
              })
              .catch((error) => console.error(error));
          },
        },
      ],
    );
  };

  const deleteMyReply = (pid) => {
    Alert.alert('Yanıtımı Sil', null, [
      {
        text: 'Vazgeç',
        style: 'cancel',
      },
      {
        text: 'Evet',
        onPress: () => {
          authorizedRequest('ss/asqm/post/delete', {
            post_id: pid,
          })
            .then((response) => response.json())
            .then((json) => {
              reload();
            })
            .catch((error) => console.error(error));
        },
      },
    ]);
  };

  const reportThisPost = (pid, check) => {
    authorizedRequest('ss/asqm/post/report', {post_id: pid, check})
      .then((response) => response.json())
      .then((json) => {
        if (check) {
          if (json.report_exists) {
            alert('Bu gönderi ile ilgili raporunuzu aldık.');
          } else {
            reportThisPost(pid, false);
          }
        } else {
          alert(
            'Gönderiyi bildirdiğiniz için teşekkür ederiz. En kısa sürede incelenecektir.',
          );
        }
      })
      .catch((error) => alert('Bir sorun oluştu'));
  };

  const sendMyReply = (post_id) => {
    authorizedRequest('ss/asqm/post/reply', {post_id, body})
      .then((response) => response.json())
      .then((json) => {
        // This may not work, we gonna have to test it goood!
        post.replies.push(json.new_reply);
        setKey(new Date());
        setReplyVisible(false);
        // we may rerequest all thread :( sad stuff
      })
      .catch((error) => console.error(error));
  };

  const markAnswer = () => {
    Alert.alert('Çözümü Kabul Et?', null, [
      {
        text: 'Vazgeç',
        style: 'cancel',
      },
      {
        text: 'Evet',
        onPress: () => {
          authorizedRequest('ss/asqm/post/delete', {
            post_id: pid,
          })
            .then((response) => response.json())
            .then((json) => {
              authorizedRequest('ss/asqm/post/accept', {
                thread_id: threadId,
                answer_id: post.id,
              })
                .then((response) => response.json())
                .then((json) => {
                  reload();
                })
                .catch((error) => console.error(error));
            })
            .catch((error) => console.error(error));
        },
      },
    ]);
  };

  return (
    key && (
      <View
        style={[
          GlobalStyles.sscard,
          {
            marginStart: 0,
            marginEnd: 0,
            marginTop: 1,
            borderRadius: 0,
            elevation: 1.5,
            backgroundColor: 'white',
          },
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

        <View style={{...styles.userbar}}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Profile', {
                username: post.poster,
              });
            }}
            style={{
              flexDirection: 'row',
              width: '80%',
            }}>
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

            <View style={{flexDirection: 'column', marginStart: 9}}>
              <Text>{type === 'question' ? 'Soran' : 'Çözen'}</Text>
              <Text style={{fontWeight: 'bold'}}>@{post.poster}</Text>
            </View>
          </TouchableOpacity>

          {!post.solved &&
            type !== 'question' &&
            threadPost.poster === global.user.username && (
              <TouchableOpacity
                onPress={() => markAnswer()}
                style={{
                  alignSelf: 'flex-end',
                  padding: 8,
                  paddingStart: 10,
                  paddingEnd: 10,
                  borderRadius: 16,
                  position: 'absolute',
                  right: 52,
                  alignSelf: 'center',
                  top: 9,
                  backgroundColor: GlobalColors.accentColor,
                }}>
                <Text style={{color: 'white', fontSize: 13}}>ÇÖZÜMÜ SEÇ</Text>
              </TouchableOpacity>
            )}

          <TouchableOpacity
            onPress={() => {
              if (global.user.username === post.poster) deleteMyPost();
              else reportThisPost(post.id, true);
            }}
            style={{
              position: 'absolute',
              right: 9,
              top: 6,
              borderRadius: 20,
              padding: 8,
              backgroundColor: 'rgb(234, 234, 234)',
            }}>
            <MaterialIcons
              name={global.user.username === post.poster ? 'delete' : 'warning'}
              color={'black'}
              size={23}
            />
          </TouchableOpacity>
        </View>

        <View style={{margin: 8, marginBottom: 4}}>
          <Text
            style={{
              color: 'rgba(0, 0, 0, .6)',
              marginStart: 6,
              marginBottom: 6,
            }}>
            {post.p_date}
          </Text>
          <Text style={{marginStart: 6, marginBottom: 3}}>{post.body}</Text>

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
        <View style={{backgroundColor: GlobalColors.attentionCard}}>
          {post.replies.length !== 0 && (
            <View>
              {post.replies.map((reply) => {
                return (
                  <View
                    style={{
                      marginTop: 14,
                      marginBottom: 6,
                      marginEnd: 12,
                      marginStart: '20%',
                      flexDirection: 'row',
                    }}>
                    <View style={{flex: 1}}>
                      <View style={{flexDirection: 'row'}}>
                        <Image
                          style={{
                            height: 24,
                            width: 24,
                            borderRadius: 24 / 2,
                          }}
                          source={{uri: reply.poster_pic}}
                        />
                        <Text style={{fontWeight: 'bold', marginStart: 5}}>
                          @{reply.poster}
                        </Text>
                      </View>

                      <Text style={{marginStart: 27, marginTop: -4}}>
                        {post.body}
                      </Text>

                      <MaterialIcons
                        onPress={() => {
                          if (global.user.username === post.poster)
                            deleteMyReply(replyPost.id);
                          else reportThisPost(replyPost.id, true);
                        }}
                        style={{position: 'absolute', right: 0}}
                        name={
                          global.user.username === post.poster
                            ? 'delete'
                            : 'warning'
                        }
                        color={'black'}
                        size={18}
                      />
                    </View>
                  </View>
                );
              })}
            </View>
          )}

          {replyVisible ? (
            <>
              <TextInput
                style={{
                  ...styles.input,
                  backgroundColor: 'white',
                  marginStart: 64,
                  marginTop: 8,
                  marginEnd: 8,
                }}
                onChangeText={setBody}
                value={body}
                maxLength={2000}
                textAlignVertical="top"
                multiline={true}
                placeholderTextColor="rgb(90,90,90)"
                placeholder="Yanıtınızı girin"
              />
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <TouchableOpacity
                  onPress={() => setReplyVisible(false)}
                  style={{
                    padding: 8,
                    paddingStart: 18,
                    paddingEnd: 18,
                    borderRadius: 20,
                    marginBottom: 12,
                    marginStart: 64,
                    backgroundColor: GlobalColors.accentColor,
                  }}>
                  <Text style={{color: 'white'}}>VAZGEÇ</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => sendMyReply(post.id)}
                  style={{
                    padding: 8,
                    paddingStart: 18,
                    paddingEnd: 18,
                    borderRadius: 20,
                    marginBottom: 12,
                    marginEnd: 12,
                    backgroundColor: GlobalColors.accentColor,
                  }}>
                  <Text style={{color: 'white'}}>GÖNDER</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <TouchableOpacity
              onPress={() => setReplyVisible(true)}
              style={{
                alignSelf: 'flex-end',
                padding: 8,
                paddingStart: 18,
                paddingEnd: 18,
                borderRadius: 20,
                margin: 12,
                backgroundColor: GlobalColors.accentColor,
              }}>
              <Text style={{color: 'white'}}>CEVAPLA</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    )
  );
};

const AsqmThreadScreen = ({route, navigation}) => {
  const {threadId} = route.params;
  const [isLoading, setLoading] = useState(true);
  const [thread, setThread] = useState([]);
  const [answerPost, setAnswerPost] = useState();
  const answerSheet = useRef();

  useEffect(() => {
    requestThread();
  }, []);

  const requestThread = () => {
    getRequest('ss/asqm/thread?pid=' + threadId)
      .then((response) => response.json())
      .then((json) => {
        setThread(json.thread);
      })
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  };

  const reply = () => {};

  return (
    <SafeAreaView style={{flex: 1}}>
      <PostAnswerSheet
        refs={answerSheet}
        answerPost={answerPost}
        threadPost={thread}
        reload={() => requestThread()}
      />

      <View>
        {isLoading ? (
          <View
            style={{
              flex: 1,
              marginTop: 12,
              justifyContent: 'center',
              height: 120,
              alignItems: 'center',
            }}>
            <Text>Yükleniyor...</Text>
          </View>
        ) : (
          <ScrollView>
            {thread.solved && (
              <View style={{padding: 12, flex: 1, backgroundColor: '#6AA364'}}>
                <Text style={{color: 'white', fontSize: 17}}>
                  SORU ÇÖZÜLDÜ!
                </Text>
              </View>
            )}

            {/* Poster Card */}
            <AsqmContainer
              post={thread}
              type="question"
              threadPost={thread}
              reload={() => requestThread()}
              navigation={navigation}
            />

            {thread.answers && thread.answers.length > 0 ? (
              <View>
                <Text
                  style={{
                    fontWeight: 'bold',
                    marginStart: 12,
                    marginTop: 20,
                    marginBottom: 12,
                    marginEnd: 12,
                  }}>
                  ÇÖZÜMLER
                </Text>

                {thread.answers.map((post) => (
                  <AsqmContainer
                    post={post}
                    type="answer"
                    threadPost={thread}
                    reload={() => requestThread()}
                    threadOd={thread.id}
                  />
                ))}
              </View>
            ) : (
              <View
                style={{
                  height: 160,
                  marginStart: 24,
                  marginEnd: 24,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text>Henüz çözüm gönderilmemiş</Text>
                <Text>İlk çözümü siz gönderin!</Text>
              </View>
            )}

            <View style={{height: 128}}></View>
          </ScrollView>
        )}
      </View>

      {!isLoading && !thread.solved && (
        <View
          style={{
            position: 'absolute',
            right: 0,
            margin: 12,
            bottom: 0,
            width: 72,
            height: 72,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <TouchableOpacity
            onPress={() => {
              setAnswerPost(thread);
              answerSheet.current.open();
            }}
            style={{
              backgroundColor: 'rgba(62, 116, 182, 1)',
              width: 244,
              borderRadius: 33,
              height: 54,
              shadowOpacity: 0.43,
              flexDirection: 'row',
              shadowRadius: 2.62,
              alignItems: 'center',
              elevation: 1,
            }}>
            <MaterialIcons
              style={{alignSelf: 'center', marginStart: 16, marginEnd: 6}}
              name="send"
              color={'rgb(255,255,255)'}
              size={26}
            />
            <Text
              style={{
                color: 'white',
                fontSize: 15,
                fontWeight: 'bold',
                marginEnd: 12,
              }}>
              ÇÖZÜM GÖNDER
            </Text>
          </TouchableOpacity>
        </View>
      )}
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
  input: {
    minHeight: 72,
    marginStart: 16,
    marginEnd: 16,
    marginBottom: 12,
    padding: 12,
    color: 'black',
    borderRadius: 4,
    borderColor: 'rgb(220, 220, 220)',
    backgroundColor: 'rgb(244, 244, 244)',
    borderWidth: 1.5,
  },
  placeh: {
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    height: 96,
    borderWidth: 1,
    borderColor: 'rgb(210, 210, 210)',
    backgroundColor: 'rgb(244, 244, 244)',
  },
});

export default AsqmThreadScreen;
