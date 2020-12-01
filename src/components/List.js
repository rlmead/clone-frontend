import React, { useEffect, useState } from "react";
import { ListGroup, ListGroupItem, Row, Col } from 'reactstrap';
import { useHistory } from "react-router-dom";
import { useAuth } from "../utilities/AuthContext";
import { axiosCall } from "../utilities/axiosCall";

function List(props) {
  let history = useHistory();
  const { token } = useAuth();
  const [listData, setListData] = useState([]);

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
  }, [initialLoad])

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
      {/* dynamically render the list */}
      <ListGroup
        flush
        className='text-left'>
        {
          listData.map((item, index) => {
            return (
              <ListGroupItem
                style={{ cursor: "pointer" }}
                onClick={() => history.push(`/${props.type}/${item.id}`)}
                id={`listItem${index}`}>
                <Row>
                  <Col sm="2">
                    <img
                      className='img-fluid'
                      src={item.image_url || defaultImage}
                      alt="">
                    </img>
                  </Col>
                  <Col sm="10">
                    <h3>{item.name}</h3>
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