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

   return (
      <GithubContext.Provider value={{githubUser, repos, followers}}>
         {props.children}
      </GithubContext.Provider>
   )
}

export {GithubProvider, GithubContext}