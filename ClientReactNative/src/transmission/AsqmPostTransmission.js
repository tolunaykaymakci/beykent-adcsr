import {dump} from '../../Service';
import DataTransmission from './DataTransmission';
import {PostComposationRequest} from './DTRequest';
import base64 from 'react-native-base64';

let AsqmPostTransmission = function () {
  this.thumbBitmaps = [];
  this.originalBitmaps = [];
  this.transmitter = new DataTransmission();

  this.transmitter.setEntryPoint('ss/asqm/post/compose');
  this.transmitter.setRequest(new PostComposationRequest());

  this.setLessonId = function (lesson) {
    this.transmitter.request.lid = lesson;
  };

  this.setSubjectId = function (subject) {
    this.transmitter.request.sid = subject;
  };

  this.setPostBody = function (body) {
    this.transmitter.request.p_body = body;
  };

  this.setReplyToId = function (post) {
    this.transmitter.request.reply_to = post;
  };

  this.setMarkAnswer = function (mark) {
    this.transmitter.request.mark_a = mark;
  };

  this.setPostImages = function (...images) {
    const DESIRED_BITMAP_SIZE = 1500;

    this.transmitter.dataBytes = [];
    this.transmitter.request.ds = [];

    var Buffer = require('buffer/').Buffer;

    images.forEach((image) => {
      let bytes = Buffer.from(image.base64, 'base64');
      var sbytes = [];

      // Convert byte[] to sbyte[] because server prefers that
      for (var b = 0; b != bytes.length; b++) {
        var sbyte = (bytes[b] & 127) - (bytes[b] & 128);
        sbytes.push(sbyte);
      }

      this.transmitter.dataBytes.push(sbytes);
      this.transmitter.request.ds.push(image.fileSize);
    });
  };

  this.beginTask = function () {
    this.transmitter.beginTransmission();
  };
};

export default AsqmPostTransmission;
