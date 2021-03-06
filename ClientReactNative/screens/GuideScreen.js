import React, {useState} from 'react';
import {View, Text, SafeAreaView} from 'react-native';
import {WebView} from 'react-native-webview';

import * as Progress from 'react-native-progress';
import {GlobalColors, GlobalStyles} from '../src/GlobalStyles';
import {makeApiep} from '../Service';

function App() {
  const [showLoading, setShowLoading] = useState(true);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <WebView
        cacheMode="LOAD_NO_CACHE"
        cacheEnabled={false}
        onLoad={() => setShowLoading(false)}
        source={{
          uri: makeApiep('adcsr-calc.html?mode=yks'),
        }}
      />

      {!showLoading ? (
        <></>
      ) : (
        <View
          style={{
            position: 'absolute',
            backgroundColor: GlobalColors.windowBackground,
            top: 0,
            bottom: 0,
            alignItems: 'center',
            justifyContent: 'center',
            left: 0,
            right: 0,
          }}>
          {/* <Progress.Circle thickness={40} size={24} indeterminate={true} /> */}
        </View>
      )}
    </SafeAreaView>
  );
}
export default App;
