import React from "react";

const HistoryItemShimmer = () => {
    return (
        <div className="product-items d-flex flex-row shimmer">
            <span className="my-auto mr-3">
                <i className="fi fi-sr-receipt headline4 animate"></i>
            </span>
            <div className="d-flex flex-fill flex-column my-auto">
                <p className="bodytext1 max-line-2 semibold m-0 w-50 animate">TRX-00000</p>
                <p className="caption max-line-2 mt-2 mx-0 my-0 w-25 animate">Meja 0000</p>
            </div>
            <i className="fi fi-sr-angle-right bodytext2 my-auto animate"></i>
        </div>
    );
}

export default HistoryItemShimmer;