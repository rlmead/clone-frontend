import React, { useEffect, useState } from "react";
import { ListGroup, ListGroupItem, Row, Col } from 'reactstrap';
import { useHistory, useParams } from "react-router-dom";
import { useAuth } from "../utilities/AuthContext";
import { axiosCall } from "../utilities/axiosCall";

function List(props) {
  let history = useHistory();
  const { token } = useAuth();
  const [listData, setListData] = useState([]);

  let { locationString } = useParams();

  let profileList =
    (props.route === "/users/get_creations"
      || props.route === "/users/get_collaborations");

  let initialLoad = false;

  async function getList() {
    let response = await axiosCall(
      profileList ? "post" : "get",
      locationString ? props.route + "/" + locationString : props.route,
      parseListData,
      props.data || {},
      {
        "Accept": "application/json",
        "Content-Type": "application/json; charset=utf-8",
        "Access-Control-Allow-Origin": "*",
        "Authorization": `Bearer ${token}`
      }
    );
    return response;
  }

  function parseListData(input) {
    let output = profileList
      ? input.map(item => item.idea)
      : input;
    setListData(output);
  }

  useEffect(() => {
    getList();
    initialLoad = true;
  }, [initialLoad, props.type])

  let defaultImage;
  switch (props.type) {
    case "ideas":
      defaultImage = "https://images.unsplash.com/photo-1529310399831-ed472b81d589?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=634&q=80";
      break;
    case "users":
      defaultImage = "https://images.unsplash.com/photo-1490059830487-2f86fddb2b4b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80";
      break;
  }

  return (
    <>
      {
        locationString &&
        <h3>Ideas in {locationString.split("-").join(", ")}</h3>
      }
      <ListGroup
        flush
        className='text-left'>
        {
          listData.map((item, index) => {
            return (
              <ListGroupItem
                className={item.status === "closed" ? "bg-secondary" : ""}
                style={{ cursor: "pointer" }}
                onClick={() => {
                  props.type === "locations"
                    ? history.push(`/locations/${item.city}-${item.state}-${item.country_code}`)
                    : history.push(`/${props.type}/${item.id}`)
                }}
                key={`listItem-${index}`}>
                <Row>
                  {
                    props.type !== "locations" &&
                    <Col sm="2">
                      <img
                        className='img-fluid'
                        src={item.image_url || defaultImage}
                        alt="">
                      </img>
                    </Col>
                  }
                  <Col sm="10">
                    <h3>
                      {
                        props.type === "locations"
                          ? `${item.country_code}, ${item.state}, ${item.city}`
                          : item.name
                      }
                    </h3>
                  </Col>
                </Row>
              </ListGroupItem>
            )
          })
        }
      </ListGroup>
    </>
  )
}

export default List;