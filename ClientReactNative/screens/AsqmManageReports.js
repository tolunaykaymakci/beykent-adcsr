import React, {useState, useEffect, useRef} from 'react';
import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import {authorizedRequest, dump} from '../Service';

const AsqmManageReports = ({route, navigation}) => {
  const [reportedPosts, setReportedPosts] = useState();

  useEffect(() => {
    authorizedRequest('ss/asqm/post/report/manage', {})
      .then((response) => response.json())
      .then((json) => {
        dump(json);
        setReportedPosts(json);
      })
      .catch((error) => console.error(error));
  }, []);

  return reportedPosts ? (
    <ScrollView>
      {reportedPosts.map((rp) => (
        <>
          <View style={{backgroundColor: 'white', padding: 12}}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('AsqmThread', {threadId: rp.post.id})
              }>
              <Text>Rapor Id: {rp.report_id}</Text>
              <Text>Şikayet Eden: @{rp.reported_by.username}</Text>
              <Text>Şikayet Tarihi: {rp.report_date}</Text>
              <Text>Post Türü: {rp.post.post_type}</Text>
            </TouchableOpacity>
          </View>

          <View
            style={{
              height: 0.6,
              flex: 1,
              backgroundColor: 'black',
              opacity: 0.12,
            }}></View>
        </>
      ))}
    </ScrollView>
  ) : (
    <View></View>
  );
};

export default AsqmManageReports;
