import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  SectionList,
  ScrollView,
} from 'react-native';

import {GlobalStyles, GlobalColors} from '../../src/GlobalStyles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

function RecordDetailsScreen({route, navigation}) {
  const RECDM_QUESTION_REPORT_LESSON = 5;
  const RECDM_QUESTION_REPORT_SUBJECT = 6;

  const {initMode} = route.params;

  return <SafeAreaView></SafeAreaView>;
}

export default RecordDetailsScreen;
