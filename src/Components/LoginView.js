import React from 'react';
import ReactDOM from 'react-dom';
const axios = require('axios');
const {url} =  require('../conf.js');
const {isAlphaNumeric} = require('../utils.js');

const LoginView = ({logout, loginCreatePost, loggedInUser, loggedIn, })=>{

    const modalStyle = {
        display: "none", /* Hidden by default */
        position: "fixed", /* Stay in place */
        paddingTop: "100px", /* Location of the box */
        left: 0,
        top: 0,
        zindex: 9999999,
        width: "100%", /* Full width */
        height: "100%", /* Full height */
        overflow: "auto", /* Enable scroll if needed */
        backgroundColor: "rgba(0,0,0,0.4)" /* Fallback color */
    }

    const modalContentStyle={
        backgroundColor: "rgb(200,200,200)",
        margin: "auto",
        padding: "20px",
        border: "10px solid #888",
        width: "80%"
    };

    const modalCloseStyle={
        backgroundColor: "rgb(200,200,200)",
        color: "#aaaaaa",
        float: "right",
        fontSize: "28px",
        fontWeight: "bold"
    };


    const errorStyle={
        fontWeight: "bold",
        fontSize: "20px",
        color:"red"
    }

    function loginPopup(e){
        e.preventDefault();
        let element = document.getElementById("loginModalId");
        ReactDOM.findDOMNode(element).style.display = "block";

    }
    function createPopup(e){
        e.preventDefault();
        let element = document.getElementById("createModalId");
        ReactDOM.findDOMNode(element).style.display = "block";
    }

    function getOutsideClick(e){
        e.preventDefault();       
        let classListName=e.target.classList[0];
        if(classListName === "loginModalClass" || classListName === "loginModalCloseClass"){
            let element = document.getElementById("loginModalId");
            closePopup(element);
        }
        if(classListName === "createModalClass" || classListName === "createModalCloseClass"){
            let element = document.getElementById("createModalId");
            closePopup(element);
        }
    }

    function closePopup(element){
        ReactDOM.findDOMNode(element).style.display = "none";
    }

    async function login(){

        let user=document.getElementById("loginUsername").value;
        let pass=document.getElementById("loginPassword").value;

        const data = {
            username: user,
            password: pass
        };
        let res=await axios.post(url+"/login",data);
        if(res.data.accessToken){
            localStorage.setItem('JWT',res.data.accessToken);
            loginCreatePost(user);
            closePopup(document.getElementById("loginModalId"));

        }else{
            let error=document.getElementById("loginError");
            error.innerHTML = "Error logging in. Check username/password";
            setTimeout(()=>{error.innerHTML=""},3000);
        }
        
    }

    async function createUser(){

        let user=document.getElementById("createUsername").value;
        let pass=document.getElementById("createPassword").value;

        if(user.length > 0 && isAlphaNumeric(user)){
            const data = {
                username: user,
                password: pass
            };
    
            let res=await axios.put(url+"/createUser",data);
    
            if(res.data.accessToken){
                localStorage.setItem('JWT',res.data.accessToken);
                loginCreatePost(user);
                closePopup(document.getElementById("createModalId"));
    
            }else{
                let error=document.getElementById("createError");
                error.innerHTML = "Error creating user. Username not avaliable";
                setTimeout(()=>{error.innerHTML=""},3000);
            }
        }else{ 
                let error=document.getElementById("createError");
                error.innerHTML = "No special characters or spaces allowed in username text";
                setTimeout(()=>{error.innerHTML=""},3000);
        }
    }

    function logoutPost(){
        logout();
    }

    let message;
    if(loggedIn){
        message=<div>Hello {loggedInUser} <button onClick={(e)=>logoutPost()}>Logout</button><div id={"tokenError"}></div></div>
    }else{
        message = <div>
            Please <button onClick={(e)=>loginPopup(e)}>login</button> or <button onClick={(e)=>createPopup(e)}>create an account</button> to add bookmarks!
        </div>
    }

    let loginModal=
        <div id={"loginModalId"} className={"loginModalClass"} onClick={(e)=>getOutsideClick(e)} style={modalStyle}>
            <div className={"loginModalContent"} style={modalContentStyle}>
            <span className={"loginModalCloseClass"} style={modalCloseStyle}>&times;</span>
            Login Form<br></br>
            <form className={"modalLoginForm"}>
            Username:<input id={"loginUsername"} name="usernamer"></input>
            <br></br>
            Password:<input id={"loginPassword"} name="password" type="password"></input>
            <br></br>
            <button onClick={(e)=>login()}>Login</button>
            <div style={errorStyle} id={"loginError"}></div>
            </form>
            </div>
        </div>
    let createModal=
        <div id={"createModalId"} className={"createModalClass"} onClick={(e)=>getOutsideClick(e)} style={modalStyle}>
            <div className={"createModalContent"} style={modalContentStyle}>
            <span className={"createModalCloseClass"} style={modalCloseStyle}>&times;</span>
            Create Form<br></br>
            <form className={"modalLoginForm"}>
            Username:<input id={"createUsername"} name="username"></input>
            <br></br>
            Password:<input id={"createPassword"} name="password" type="password"></input>
            <br></br>
            <button onClick={(e)=>createUser()}>Create user</button>
            <div style={errorStyle} id={"createError"}></div>
            </form>
            </div>
        </div>;

    return(
        <div>
            {message}
            {loginModal}
            {createModal}
        </div>
    );
}

export default LoginView;