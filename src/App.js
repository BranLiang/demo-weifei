import React, { Component } from 'react';
import {
  Chart,
  Geom,
  Axis,
  Tooltip,
  Legend
} from "bizcharts";
import DataSet from "@antv/data-set";
import zhongqiData from './data/zhongqi'

const ds = new DataSet();
/* Source data */
ds.createView('zhongqi').source(zhongqiData)

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selected: 'zhongqi'
    }
  }

  render() {
    const { selected } = this.state
    const dv = ds.getView(selected)
    dv.transform({
      type: "fold",
      fields: ["electricity", "water"],
      key: "usage",
      // key字段
      value: "amount" // value字段
    })

    console.log(dv);

    return (
      <div>
        <Chart height={400} data={dv} forceFit>
          <Legend />
          <Axis name="year" />
          <Axis name="amount" />
          <Tooltip
            crosshairs={{
              type: "y"
            }}
          />
          <Geom
            type="line"
            position="year*amount"
            size={2}
            color={"usage"}
            shape={"smooth"}
          />
          <Geom
            type="point"
            position="year*amount"
            size={4}
            shape={"circle"}
            color={"usage"}
            style={{
              stroke: "#fff",
              lineWidth: 1
            }}
          />
        </Chart>
      </div>
    );
  }
}

export default App;
