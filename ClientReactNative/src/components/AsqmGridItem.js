import React from 'react';

import {View, Text, Image} from 'react-native';

import {TouchableOpacity} from 'react-native-gesture-handler';

const AsqmGridItem = ({post, navigation}) => {
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('AsqmThread', {threadId: post.id})}>
      <View
        style={{
          height: 170,
          width: 170,
          margin: 3,
          overflow: 'hidden',
          borderRadius: 12,

          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.22,
          shadowRadius: 2.22,

          elevation: 2,
        }}>
        <Image
          style={{
            height: '100%',
            width: '100%',
          }}
          source={{uri: post.tmb}}
        />

        {/* Bottom Panel */}
        <View
          style={{
            width: '100%',
            padding: 8,
            backgroundColor: 'rgba(255, 255, 255, .8)',
            position: 'absolute',
            bottom: 0,
          }}>
          <Text style={{fontWeight: 'bold'}}>@{post.poster}</Text>
          <Text>
            {post.lesson}/{post.subject}
          </Text>
        </View>

        {post.solved && (
          <View
            style={{
              backgroundColor: 'black',
              position: 'absolute',
              backgroundColor: 'rgb(102,177,97)',
              top: 6,
              borderRadius: 30,
              padding: 6,
              elevation: 2,
              right: 6,
            }}>
            <Text style={{color: 'white', fontSize: 14}}>ÇÖZÜLDÜ</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default AsqmGridItem;
