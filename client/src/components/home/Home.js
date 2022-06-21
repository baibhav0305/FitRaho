import React from "react";
import "./Home.css";
import "bootstrap/dist/css/bootstrap.css";
import Card from "./Card";

const Home = () => {
  return (
    <div className="container home">
      <Card exercise="biceps" imgUrl="./bicep.gif" calorie="1" />
      <Card exercise="triceps" imgUrl="./tricep.gif" calorie="1" />
      <Card exercise="pushups" imgUrl="./pushup.gif" calorie="2" />
    </div>
  );
};

export default Home;
