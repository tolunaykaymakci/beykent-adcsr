import React, {useState, useEffect, useRef} from 'react';
import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import {authorizedRequest} from '../Service';

const AsqmManageReports = () => {
  const [reportedPosts, setReportedPosts] = useState();

  useEffect(() => {
    authorizedRequest('ss/asqm/post/report/manage', {})
      .then((response) => response.json())
      .then((json) => {
        setReportedPosts(json);
      })
      .catch((error) => console.error(error));
  }, []);

  return reportedPosts ? (
    <ScrollView>
      {reportedPosts.map((rp) => (
        <TouchableOpacity style={{backgroundColor: 'white'}}>
          <Text>{rp.report_date}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  ) : (
    <View></View>
  );
};

export default AsqmManageReports;
