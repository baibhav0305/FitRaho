/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import jwt from "jsonwebtoken";
import "bootstrap/dist/css/bootstrap.css";
import Table from "../Table";
import "./History.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const History = () => {
  const navigate = useNavigate();

  const [userData, setUserData] = useState([]);

  const fetchUserHistory = async () => {
    const response = await fetch("http://localhost:8000/api/history", {
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
    });
    const data = await response.json();
    if (data.status === "ok") {
      setUserData(data.data);
    } else {
      toast.error(data.error, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const user = jwt.decode(token);
      if (!user) {
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        fetchUserHistory();
      }
    } else {
      navigate("/login");
    }
  }, []);

  return (
    <div className="history container">
      <div className="topHead">
        <h2>History</h2>
        <button className="btn btn-success" onClick={fetchUserHistory}>
          Refresh
        </button>
      </div>
      <div>
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th scope="col">Date</th>
              <th scope="col">Biceps</th>
              <th scope="col">Triceps</th>
              <th scope="col">Squats</th>
              <th scope="col">Calories</th>
            </tr>
          </thead>
          <tbody>
            {userData.map((data) => {
              return <Table data={data} key={Math.random()} />;
            })}
          </tbody>
        </table>
      </div>
      <ToastContainer />
    </div>
  );
};

export default History;
