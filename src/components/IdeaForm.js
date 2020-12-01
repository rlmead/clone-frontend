import React from "react";
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';

function IdeaForm() {
  return (
    <>
      <h3>Add a new idea</h3>
      <Form className="text-left">
        <FormGroup>
          <Label>Name</Label>
          <Input placeholder="Name your idea" />
        </FormGroup>
        <FormGroup>
          <Label>Description</Label>
          <Input placeholder="Describe your idea"></Input>
        </FormGroup>
      </Form>
      <Button className="btn-success">+</Button>
    </>
  )
}

export default IdeaForm;