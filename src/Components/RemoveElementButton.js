import React from 'react'
import ReactDOM from 'react-dom';
import {isExpired} from "react-jwt";
const axios = require('axios');
const {url} =  require('../conf.js');

const RemoveElementButton = ({path, getContent, title, parent, logout, name}) => {

    const uniqueModalID = "delModalID"+path+title;
    const uniqueModalClass = "delModal"+path+title;
    const uniqueModalContentClass = "delModal-content"+path+title;
    const uniqueModalCloseClass = "delModal-close"+path+title;

    const modalStyle={
        display: "none", /* Hidden by default */
        position: "fixed", /* Stay in place */
        paddingTop: "100px", /* Location of the box */
        left: 0,
        top: 0,
        width: "100%", /* Full width */
        height: "100%", /* Full height */
        overflow: "auto", /* Enable scroll if needed */
        backgroundColor: "rgba(0,0,0,0.4)" /* Fallback color */
    };

    const modalContentStyle={
        backgroundColor: "rgb(150,150,150)",
        margin: "auto",
        padding: "20px",
        border: "10px solid #888",
        width: "80%"
    };

    const modalCloseStyle={
        backgroundColor: "rgb(150,150,150)",
        color: "white",
        float: "right",
        fontSize: "28px",
        fontWeight: "bold"
    };

    function removeElementPopup(e){
        e.preventDefault();
        let element = document.getElementById(uniqueModalID)
        ReactDOM.findDOMNode(element).style.display = "block";
    }

    function getClick(e){
        e.preventDefault();
        let classListName=e.target.classList[0];
        if(classListName === uniqueModalClass || classListName === uniqueModalCloseClass){
            closePopup();
        }
    }

    function closePopup(){
        let element = document.getElementById(uniqueModalID)
        ReactDOM.findDOMNode(element).style.display = "none";
    }

    async function removePath(e){
        e.preventDefault();
        let token=localStorage.getItem('JWT');
        let deletePath;
        if(isExpired(token)){
            logout();
        }else{
            if(title){
                deletePath=url+path+title;                  
            }else{
                deletePath=url+path;
            }
            await axios.delete(deletePath,{
                    headers: {
                      'authorization': `token ${token}`
                    }})
                    .then(response=>{
                        closeAndReRender();
                    })
                    .catch(error=>{
                        console.log(error);
                        let message=document.getElementById("delError");
                        message.innerHTML = error;
                        setTimeout(()=>{message.innerHTML=""},3000);
                    });
        }  
    }

    function closeAndReRender(){
        closePopup();
        if(parent){
            getContent(parent);
        }else{
            getContent(path);
        }
    }

    return(
        <div className="directoryButtons">
            <button className="removeButton directoryButtons" onClick={(e)=>removeElementPopup(e)}>-</button>
            <div id={uniqueModalID} className={uniqueModalClass} onClick={(e)=>getClick(e)} style={modalStyle}>
            <div className={uniqueModalContentClass} style={modalContentStyle}>
                        <span className={uniqueModalCloseClass} style={modalCloseStyle}>&times;</span>
                        <form className="modalElementForm">
                        <p className="modalElementForm">Remove {name}{title} and any potential children?</p>
                        <button onClick={(e)=>removePath(e)}>Yes</button>
                        <div id="delError"></div>
                        </form>
                    </div>
            </div>
        </div>
    )
}

export default RemoveElementButton;