import React, { useState, useEffect, createContext } from 'react';
import mockUser from './mockData.js/mockUser';
import mockRepos from './mockData.js/mockRepos';
import mockFollowers from './mockData.js/mockFollowers';
import axios from 'axios';

const rootUrl = 'https://api.github.com';

const GithubContext = createContext();

// Provider , consumer

const GithubProvider = (props) => {
  const [githubUser, setGithubUser] = useState(mockUser);
  const [repos, setRepos] = useState(mockRepos);
  const [followers, setFollowers] = useState(mockFollowers);

  // request loading
  const [requests, setRequests] = useState(0);
  const [loading, setIsLoading] = useState(false);
  const [error, setError] = useState({ show: false, msg: '' });

  // check rate
  const checkRequests = () => {
    axios(`${rootUrl}/rate_limit`)
      .then(({ data }) => {
        let {
          rate: { remaining },
        } = data;
        console.log(data);
        setRequests(remaining);

        if (remaining === 0) {
          toggleError(true, 'Sorry you have exceeded your hourly rate limit');
        }
      })
      .catch((err) => console.log(err));
  };

  // error
  const toggleError = (show = false, msg = '') => {
    setError({ show, msg });
  };

  useEffect(checkRequests, []);
  return (
    <GithubContext.Provider
      value={{ githubUser, repos, followers, requests, error }}
    >
      {props.children}
    </GithubContext.Provider>
  );
};

export { GithubProvider, GithubContext };
