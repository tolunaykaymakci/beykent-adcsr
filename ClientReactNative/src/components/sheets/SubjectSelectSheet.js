import React, {useState} from 'react';
import {
  View,
  Button,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import {GlobalColors, GlobalStyles} from '../../GlobalStyles';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const SubjectSelectSheet = ({refs, subjects, onSelect}) => {
  const [query, setQuery] = useState('');
  return (
    <RBSheet
      ref={refs}
      animationType={'slide'}
      closeOnDragDown={false}
      closeOnPressMask={true}
      dragFromTopOnly={true}
      height={400}
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
      <View style={{height: 400}}>
        <Text style={{padding: 12, fontSize: 16}}>Konu Seç</Text>

        <View>
          <TextInput
            keyboardType="numeric"
            placeholder="Konularda ara"
            onChangeText={(text) => setQuery(text)}
            style={{
              fontSize: 16,
              backgroundColor: 'rgb(238,238,238)',
              borderBottomColor: 'rgb(226,226,226)',
              borderBottomWidth: 3,
              height: 40,
              padding: 12,
              marginStart: 12,
              marginEnd: 12,
              borderRadius: 12,
            }}>
            {query}
          </TextInput>
        </View>

        <View>
          <ScrollView style={{height: 310, marginTop: 8}}>
            {subjects == null ? (
              <></>
            ) : (
              <>
                {subjects.map((subject, i) => (
                  <TouchableOpacity
                    onPress={() => {
                      onSelect(subject);
                      refs.current.close();
                    }}
                    style={{
                      borderBottomColor: 'rgba(0,0,0,.04)',
                      borderBottomWidth: 1,
                    }}>
                    <Text
                      style={{
                        padding: 12,
                        fontSize: 15,
                        paddingBottom: 16,
                        paddingTop: 16,
                      }}>
                      {subject}
                    </Text>
                  </TouchableOpacity>
                ))}
              </>
            )}
          </ScrollView>
        </View>
      </View>
    </RBSheet>
  );
};

export default SubjectSelectSheet;
