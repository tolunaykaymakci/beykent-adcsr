import * as React from 'react';
import {Text, SafeAreaView, View} from 'react-native';
import * as Progress from 'react-native-progress';

function App() {
  return (
    <SafeAreaView style={{flex: 1}}>
      <View>
        <View style={{alignItems: 'center', justifyContent: 'center'}}>
          <Progress.Circle size={48} indeterminate={true} />
        </View>
      </View>
    </SafeAreaView>
  );
}
export default App;
