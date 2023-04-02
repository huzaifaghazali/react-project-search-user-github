import React, { useState, useEffect, createContext } from 'react';
import mockUser from './mockData.js/mockUser';
import mockRepos from './mockData.js/mockRepos';
import mockFollowers from './mockData.js/mockFollowers';
import axios from 'axios';

const rootUrl = 'https://api.github.com';

const GithubContext = createContext();

// Provider , consumer 


const GithubProvider = (props) => {
   return (
      <GithubContext.Provider value={'hello'}>
         {props.children}
      </GithubContext.Provider>
   )
}

export {GithubProvider, GithubContext}