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

    //this.originalBitmaps = images;
    this.transmitter.dataBytes = [];
    this.transmitter.request.ds = [];

    images.forEach((image, index) => {
      this.transmitter.dataBytes[index] = base64.decode(image.base64);
      this.transmitter.request.ds[index] = image.fileSize;
    });
  };

  this.beginTask = function () {
    this.transmitter.beginTransmission();
  };
};

export default AsqmPostTransmission;
