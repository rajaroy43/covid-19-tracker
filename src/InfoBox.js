import React from "react";
import "./InfoBox.css";
function InfoBox({ active, title, isRed, cases, total, ...props }) {
  return (
    <div
      className={`infobox ${active && "infobox--selected "}${isRed &&'infoBox--red'}`}
      onClick={props.onClick}
    >
      <div className="infobox__title">
        <h4>{title}</h4>
      </div>

      <div className={`infobox__cases ${!isRed && "infobox__cases--green"}`}>{cases} </div>

      <div className="infobox__total">{total} Total</div>
    </div>
  );
}

export default InfoBox;
