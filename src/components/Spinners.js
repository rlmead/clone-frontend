import React from "react";
import { Spinner } from "reactstrap";

function Spinners() {
    return (
        <div className="text-center">
            <Spinner type="grow" size="sm" color="success" className="m-2" />
            <Spinner type="grow" size="sm" color="info" className="m-2" />
            <Spinner type="grow" size="sm" color="warning" className="m-2" />
            <Spinner type="grow" size="sm" color="danger" className="m-2" />
        </div>
    )
}

export default Spinners;