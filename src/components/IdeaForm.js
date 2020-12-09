import React, { useEffect, useState } from "react";
import { Button, Form, FormGroup, Label, Input, Nav, Row, Col } from 'reactstrap';
import { useHistory } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useApp } from "../utilities/AppContext";
import { useAuth } from "../utilities/AuthContext";
import { axiosCall } from "../utilities/axiosCall";
import Footer from "./Footer";

function IdeaForm() {
  const { user } = useApp();
  const { token } = useAuth();

  let history = useHistory();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [id, setId] = useState("");

  function getIdeaId(input) {
    setId(input.data.id);
  }

  let defaultImages = [
    "https://images.unsplash.com/photo-1579548122080-c35fd6820ecb?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    "https://images.unsplash.com/photo-1579547945413-497e1b99dac0?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    "https://images.unsplash.com/photo-1579547945332-937d6d70dfb5?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    "https://images.unsplash.com/photo-1579547945156-1f19a38202b5?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    "https://images.unsplash.com/photo-1579547621706-1a9c79d5c9f1?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    "https://images.unsplash.com/photo-1579547621869-0ddb5f237392?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    "https://images.unsplash.com/photo-1579547621809-ef17e331add2?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    "https://images.unsplash.com/photo-1579546929556-bf8352f5889c?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  ]

  async function createIdea() {
    let response = await axiosCall(
      "post",
      "/ideas/create",
      getIdeaId,
      {
        name,
        description,
        status: "open",
        user: user.id,
        image_url: defaultImages[Math.floor(Math.random() * defaultImages.length)]
      },
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
    id && history.push(`/ideas/${id}`);
  }, [id])


  return (
    <div className="text-center">
      <Form className="text-left p-4">
        <FormGroup>
          <Label>Name</Label>
          <Input
            maxLength={255}
            placeholder="Name your idea"
            onChange={(e) => setName(e.target.value)}
          />
        </FormGroup>
        <FormGroup>
          <Label>Description</Label>
          <textarea
            style={{ width: "100%" }}
            className="form-control"
            placeholder="Describe your idea"
            onChange={(e) => setDescription(e.target.value)}
          />
        </FormGroup>
      </Form>
      <FontAwesomeIcon
        icon={faPlus}
        style={{ cursor: "pointer" }}
        size="2x"
        className="text-success"
        onClick={() => createIdea()}
      />
      <Footer text="Add a new idea" />
    </div>
  )
}

export default IdeaForm;