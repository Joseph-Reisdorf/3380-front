import React from "react";
import '../styles/popUp.css';

function PopUp({ show, close, message, children }) {
  // Directly return null if `show` is false
  if (!show) {
    return null;
  }

  // Correct JSX structure and handling for showing the popup
  return (
    <div className="popup">
      <div className="popup-inner">
        <h3>New Milestone Achieved!</h3>
        <h3>{message}</h3>
        <button className="close-btn" onClick={close}>Close</button>
      </div>
      {children}
    </div>
  );
}

export default PopUp;
