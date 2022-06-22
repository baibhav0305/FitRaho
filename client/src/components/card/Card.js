import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "./Card.scss";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Card = ({ exercise, imgUrl, calorie }) => {
  const [count, setCount] = useState(0);

  const pythonScript = async () => {
    const response = await fetch(
      `https://fit-raho.herokuapp.com/api/exercise/${exercise}`
    );
    console.log(response);
    const data = await response.json();
    console.log(data);
    setCount(parseInt(data.count));
  };

  const saveToDatabase = async () => {
    const response = await fetch(
      `https://fit-raho.herokuapp.com/api/exercise`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({ count, exercise }),
      }
    );
    const data = await response.json();
    console.log(data);
    if (data.status === "ok") {
      toast.success("Data Saved Successfully!", {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setCount(0);
    } else {
      toast.error("Error!", {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <div className="container card">
      <h2>{exercise.toUpperCase()}</h2>
      <img src={imgUrl} alt="gif" height="160px" />
      <div className="calorieDetail">
        Calories burnt: {calorie}/{exercise}
      </div>
      <button className="btn btn-success" onClick={pythonScript}>
        Start
      </button>
      <p className="count"> Count: {count}</p>
      <button
        className="btn btn-primary save"
        onClick={saveToDatabase}
        disabled={!count}
      >
        Save
      </button>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default Card;
