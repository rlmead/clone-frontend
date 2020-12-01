import React, { useEffect, useState } from "react";
import { useAuth } from "../utilities/AuthContext";
import { axiosCall } from "../utilities/axiosCall";

function List(props) {
    const { token } = useAuth();
    const [ listData, setListData ] = useState([]);

    let initialLoad = false;

    // do axios call to get list data
    async function getList() {
        let response = await axiosCall(
            "get",
            `/${props.type}`,
            setListData,
            {},
            {
                "Accept": "application/json",
                "Content-Type": "application/json; charset=utf-8",
                "Access-Control-Allow-Origin": "*",
                "Authorization": `Bearer ${token}`
            }
        );
        return response;
    }

    useEffect(() => {
        getList();
        initialLoad = true;
    }, [ initialLoad ])

    let default_image;
    switch (props.type) {
        case "ideas":
            default_image = "https://images.unsplash.com/photo-1529310399831-ed472b81d589?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=634&q=80";
            break;
        case "users":
            default_image = "https://images.unsplash.com/photo-1490059830487-2f86fddb2b4b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80";
            break;
    }

    return (
        <>
            {/* dynamically render the list */}
            <p>here is a list of {props.type}</p>
            <img src={default_image}></img>
        </>
    )
}

export default List;