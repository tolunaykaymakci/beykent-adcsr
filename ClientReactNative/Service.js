import React from 'react';

const SERVICE_URL = 'https://sorusayaci.com/';

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
    body: JSON.stringify({...params, ...AuthorizedRequestContract}),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };

  if (ep.indexOf('://') < 0) {
    ep = SERVICE_URL + ep;
  }

  return fetch(ep, data);
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

  if (ep.indexOf('://') < 0) {
    ep = SERVICE_URL + ep;
  }

  return fetch(ep, data);
}
