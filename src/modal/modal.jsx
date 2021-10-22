import './modal.css';

const Modal = ({ data, handleClose, show, children }) => {
    const showHideClassName = show ? "modal display-block" : "modal display-none";
    console.log("data", data)
    return (
        <div className={showHideClassName}>
            {/* <p>{JSON.stringify(data)}</p> */}
            <section className="modal-main">
                <div className ="para" style={{height: "unset"}}>{children}</div>
                <button type="button" onClick={handleClose} style={{backgroundColor: '#272822', paddingTop: '10px', paddingBottom: '10px', color: "white"}}>
                    Close
                </button>
            </section>
        </div>
    );
};

export { Modal }