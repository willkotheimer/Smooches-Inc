import React from "react";

export default class Modal extends React.Component {
    render() {
        return (
            <>
            <div className="confirmModal">
            <div className="confirm-message">
            Thank you for your order!
            </div>
            <div className="confirm-description">
            Please be patient...
your order is being processed!
            </div>
            </div>
            </>
        )
    }
}