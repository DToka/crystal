import React, {useState} from 'react'
import ReactDOM from 'react-dom';
import {isExpired, decodeToken} from "react-jwt";
const axios = require('axios');
const {url} =  require('../conf.js');
const {isAlphaNumeric} = require('../utils.js');

const AddElementButton = ({path, getContent, logout, bookmarks, directories, name})=>{

    //Unique className/id for each AddElementModal
    const uniqueModalID = "addModalID"+path;
    const uniqueModalClass = "addModal"+path;
    const uniqueModalContentClass = "addModal-content"+path;
    const uniqueModalCloseClass = "addModal-close"+path;
    //bookmark textbox IDs
    const titleID = "addTitle"+path;
    const linkID = "addLink"+path;
    //directory textbox IDs
    const nameID = "addName"+path;

    let [type,setType]=useState("bookmark");
    let token=localStorage.getItem('JWT');

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

    const addErrorModal={
        fontWeight: "bold",
        fontSize: "20px",
        color:"red"
    };

    function addElementPopup(e){
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

    async function addElement(e){
        e.preventDefault();
        if(type==="bookmark"){
            let title = document.getElementById(titleID);
            let link = document.getElementById(linkID);
            let directory = path;

            let titles = bookmarks.map(bm => bm.title);

            if(titles.includes(title.value)){
                let message=document.getElementById("addError");
                message.innerHTML = "Cannot have duplicates";
                setTimeout(()=>{message.innerHTML=""},3000);
            }else{
                let decoded = decodeToken(token);
                if(title.value.length>0 && title.value.length<20 && link.value.length>0 && link.value.length<100 && isAlphaNumeric(title.value) && !title.value.includes(`javascript:`) && !title.value.includes(`<script`) && !title.value.includes(`<img`) && 
                !link.value.includes(`javascript:`) && !link.value.includes(`<script`) && !link.value.includes(`<img`)){
                    const data={
                        link: link.value,
                        title: title.value,
                        author: decoded.name,
                        directory: directory
                    };
                    sendData(data);
                }else{
                    let message=document.getElementById("addError");
                    message.innerHTML = "Please only use alphanumeric character with no spaces for titles. Keep the title length below 20 characters and link length below 100.";
                    setTimeout(()=>{message.innerHTML=""},3000);
                }
            }
        }else if(type==="directory"){

            let name = document.getElementById(nameID);
            let parent = path;
            let dirs = directories.map(dir => dir.name);

            if(dirs.includes(name.value)){
                let message=document.getElementById("addError");
                message.innerHTML = "Cannot have duplicate directories";
                setTimeout(()=>{message.innerHTML=""},3000);
            }else{
                if(name.value.length>0 && name.value.length<20 && isAlphaNumeric(name.value) && !name.value.includes(`javascript:`) && !name.value.includes(`<script`) && !name.value.includes(`<imng`)){
                    const data = {
                        name: name.value,
                        parent: parent
                    };
                    sendData(data);
                }else{
                    let message=document.getElementById("addError");
                    message.innerHTML = "Please only use alphanumeric character with no spaces for directories. Keep length below 20 characters";
                    setTimeout(()=>{message.innerHTML=""},3000);
                }
            }
        }        
    }

    async function sendData(data){
        if(isExpired(token)){
            logout();
        }else{
            await axios.put(url+path,data,
                {headers: {
                    'authorization': `token ${token}`
                  }})
            .then(res=>{
                closePopup();
                getContent(path);
            })
            .catch(error=>{
                console.log(error)
                let message=document.getElementById("addError");
                message.innerHTML = error;
                setTimeout(()=>{message.innerHTML=""},3000);
            });
        }
    }

    let modalPopup;
    let addSwitcher = <div className="modalElementForm">Select what you would like to add<button onClick={(e)=>setType("bookmark")}>Bookmark</button>
    <button onClick={(e)=>setType("directory")}>Directory</button></div>

    if(type==="bookmark"){
        modalPopup=<div id={uniqueModalID} className={uniqueModalClass} onClick={(e)=>getClick(e)} style={modalStyle}>
                         <div className={uniqueModalContentClass} style={modalContentStyle}>
                             <span className={uniqueModalCloseClass} style={modalCloseStyle}>&times;</span>
                             {addSwitcher}
                             <form className="modalElementForm">
                             <p className="modalElementForm">Add bookmark to {name}</p>
                             Title:<input id={titleID}></input>
                             Link:<input id={linkID}></input>
                             <button onClick={(e)=>addElement(e)}>Add bookmark to {name}</button>
                             <div style={addErrorModal} id={"addError"}></div>
                             </form>
                         </div>
                     </div>;
    }else if(type==="directory"){
        modalPopup= <div id={uniqueModalID} className={uniqueModalClass} onClick={(e)=>getClick(e)} style={modalStyle}>
                         <div className={uniqueModalContentClass} style={modalContentStyle}>
                             <span className={uniqueModalCloseClass} style={modalCloseStyle}>&times;</span>
                             {addSwitcher}
                             <form className="modalElementForm">
                             <p className="modalElementForm">Add directory to {name}</p>
                             Name:<input id={nameID}></input>
                             <button onClick={(e)=>addElement(e)}>Add directory to {name}</button>
                             <div style={addErrorModal} id={"addError"}></div>
                             </form>
                         </div>
                     </div>
    }
    return(
        <div className="directoryButtons">
            <button className="addButton directoryButtons" onClick={(e)=>addElementPopup(e)}>+</button>
            {modalPopup}
         </div>
    )
}

export default AddElementButton;

