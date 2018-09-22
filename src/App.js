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
import { Wrapper, ChartTitle } from './styles'

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
      type: 'map',
      callback(row) {
        row.wasteDivideElectricity = row.waste / row.electricity
        row.wasteDivideWater = row.waste / row.water
        row.wasteDivieAll = row.waste / (row.electricity + row.water)
        return row
      }
    })

    console.log(dv);

    return (
      <Wrapper>
        <Chart height={400} data={dv} forceFit>
          <ChartTitle>电使用量</ChartTitle>
          <Legend />
          <Axis name="year" />
          <Axis name="electricity" />
          <Tooltip
            crosshairs={{
              type: "y"
            }}
          />
          <Geom
            type="interval"
            position="year*electricity"
            color={['year', '#36B37E']}
          />
        </Chart>

        <Chart height={400} data={dv} forceFit>
          <ChartTitle>水使用量</ChartTitle>
          <Legend />
          <Axis name="year" />
          <Axis name="water" />
          <Tooltip
            crosshairs={{
              type: "y"
            }}
          />
          <Geom
            type="interval"
            position="year*water"
            color={['year', '#172B4D']}
          />
        </Chart>

        <Chart height={400} data={dv} forceFit>
          <ChartTitle>危险废物量</ChartTitle>
          <Legend />
          <Axis name="year" />
          <Axis name="waste" />
          <Tooltip
            crosshairs={{
              type: "y"
            }}
          />
          <Geom
            type="interval"
            position="year*waste"
            color={['year', '#00B8D9']}
          />
        </Chart>

        <Chart height={400} data={dv} forceFit>
          <ChartTitle>危废电量比</ChartTitle>
          <Legend />
          <Axis name="year" />
          <Axis name="wasteDivideElectricity" />
          <Tooltip
            crosshairs={{
              type: "y"
            }}
          />
          <Geom
            type="interval"
            position="year*wasteDivideElectricity"
            color={['year', '#6554C0']}
          />
        </Chart>

        <Chart height={400} data={dv} forceFit>
          <ChartTitle>危废水量比</ChartTitle>
          <Legend />
          <Axis name="year" />
          <Axis name="wasteDivideWater" />
          <Tooltip
            crosshairs={{
              type: "y"
            }}
          />
          <Geom
            type="interval"
            position="year*wasteDivideElectricity"
            color={['year', '#FFAB00']}
          />
        </Chart>

        <Chart height={400} data={dv} forceFit>
          <ChartTitle>危废水量电量总和比</ChartTitle>
          <Legend />
          <Axis name="year" />
          <Axis name="wasteDivieAll" />
          <Tooltip
            crosshairs={{
              type: "y"
            }}
          />
          <Geom
            type="interval"
            position="year*wasteDivieAll"
            color={['year', '#4C9AFF']}
          />
        </Chart>
      </Wrapper>
    );
  }
}

export default App;
