import React from 'react';

import {ServiceWorkerL, ServiceWorkerR} from './src/components/ssjs-widget';

// const SERVICE_URL = ServiceWorkerL();
const SERVICE_URL = ServiceWorkerR();
const GTOKEN = '{adcsr}';
export const AuthorizedRequestContract = {
  gt: GTOKEN,
};

export function getRequest(ep, params) {
  if (ep.indexOf('://') < 0) {
    ep = SERVICE_URL + ep;
  }

  return fetch(ep);
}

export function authorizedRequest(ep, params) {
  let data = {
    method: 'POST',
    credentials: 'same-origin',
    mode: 'same-origin',
    body: JSON.stringify({
      ...params,
      ...AuthorizedRequestContract,
      uc: global.cred,
      up: global.pwd,
    }),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };

  return fetch(makeApiep(ep), data);
}

export function casualRequest(ep, params) {
  let data = {
    method: 'POST',
    credentials: 'same-origin',
    mode: 'same-origin',
    body: JSON.stringify(params),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };

  return fetch(makeApiep(ep), data);
}

export function dump(o) {
  console.log(JSON.stringify(o, null, 2));
}

export const getAuthToken = () => {
  return GTOKEN;
};

export const makeApiep = (ep) => {
  if (ep.indexOf('://') < 0) {
    ep = SERVICE_URL + ep;
  }
  return ep;
};

export const updateUserInfo = (callback) => {
  authorizedRequest('api/account/info', {info_self: true})
    .then((response) => response.json())
    .then((json) => {
      if (json.status && json.status == 401) {
        return;
      }

      global.user = json;
      callback();
    });
};
