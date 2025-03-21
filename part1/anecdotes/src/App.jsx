import { useState } from "react";
import React from "react";

const Header = ({ text }) => {
  return <h2>{text}:</h2>;
};

const Button = ({ onClick, text }) => {
  return <button onClick={onClick}>{text}</button>;
};

const Display = ({ anecdote, vote }) => {
  return (
    <p>
      {anecdote} <br /> has {vote} votes
    </p>
  );
};
const Mostvote = ({ anecdotes, votes }) => {
  const maxVote = Math.max(...votes);
  if (maxVote === 0) {
    return <p>No votes given</p>;
  }
  const indexOfMax = votes.indexOf(maxVote);
  const anecdote = anecdotes[indexOfMax];

  return <Display anecdote={anecdote} vote={maxVote} />;
};

const App = () => {
  const anecdotes = [
    "If it hurts, do it more often.",
    "Adding manpower to a late software project makes it later!",
    "The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    "Premature optimization is the root of all evil.",
    "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
    "Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.",
    "The only way to go fast, is to go well.",
  ];
  const totalAnecdotes = anecdotes.length;

  const [selected, setSelected] = useState(0);
  const [votes, setVotes] = useState(new Array(totalAnecdotes).fill(0));

  const randomIndex = (max = totalAnecdotes) => Math.floor(Math.random() * max);

  const handleNextAnecdote = () => {
    const index = randomIndex();
    setSelected(index);
  };
  const handleVote = () => {
    const selectedIndex = selected;
    const copyVotes = [...votes];
    copyVotes[selectedIndex] += 1;
    setVotes(copyVotes);
  };

  return (
    <div>
      <Header text={"Anecdote of the day"} />
      <Display anecdote={anecdotes[selected]} vote={votes[selected]} />
      <Button onClick={handleVote} text={"Vote"} />
      <Button onClick={handleNextAnecdote} text={"Next anecdote"} />
      <Header text={"Anecdote with most votes"} />
      <Mostvote anecdotes={anecdotes} votes={votes} />
    </div>
  );
};

export default App;
