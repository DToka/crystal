import React, {useState, useEffect } from 'react'
const axios = require('axios');
const {url} =  require('../conf.js');


const UserView = ({loggedInUser, changeSelectedUser, followedUsers}) => {

    let searchName ="";
    let [users, setUsers] = useState([]);
    let [query, setQuery] = useState("top");
    let [following, setFollowing] = useState(followedUsers);
    
    useEffect(()=>{
        getUserQuery(query);
    }, []);



    async function getUserQuery(query){
        if(query==="top"){
            await axios.get(url+"/users/top")
            .then(res =>{
                if(res.data.length>10){
                    setUsers(res.data.slice(0,10));
                }else{
                    setUsers(res.data);   
                }
            }).catch(error=>{
                console.log(error);
            })
        }else if(query==="following"){
            setUsers(followedUsers);
        }else if(query==="search"){
            if(searchName.length>0){
                await axios.get(url+"/users/search/"+searchName)
                .then(response=>{
                    if(response.data.length>10){
                        setUsers(response.data.slice(0,10));
                    }else{
                        setUsers(response.data);   
                    }
                }).catch(error=>{
                    console.log(error);
                })
            }else{
                setUsers([]);
            }
        }else{ 
            console.log("Unknown query!");
        }
    }

    function toggleQuery(e){
        e.preventDefault();
        setQuery(e.target.value);
        getUserQuery(e.target.value);
    }

    function updateSearchName(e){
        e.preventDefault();
        searchName=e.target.value;
        getUserQuery(query);
    }

    function changeUser(e){
        e.preventDefault();

        // document.getElementById("querySelect").value = "top";
        // setQuery("top");
        // getUserQuery("top");

        changeSelectedUser(e.target.id);

    }


    let searchInput;
    if(query==="search"){
        searchInput = <div>Search for user:<input onChange={(e)=>updateSearchName(e)}></input></div>
    }else{
        
    }


    let usersTable;
    if(users !== null && users.length > 0){
        usersTable = <div> 
        <ul >
            {
                users.map(user=><li className="userViewLi" id={user} key={user} onClick={(e)=>changeUser(e)}>{user}</li>)
            }
        </ul></div>
        
    }else{
        usersTable = <div>No users found!</div>
    }

    let options;
    if(loggedInUser){
        options=<select name="query" id="querySelect" onChange={(e)=>toggleQuery(e)} >
        <option value="top">Top Users</option>
        <option value="following">Following users</option>
        <option value="search">Search for user</option>
        </select>
    }else{
        options=<select name="query" id="querySelect" onChange={(e)=>toggleQuery(e)} >
        <option value="top">Top Users</option>
        <option value="search">Search for user</option>
        </select>
    }

    return(
        <div className="UserView">
            Users<br/>
            {options}
            {searchInput}
            {usersTable}


        </div>
    )



}

export default UserView;