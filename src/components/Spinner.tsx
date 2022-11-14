import React from "react";
const Spinner = React.memo(() => {
    return (
        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
    );
})
export default Spinner;