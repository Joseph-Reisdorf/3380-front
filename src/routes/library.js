import React, {useEffect, useState} from "react";
import { Link } from "react-router-dom";

function Library(){
    useEffect( () => {
        fetchItem();
    }, []);
    
    const [items, setItems] = useState([]);

    const fetchItem = async() =>{
        const data = await fetch('http://localhost:8080/library');
        const items = await data.json();
        setItems(items);
    };  
    return(
        <section>
        {
            items.map(item => (
                <div> 
                    <p>Page: {item.page}</p>
                    <p>Message: {item.msg}</p>
                    <p>Username: {item.username}</p>
                </div>
            ))  
        }
        </section>
    );
}

export default Library;