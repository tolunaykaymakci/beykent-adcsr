import React, {useRef, useLayoutEffect, useState} from 'react';

export class TestDataItem {
  constructor(pholder) {
    this.type = 'test';
    this.placeholder = pholder;
    this.subject_title;
    this.totalCount = 0;
    this.correctCount = 0;
    this.wrongCount = 0;
    this.detailed = false;
    this.key = Math.random().toString(36).substr(2, 9);
  }
}

export class SubjectDataItem {
  constructor(pholder) {
    this.type = 'subject';
    this.placeholder = pholder;
    this.subject_title;
    this.tdi = [];
    this.key = Math.random().toString(36).substr(2, 9);
  }
}
