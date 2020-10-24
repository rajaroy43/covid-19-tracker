import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";
import numeral from 'numeral';
import "./LineGraph.css"
const options = {
    legend: {
        display: false,
      },
    elements: {
      point: {
        radius: 0,
      },
    },
    maintainAspectRatio: false,
    tooltips: {
      mode: "index",
      intersect: false,
      callbacks: {
        label: function (tooltipItem, data) {
          return numeral(tooltipItem.value).format("+0,0");
        },
      },
    },
    scales: {
      xAxes: [
        {
          type: "time",
          time: {
            format: "MM/DD/YY",
            tooltipFormat: "ll",
          },
        },
      ],
      yAxes: [
        {
          gridLines: {
            display: false,
          },
          ticks: {
            // Include a dollar sign in the ticks
            callback: function (value, index, values) {
              return numeral(value).format("0a");
            },
          },
        },
      ],
    },
  };
  const buildChartData = (data, casesType) => {
    let chartData = [];
    let lastDataPoint;
    for (let date in data[casesType]) {

      if (lastDataPoint) {
        let newDataPoint = {
          x: date,
          y: data[casesType][date] - lastDataPoint,
        };
        chartData.push(newDataPoint);
      }
      lastDataPoint = data[casesType][date];
    }
    return chartData;
  };
function LineGraph({casesType}) {
  const [data, setData] = useState({});
  // https://disease.sh/v3/covid-19/historical/all?lastdays=120
  useEffect(() => {
    const getLastDaysData = async () => {
     
        const resp = await axios({
          method: "GET",
          url: "https://disease.sh/v3/covid-19/historical/all?lastdays=120",
        });
        const chartData = buildChartData(resp.data,casesType);
        setData(chartData);
       
    };
    getLastDaysData();
  }, [casesType]);
  return (
    <div className="lineGraph">
      {data?.length > 0 && (
        <Line
          data={{
            datasets: [
              {
                backgroundColor: "rgba(204, 16, 52, 0.5)",
                borderColor: "#CC1034",
                data: data,
              },
            ],
          }}
          options={options}
        />
       )}
      
    </div>
  );
}

export default LineGraph;
