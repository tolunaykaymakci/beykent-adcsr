import React from 'react';
import {Text, SafeAreaView, View, TouchableOpacity} from 'react-native';
import * as Progress from 'react-native-progress';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

function App({route, navigation}) {
  const {planId} = route.params;
  return (
    <SafeAreaView style={{flex: 1}}>
      <View>
        <View style={{alignItems: 'center', justifyContent: 'center'}}>
          <Progress.Circle size={48} indeterminate={true} />
        </View>
      </View>

      <TouchableOpacity
        onPress={() => navigation.navigate('ManStudy', {})}
        style={{
          backgroundColor: 'rgba(255, 141, 115, 1)',
          width: 64,
          borderRadius: 32,
          height: 64,
          shadowOpacity: 0.43,
          shadowRadius: 2.62,
          elevation: 1,
          position: 'absolute',
          alignItems: 'center',
          bottom: 0,
          right: 0,
          margin: 16,
        }}>
        <MaterialIcons
          style={{alignSelf: 'center', marginTop: 15}}
          name="add"
          color={'rgb(255,255,255)'}
          size={32}
        />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
export default App;
