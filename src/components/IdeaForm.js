import React, { useState } from "react";
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { useAuth } from "../utilities/AuthContext";
import { axiosCall } from "../utilities/axiosCall";

function IdeaForm() {
  const auth = useAuth();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  async function createIdea() {
    let response = await axiosCall(
      "post",
      "/ideas/create",
      console.log,
      {
        name,
        description,
        status: "open"
      },
      {
        "Accept": "application/json",
        "Content-Type": "application/json; charset=utf-8",
        "Access-Control-Allow-Origin": "*",
        "Authorization": `Bearer ${auth.token}`
      }
    );
    return response;
  }

  return (
    <>
      <h3>Add a new idea</h3>
      <Form className="text-left">
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
      <Button className="btn-success" onClick={() => createIdea()}>+</Button>
    </>
  )
}

export default IdeaForm;