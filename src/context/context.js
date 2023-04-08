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
        setRequests(remaining);

        if (remaining === 0) {
          toggleError(true, 'Sorry you have exceeded your hourly rate limit');
        }
      })
      .catch((err) => console.log(err));
  };

  // Search Github user
  const searchGithubUser = async (user) => {
    toggleError();

    // setLoading(true);

    const response = await axios(`${rootUrl}/users/${user}`).catch((error) => {
      console.log(error);
    });

    console.log(response);

    if (response) {
      setGithubUser(response.data);
    } else {
      toggleError(true, 'there is no user with that username');
    }
  };

  // error
  const toggleError = (show = false, msg = '') => {
    setError({ show, msg });
  };

  useEffect(checkRequests, []);
  return (
    <GithubContext.Provider
      value={{
        githubUser,
        repos,
        followers,
        requests,
        error,
        searchGithubUser,
      }}
    >
      {props.children}
    </GithubContext.Provider>
  );
};

export { GithubProvider, GithubContext };
