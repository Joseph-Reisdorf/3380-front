import React, {useEffect, useState} from "react";
import { Link } from "react-router-dom";

function Recents(){
    useEffect( () => {
        fetchItem();
    }, []);
    
    const [items, setItems] = useState([]);

    const fetchItem = async() =>{
        const data = await fetch('http://localhost:8080/recents');
        const items = await data.json();
        setItems(items);
    };
    
    return(
    
        <section>
        {
            items.map(item => (
                <div> 
                    <p>Name: {item.name}</p>
                    <p>Message: {item.msg}</p>
                    <p>Username: {item.username}</p>
                </div>
            ))  
        }
        </section>

    );
}

export default Recents;