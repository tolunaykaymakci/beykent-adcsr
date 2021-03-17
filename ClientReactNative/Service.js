import React from 'react';

const GTOKEN =
  'eyJhbGciOiJSUzI1NiIsImtpZCI6Ijg0NjJhNzFkYTRmNmQ2MTFmYzBmZWNmMGZjNGJhOWMzN2Q2NWU2Y2QiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI4MzU2OTkyMjg0NTQtYzdjcmZja3NucXFhNWk4dWJsMGNoM2pidTllYjZjODkuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI4MzU2OTkyMjg0NTQtNXF0dG1oYWwwZ2xsMGUwNXM0NWE5c3JudjM3bjM5M2guYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDkxMzU0NTUyMzMyMzAxNzYzNDgiLCJlbWFpbCI6ImRlc3Rlay5kZXZyZWthcnRpQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJuYW1lIjoiRGV2cmVLYXJ0xLEgRGVzdGVrIiwicGljdHVyZSI6Imh0dHBzOi8vbGg1Lmdvb2dsZXVzZXJjb250ZW50LmNvbS8ta2VaSTdYb3g3NjgvQUFBQUFBQUFBQUkvQUFBQUFBQUFBQUEvQU1adXVjbW9FZmc0RV9tcVByOXlXOFNHeXFwdTEzUFpIdy9zOTYtYy9waG90by5qcGciLCJnaXZlbl9uYW1lIjoiRGV2cmVLYXJ0xLEiLCJmYW1pbHlfbmFtZSI6IkRlc3RlayIsImxvY2FsZSI6InRyIiwiaWF0IjoxNjE1ODU0MDU1LCJleHAiOjE2MTU4NTc2NTV9.FFngKqFxLABf65_b5il8A82RRe8a-Jv2Jblr1IrTH5BkddwPDmlcUijqp7Mtu0pnaELSSzF_8xFJA_rsQjFEl7IV_lpwgcoa64zJUcFkkjkdYAiLELdTPq2MkILFuErlguPNRGV3y3viJaWO2xHpk2iYngArmiGjmqie6vhof57lUyHEJ7YWIFDtzRYNQJdao8GZeEOO6TSA6HJKjDyZ4NxpJaAcE6AFfTjrk6BZP34-xl3MyVV5Nie6Gf1h-tfZubWMKw-2m055IQwLYPw1FnnxJapyBfFMCBe-0Bxu6K-35AOjA4OtVLVrERj9m3MNdZIF2bHeD-rWg-KjckyGiw';

export const AuthorizedRequestContract = {
  gt: GTOKEN,
};

export const AuthorizedRequest = (json1) => {
  return {...json1, ...AuthorizedRequestContract};
};

export const AuthorizedRequest2 = (url, params) => {
  /*   let data = {
    method: 'POST',
    credentials: 'same-origin',
    mode: 'same-origin',
    body: JSON.stringify({...json1, ...AuthorizedRequestContract}),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };
 */
  return fetch(url, params);
};

export function authorizedRequest(url, params) {
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

  return fetch(url, data);
}

export function casualRequest(url, params) {
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

  return fetch(url, data);
}
