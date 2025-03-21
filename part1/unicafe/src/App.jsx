import { useState } from "react";
import React from "react";

const Header = ({ text }) => {
  return <h2>{text}:</h2>;
};

const Button = ({ onClick, text }) => {
  return <button onClick={onClick}>{text}</button>;
};

const StatisticLine = ({ text, value }) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  );
};

const Statistics = ({ good, neutral, bad }) => {
  const total = good + neutral + bad;
  const avarage = (good - bad) / total;

  if (!total)
    return (
      <div>
        <h2>Statistics: </h2>
        <p>No Feedback Given!</p>
      </div>
    );
  return (
    <div>
      <Header text={"Statistics"} />
      <table>
        <tbody>
          <StatisticLine text={"Good"} value={good} />
          <StatisticLine text={"Neutral"} value={neutral} />
          <StatisticLine text={"Bad"} value={bad} />
          <StatisticLine text={"Total Reviews"} value={total} />
          <StatisticLine text={"Avarage"} value={avarage} />
          <StatisticLine
            text={"Positive Review(%)"}
            value={(good / total) * 100}
          />
        </tbody>
      </table>
    </div>
  );
};

const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const handleGoodReview = () => {
    const newGood = good + 1;
    setGood(newGood);
  };
  const handleNeutralReview = () => {
    const newNeutral = neutral + 1;
    setNeutral(newNeutral);
  };
  const handleBadReview = () => {
    const newBad = bad + 1;
    setBad(newBad);
  };

  return (
    <div>
      <Header text={"Give Feedback"} />
      <Button onClick={handleGoodReview} text={"Good"} />
      <Button onClick={handleNeutralReview} text={"Nuetral"} />
      <Button onClick={handleBadReview} text={"Bad"} />
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  );
};

export default App;
