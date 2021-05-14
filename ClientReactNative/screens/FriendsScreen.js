import React, {useEffect, useState, useRef} from 'react';
import {Text, SafeAreaView, Button} from 'react-native';
import {dump} from '../Service';
import AsqmPostTransmission from '../src/transmission/AsqmPostTransmission';
import DataTransmission from '../src/transmission/DataTransmission';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import base64 from 'react-native-base64';

function App() {
  const image0bytes = useRef();
  const image1bytes = useRef();
  const image2bytes = useRef();

  useEffect(() => {
    var trs = new DataTransmission();
    trs.registerEvents(
      (progress) => {
        console.log(progress);
      },
      () => {},
      () => {
        console.log('error');
      },
    );

    //trs.beginTransmission();
    //initAsqmPostTransmission();
  }, []);

  const startTransmission = () => {
    var postra = new AsqmPostTransmission();
    postra.setLessonId(12);
    postra.setSubjectId(45);
    postra.setPostBody('osman testleri');

    if (image2bytes.current) {
      postra.setPostImages(
        image0bytes.current,
        image1bytes.current,
        image2bytes.current,
      );
    } else if (image1bytes.current) {
      postra.setPostImages(image0bytes.current, image1bytes.current);
    } else if (image0bytes.current) {
      postra.setPostImages(image0bytes.current);
    }

    postra.beginTask();
    //dump(global.user);

    //postra.transmitter.registerEvents;
  };

  const selectImage = (index) => {
    launchImageLibrary(
      {mediaType: 'photo', quality: 0.8, includeBase64: true},
      (response) => {
        if (index == 0) {
          image0bytes.current = response;
        } else if (index == 1) {
          image1bytes.current = response;
        } else if (index == 2) {
          image2bytes.current = response;
        }
      },
    );
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#ddd'}}>
      <Text>Arkadaşlarım buraya gelecek</Text>
      <Button onPress={() => selectImage(0)} title="Load image to first slot" />
      <Button onPress={() => startTransmission()} title="Start sending..." />
    </SafeAreaView>
  );
}
export default App;
