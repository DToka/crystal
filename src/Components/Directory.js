import React, {useState, useEffect} from 'react'
import Bookmark from './Bookmark'
import AddElementButton from './AddElementButton';
import RemoveElementButton from './RemoveElementButton';
import {isExpired, decodeToken} from "react-jwt";
const axios = require('axios');
const {url} =  require('../conf.js');

const Directory = ({owner, name, parent, parentReRender, logout}) => {

    let bookmarks=[];
    let dirs=[];
    let currentPath=parent+name+"/";
    let [path,setPath] = useState(parent+name+"/");

    if(currentPath!==path){
        setPath(currentPath);
        getContent(currentPath);
    }

    let [expanded, setExpanded]=useState(false);
    let [bookMarks, setBookMarks]=useState([]);
    let [directories, setDirectories]=useState([]);

    useEffect(()=>{
        if(path==="/" || path==="/"+name+"/"){
            setExpanded(true);
            getContent(path);
        }else{
            setExpanded(false);
        }
    },[]);
    
    async function getContent(path){
        dirs=[];
        bookmarks=[];
        const response = await axios.get(url+path);
        for(var objectNum in response.data){
            if(response.data[objectNum].parent){
                dirs.push(response.data[objectNum]);
            }else if(response.data[objectNum].directory){
                bookmarks.push(response.data[objectNum]);
            }
        }
        setDirectories(dirs);
        setBookMarks(bookmarks);
    }

    function toggleFolder(e){
        e.preventDefault();
        getContent(path);
        setExpanded(!expanded);
    }

    let buttons;
    let rmButton=false;
    let token=localStorage.getItem('JWT');

    if(token){
        let decoded=decodeToken(token);
        let expired=isExpired(token);
        let testPath="/"+owner+"/";

        if(!expired && decoded.name===owner && testPath===path){
            buttons=<div className="directoryButtons"><AddElementButton path={path} getContent={getContent} logout={logout} bookmarks={bookMarks} directories={directories} name={name} /></div>
            rmButton=true;
        }else if(!expired && decoded.name===owner){
            buttons=<div className="directoryButtons"><AddElementButton path={path} getContent={getContent} logout={logout} bookmarks={bookMarks} directories={directories} name={name}/><RemoveElementButton path={path} getContent={parentReRender} parent={parent} logout={logout} name={name} />
            </div>
            rmButton=true;
        }
    }

    if(expanded){
        return(
            <div className="Directory" >
                <div>{name}<div className="directoryButtons"><button className="directoryButtons"  onClick={(e)=>toggleFolder(e)}>Close</button></div><div className="directoryButtons">{buttons}</div></div>
                
                <ul className="list">
                {
                    directories.map(directory=><li key={path+directory.name}><Directory owner={owner}  name={directory.name} parent={directory.parent} parentReRender={getContent} logout={logout} /></li>)
                    
                }
                {
                    bookMarks.map(bookmark=><li key={path+bookmark.title}><Bookmark owner={owner} getContent={getContent} title={bookmark.title} link={bookmark.link} author={bookmark.author} directory={bookmark.directory} path={path} logout={logout} removeButton={rmButton} /></li>)
                }
                </ul>
            </div>
        )
    }else{
        return(
            <div className="Directory">
                {name}<div className="directoryButtons"><button className="directoryButtons" onClick={(e)=>toggleFolder(e)}>Open</button></div>
            </div>
        )
    }
}

export default Directory;