import { Circle, Popup } from "react-leaflet";
import React from "react";
import numeral from "numeral";
export const sortData = (data) => {
  const sortedData = [...data];
  return sortedData.sort((a, b) => b.cases - a.cases);
};
const casesTypeColors = {
  cases: {
    hex: "#CC1034",
    multiplier: 800,
  },
  recovered: {
    hex: "#7dd71d",
    multiplier: 1200,
  },
  deaths: {
    hex: "#fb4443",
    multiplier: 2000,
  },
};
//Draw Circle on map
export const showDataOnMap = (data, caseType) =>
  data.map((country) => (
    <Circle
      center={[country.countryInfo.lat, country.countryInfo.long]}
      fillOpacity={0.4}
      color={casesTypeColors[caseType].hex}
      fillColor={casesTypeColors[caseType].hex}
      radius={Math.sqrt(
        country[caseType]) * casesTypeColors[caseType].multiplier
      }
    >

        <Popup>
            <div className="info-container">
                <div style={{backgroundImage:`url(${country.countryInfo.flag})`}} className="info-flag"></div>
                <div className="info-name">{country.country}</div>
                <div className="info-confirmed">Cases: {numeral(country.cases).format("0,0")}</div>
                <div className="info-recovered">Recovered: {numeral(country.recovered).format("0,0")}</div>
                <div className="info-deaths">Deaths :{numeral(country.deaths).format("0,0")}</div>
            </div>
        </Popup>
    </Circle>
  ));


  export const prettyPrintStat=(stat)=>stat?`+${numeral(stat).format("0.0a")}`:"+0";
  