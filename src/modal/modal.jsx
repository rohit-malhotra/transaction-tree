import './modal.css';

const Modal = ({ data, handleClose, show, children }) => {
    const showHideClassName = show ? "modal display-block" : "modal display-none";
    console.log("data", data)
    return (
        <div className={showHideClassName}>
            {/* <p>{JSON.stringify(data)}</p> */}
            <section className="modal-main">
                <div className ="para">{children}</div>
                <button type="button" onClick={handleClose}>
                    Close
        </button>
            </section>
        </div>
    );
};

export { Modal }