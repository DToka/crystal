import React, { useEffect, useState } from 'react';
import {isExpired, decodeToken} from "react-jwt";
// import logo from './Bookmark.png';
import './App.css';
import BMView from './Components/BMView';
import UserView from './Components/UserView';
import LoginView from './Components/LoginView';
const axios = require('axios');
const {url} =  require('./conf.js');

function App() {
  let [selectedUser, setSelectedUser] = useState();
  let [loggedIn, setLoggedIn] = useState(false);
  let [loggedInUser, setLoggedInUser] = useState();
  let [following, setFollowing] = useState(false);
  let [followedUsers, setFollowedUsers] = useState([]);
  let token=localStorage.getItem('JWT');
  let currentFollowedUsers=[];

  async function getFollowing(name){
    let res=await axios.get(url+"/users/following/"+name).then(res=>{
      currentFollowedUsers = res.data;
      setFollowedUsers(res.data);
    }).catch(err=>{
      console.log(err);
    });
    
  }

  useEffect(()=>{
    if(token){
      let decoded=decodeToken(token);
      let expired=isExpired(token);
      if(!expired){
        getFollowing(decoded.name);
        setLoggedInUser(decoded.name);
        changeSelectedUser(decoded.name);
        setLoggedIn(true);
      }
    }
  }, [])

  function changeSelectedUser(username){
    setSelectedUser(username);
    if(!isExpired(token) && username!==loggedInUser){
      if(followedUsers.includes(username)){
        setFollowing(true);
      }else{
        setFollowing(false);
      }
    }
  }

  function addFollowed(name){
    currentFollowedUsers = followedUsers;
    currentFollowedUsers.push(name);
    setFollowedUsers(currentFollowedUsers);
  }

  function removeFollowed(name){
    currentFollowedUsers=followedUsers;
    currentFollowedUsers.pop(name);
    setFollowedUsers(currentFollowedUsers);
  }

  function loginCreatePost(username){
    setLoggedInUser(username);
    setLoggedIn(true);
    setSelectedUser(username);
    getFollowing(username);
  }

  function logout(){
    localStorage.removeItem('JWT');
    setLoggedInUser(null);
    setLoggedIn(false);
  }

  return (
      <div className="App">
        <h1>Bookmark World</h1>
        <LoginView logout={logout} loginCreatePost={loginCreatePost} loggedInUser={loggedInUser}  loggedIn={loggedIn} />
        <BMView name={selectedUser} parent="/" logout={logout} followed={following} setFollowed={setFollowing} removeFollowed={removeFollowed} addFollowed={addFollowed} />
        <UserView loggedInUser={loggedInUser} changeSelectedUser={changeSelectedUser} logout={logout} followedUsers={followedUsers} />
      </div>
  );
}

export default App;
