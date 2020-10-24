import { FormControl, MenuItem, Select } from "@material-ui/core";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Table from "./Table";
import "./App.css";
import InfoBox from "./InfoBox";
import Map from "./Map";
import { sortData } from "./utils";
import LineGraph from "./LineGraph";
import "leaflet/dist/leaflet.css";
import { prettyPrintStat } from "./utils";
function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, SetTableData] = useState([]);
  const [mapCenter, setMapcenter] = useState({ lat: 27.0238, lng: 78.9629 });
  const [mapZoom, setmapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");
  useEffect(() => {
    const getCountriesData = async () => {
      try {
        const resp = await axios({
          method: "GET",
          url: "https://disease.sh/v3/covid-19/countries",
        });
        const countries = resp.data.map((country) => ({
          name: country.country,
          value: country.countryInfo.iso3,
        }));
        const liveCase = sortData(resp.data);
        SetTableData(liveCase);
        setCountries(countries);
        const worldwideData = await axios.get(
          "https://disease.sh/v3/covid-19/all"
        );
        setCountryInfo(worldwideData.data);
        setMapCountries(resp.data);
      } catch (error) {
        alert("cant get Covid data at this time ");
      }
    };
    getCountriesData();
  }, []);
  const onCountryChange = async (e) => {
    const countryCode = e.target.value;
    setCountry(countryCode);
    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    try {
      const resp = await axios.get(url);
      setCountryInfo(resp.data);
      if(countryCode!=="worldwide"){
        setMapcenter([resp.data.countryInfo.lat, resp.data.countryInfo.long]);
        setmapZoom(4);
      }
      else{
        setMapcenter({ lat: 27.0238, lng: 78.9629 });
        setmapZoom(3);
      }
     
    } catch (error) {
      alert("cant get Covid data at this time ....");
    }
  };
  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>COVID-19 TRACKER</h1>
          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              value={country}
              onChange={onCountryChange}
            >
              <MenuItem value="worldwide">WorldWide</MenuItem>
              {countries.map((country) => (
                <MenuItem value={country.value} key={country.value}>
                  {country.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="app__stats">
          <InfoBox
          isRed
            active={casesType === "cases"}
            onClick={(e) => setCasesType("cases")}
            title="Coronavirus Cases"
            cases={prettyPrintStat(countryInfo.todayCases)}
            total={prettyPrintStat(countryInfo.cases)}
          />
          <InfoBox
            active={casesType === "recovered"}
            onClick={(e) => setCasesType("recovered")}
            title="Recovered"
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={prettyPrintStat(countryInfo.recovered)}
          />
          <InfoBox
          isRed
            active={casesType === "deaths"}
            onClick={(e) => setCasesType("deaths")}
            title="Deaths"
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            total={prettyPrintStat(countryInfo.deaths)}
          />
        </div>
        <Map
          center={mapCenter}
          zoom={mapZoom}
          countries={mapCountries}
          casesType={casesType}
        />
      </div>
      <div className="app__right">
        <h3 className="app__rightLiveCase">Live Cases By Country</h3>
        <Table countries={tableData} />
        <h3>Worldwide new {casesType}</h3>
        {/* LineGraph */}
        <LineGraph casesType={casesType} />
      </div>
    </div>
  );
}

export default App;
