import React, { useState } from "react";
import { Card, Button, Form } from "react-bootstrap";

const questions = [
  "I feel happy most of the time.",
  "I have trouble sleeping.",
  "I feel stressed often.",
];

const MentalHealthQuiz = () => {
  const [answers, setAnswers] = useState(Array(questions.length).fill(0));
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index] = parseInt(value);
    setAnswers(newAnswers);
  };

  const handleSubmit = () => setSubmitted(true);

  return (
    <Card className="p-3 shadow-sm">
      {!submitted ? (
        <Form>
          {questions.map((q, i) => (
            <Form.Group key={i} className="mb-3">
              <Form.Label>{q}</Form.Label>
              <Form.Select onChange={(e) => handleChange(i, e.target.value)}>
                <option value="0">Select</option>
                <option value="1">Never</option>
                <option value="2">Sometimes</option>
                <option value="3">Often</option>
              </Form.Select>
            </Form.Group>
          ))}
          <Button onClick={handleSubmit}>Submit</Button>
        </Form>
      ) : (
        <h5>Your score: {answers.reduce((a, b) => a + b, 0)}</h5>
      )}
    </Card>
  );
};

export default MentalHealthQuiz;
