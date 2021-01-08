import React from 'react';
import Directory from './Directory';
import {isExpired, decodeToken} from "react-jwt";
const axios = require('axios');
const {url} =  require('../conf.js');

function getContent(path){}

const BMView = ({name, parent, logout, followed, setFollowed, addFollowed, removeFollowed}) => {
    let following = followed;
    let followButton;
    let token=localStorage.getItem('JWT');

    if(!isExpired(token)){
        let userName = decodeToken(token).name;
        if(name!==userName){
            if(following===true){
                followButton=<button onClick={(e)=>unFollow(name)}>Unfollow</button>
            }else{
                followButton=<button onClick={(e)=>follow(name)}>Follow</button>
            }
        }
    }

    async function follow(toFollow){
        if(isExpired(token)){
            logout();
        }else{
            let data={
                followName: toFollow
            };
            await axios.post(url+"/api/follow",data,{headers: {
                'authorization': `token ${token}`
              }}).then(response=>{
                  following=true;
                  setFollowed(true);
                  addFollowed(toFollow);
              }).catch(error=>{
                  console.log(error); 
              })
        }
      }

    async function unFollow(toUnfollow){
        if(isExpired(token)){
            logout();
        }else{
            let data = {
                unfollowName: toUnfollow
            }
            await axios.post(url+"/api/unfollow",data, {headers: {
                'authorization': `token ${token}`
              }}).then(response=>{
                following=false;
                setFollowed(false);
                removeFollowed(toUnfollow);
              }).catch(error=>{
                console.log(error); 
            })
        }
      }

    if(name!=="" && name!==undefined){
        return(
            <div className="BMView">
                Viewing: {name}{followButton}
                <Directory owner={name} name={name} parent={parent} parentReRender={getContent} logout={logout} />
            </div>
        )
    }else{
        return(
            <div className="BMView">
                No Username selected, please select a user to view
            </div>
        )
    }

}

export default BMView;