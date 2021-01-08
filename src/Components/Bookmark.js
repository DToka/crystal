import React from 'react'
import RemoveElementButton from './RemoveElementButton';

const Bookmark = ({owner, title, link, author, directory, getContent, path, logout, removeButton})=>{
    let button;

    function goToSite(e){
        e.preventDefault();
        window.open(link);
    }

    if(removeButton){
      button=<div className="bookmarkButton"><RemoveElementButton title={title} path={path} getContent={getContent} logout={logout} /></div>
    }

    return(
        <div className="Bookmark">

            <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            >
               {title}
            </a>

        {button}
        </div>
    )
}

export default Bookmark;