import React from 'react';

const GTOKEN =
  'eyJhbGciOiJSUzI1NiIsImtpZCI6ImVlYTFiMWY0MjgwN2E4Y2MxMzZhMDNhM2MxNmQyOWRiODI5NmRhZjAiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI4MzU2OTkyMjg0NTQtYzdjcmZja3NucXFhNWk4dWJsMGNoM2pidTllYjZjODkuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI4MzU2OTkyMjg0NTQtNXF0dG1oYWwwZ2xsMGUwNXM0NWE5c3JudjM3bjM5M2guYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDg5ODEyMjcxMTU1Nzg0OTIzNDUiLCJlbWFpbCI6InRvbHVuYXlrYXltYWtjaUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwibmFtZSI6IlRvbHVuYXkgS2F5bWFrw6fEsSIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS0vQU9oMTRHaTllenJwUkRyNXFRRTZybzYwMnB4NnpzUFVCQnA1WmU0T3pXdDk9czk2LWMiLCJnaXZlbl9uYW1lIjoiVG9sdW5heSIsImZhbWlseV9uYW1lIjoiS2F5bWFrw6fEsSIsImxvY2FsZSI6ImVuIiwiaWF0IjoxNjExODM2NzY1LCJleHAiOjE2MTE4NDAzNjV9.Um_UyfL1iroVAh55T_TXAnAkLSPgF68T_v8eEWU6xfeB-65FjGMj5RZB83VlfxghXdE8ymGWVgSw508UTS2faER7isHJYDYE5QCZOyzJPgwZLj51s74BQxZc69Z53lkvaBDLIKQQu4fsVFhoKAceCH-xGXpAKREIP1DCy_ecCFsnq0YeZw38qNfoWOVW51Zq6qMzByOLMqO9BuaZOFvqyHhIZM7zFMLM7PtKndtxx5yb2QiUzb1FwpmCSXYEyIg7aTPTQdoAC4xOS0QHID8k9trb0rCcB0z4MzlQ_Dgen9NaiuZTcK2mh0NA8zMa2dtf3IQMpt9fkHwvPDD9Ed7gCg';

export const AuthorizedRequestContract = {
  gt: GTOKEN,
};

export const AuthorizedRequest = (json1) => {
  return {...json1, ...AuthorizedRequestContract};
};

export const AuthorizedRequest2 = (url, params) => {
  let data = {
    method: 'POST',
    credentials: 'same-origin',
    mode: 'same-origin',
    body: JSON.stringify({...json1, ...AuthorizedRequestContract}),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };

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
