import React from 'react';

const SERVICE_URL = 'http://192.168.1.104:5000/';
// const SERVICE_URL = 'https://sorusayaci.com/';
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
