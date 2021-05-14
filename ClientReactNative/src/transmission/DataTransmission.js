import {authorizedRequest, dump, getAuthToken} from '../../Service';
import {DataTransmissionRequest} from './DTRequest';

const TransmissionSteps = {
  BeginTransaction: 0,
  TransmitData: 1,
  Completed: 2,
};

const DATA_PACKET_SIZE = 65536;

let DataTransmission = function () {
  this.dataBytes = [];
  this.jobCompleted = false;
  this.entryPoint = '';
  this.currentDataIndex = 0;
  this.currentDataPosition = 0;
  this.dataPacketSize = DATA_PACKET_SIZE;

  this.request = new DataTransmissionRequest();

  this.registerEvents = function (progress, completed, failed) {
    this.progress = progress;
    this.completed = completed;
    this.failed = failed;
  };

  this.beginTransmission = function () {
    this.request.s = TransmissionSteps.BeginTransaction;
    this.request.di = 0;
    this.doRequest();
  };

  this.setEntryPoint = function (ep) {
    this.entryPoint = ep;
  };

  this.setRequest = function (req) {
    this.request = req;
  };

  this.doRequest = function () {
    authorizedRequest(this.entryPoint, this.request)
      .then((response) => response.json())
      .then((json) => {
        this.processResponse(json);
      })
      .catch((error) => console.error(error))
      .finally(() => {});
  };

  this.processResponse = function (response) {
    let request = new DataTransmissionRequest();

    if (this.jobCompleted) {
      if (this.completed) this.completed();
      return;
    }

    if (response.res !== 'OK') {
      if (this.failed) this.failed(response.msg);
      return;
    }

    if (response.step === TransmissionSteps.BeginTransaction) {
      if (this.began) this.began();
    }

    if (this.dataBytes == null && this.step === TransmissionSteps.Completed) {
      if (this.completed) this.completed();
      return;
    }

    request.s = TransmissionSteps.TransmitData;

    var bitmap = this.dataBytes[this.currentDataIndex];
    if (this.currentDataPosition === bitmap.length) {
      if (this.dataBytes.length - 1 > this.currentDataIndex) {
        this.currentDataIndex++;
        this.currentDataPosition = 0;
        bitmap = dataBytes[this.currentDataIndex];
      } else {
        request.s = TransmissionSteps.Completed;
        this.jobCompleted = true;
      }
    }

    if (!this.jobCompleted) {
      if (this.currentDataPosition + DATA_PACKET_SIZE > bitmap.length) {
        request.d = bitmap.slice(this.currentDataPosition, bitmap.length);
        this.currentDataPosition = bitmap.length;
      } else {
        request.d = bitmap.slice(
          this.currentDataPosition,
          this.currentDataPosition + DATA_PACKET_SIZE,
        );
        this.currentDataPosition += DATA_PACKET_SIZE;
      }
    }

    if (this.progress) {
      var totalBytes = 0;
      this.dataBytes.forEach((db, i) => {
        totalBytes += db.length;
      });

      var currentBytes = 0;
      var pointer = 0;
      while (pointer < this.currentDataIndex + 1) {
        if (pointer == this.currentDataIndex) {
          currentBytes += this.currentDataPosition;
        } else {
          currentBytes += this.dataBytes[pointer].length;
        }
        pointer++;
      }

      var calculation = (currentBytes * 100) / totalBytes;
      if (!isFinite(result)) {
        calculation = 0;
      }

      this.progress(calculation);
    }

    request.di = this.currentDataIndex;
    request.tid = response.tid;

    this.request = request;
    this.doRequest();
  };
};

export default DataTransmission;
