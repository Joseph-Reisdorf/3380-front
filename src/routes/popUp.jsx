import React from "react";
import '../styles/popUp.css';

function Popup(props){
    const handleClose = () => {
        // Refresh the page
        window.location.reload();
    };

    return (props.trigger) ? (
        <div className="popup">
            <div className="popup-inner">
                <h3>New Milestone Achieved!</h3>
                <h3>Congratulations on reaching 5 follows</h3>
                <button className="close-btn" onClick={handleClose}>Close</button>
            </div>
        </div>
    ) : "";
}
export default Popup;
