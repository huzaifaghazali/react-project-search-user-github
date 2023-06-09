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
  const [isLoading, setIsLoading] = useState(false);
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

    setIsLoading(true);

    const response = await axios(`${rootUrl}/users/${user}`).catch((error) => {
      console.log(error);
    });

    console.log(response);

    if (response) {
      setGithubUser(response.data);

      const { login, followers_url } = response.data;

      // repos && followers

      await Promise.allSettled([
        axios(`${rootUrl}/users/${login}/repos?per_page=100`),
        axios(`${followers_url}?per_page=100`),
      ]).then((results) => {
        const [repos, followers] = results;
        const status = 'fulfilled';

        if(repos.status === status) {
          setRepos(repos.value.data);
        }

        if(repos.status === status) {
          setFollowers(followers.value.data);
        }

      })

    } else {
      toggleError(true, 'there is no user with that username');
    }

    checkRequests();
    setIsLoading(false);
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
        isLoading,
      }}
    >
      {props.children}
    </GithubContext.Provider>
  );
};

export { GithubProvider, GithubContext };
