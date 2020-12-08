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
      defaultImage = "https://images.unsplash.com/photo-1579548122080-c35fd6820ecb?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80";
      break;
    case "users":
      defaultImage = "https://images.unsplash.com/photo-1589030343991-69ea1433b941?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80";
      break;
  }

  return (
    <>
      {
        locationString &&
        <h3 className="text-left">Ideas in {locationString.split("-").join(", ")}</h3>
      }
      { listData.length > 0
        ?
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
                    <Col sm="8" className="offset-sm-1">
                      <h3>
                        {
                          props.type === "locations"
                            ? `${item.country_code}, ${item.state}, ${item.city}`
                            : item.name
                        }
                      </h3>
                    </Col>
                    {
                      props.type !== "locations" &&
                      <Col sm="2">
                        <img
                          className='img-fluid rounded'
                          src={item.image_url || defaultImage}
                          alt="">
                        </img>
                      </Col>
                    }
                  </Row>
                </ListGroupItem>
              )
            })
          }
        </ListGroup>
        :
        <h3 className="text-left">Loading...</h3>
      }
    </>
  )
}

export default List;