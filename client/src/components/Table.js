import React from "react";

const Table = (props) => {
  let temp = "";
  for (let i = 4; i < 15; i++) {
    temp = temp + props.data.date[i];
  }
  return (
    <tr className="container">
      <th scope="row">{temp}</th>
      <td>{props.data.biceps}</td>
      <td>{props.data.triceps}</td>
      <td>{props.data.squats}</td>
      <td>{props.data.calories}</td>
    </tr>
  );
};

export default Table;
