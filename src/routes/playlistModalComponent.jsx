import '../styles/Modal.css'; // Importing styles for the modal

const PlaylistModal = ({ show, onClose, onSubmit, children }) => {
    if (!show) {
        return null;
    }

    return (
        <div className="modal" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h4 className="modal-title">Add Track to Playlist</h4>
                </div>
                <div className="modal-body">
                    {children}
                    

                </div>
                <div className="modal-footer">
                    <button onClick={onSubmit} className="button">
                        Submit
                    </button>
                    <button onClick={onClose} className="button">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PlaylistModal;