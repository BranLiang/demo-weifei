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
        row.wasteDivideAll = row.waste / (row.electricity + row.water)
        return row
      }
    })

    const meanWasteDivideElectricity = dv.rows.reduce((sum, row) => {
      return sum + row.wasteDivideElectricity
    }, 0) / dv.rows.length
    const meanWasteDivideWater = dv.rows.reduce((sum, row) => {
      return sum + row.wasteDivideWater
    }, 0) / dv.rows.length
    const meanWasteDivideAll = dv.rows.reduce((sum, row) => {
      return sum + row.wasteDivideAll
    }, 0) / dv.rows.length

    dv.transform({
      type: 'map',
      callback(row) {
        row.meanWasteDivideElectricity = meanWasteDivideElectricity
        row.meanWasteDivideWater = meanWasteDivideWater
        row.meanWasteDivideAll = meanWasteDivideAll
        return row
      }
    })

    dv.transform({
      type: 'map',
      callback(row) {
        row.meanWEDifference = row.wasteDivideElectricity - row.meanWasteDivideElectricity
        row.meanWWDifference = row.wasteDivideWater - row.meanWasteDivideWater
        row.meanWADifference = row.wasteDivideAll - row.meanWasteDivideAll
        return row
      }
    })

    dv.transform({
      type: 'map',
      callback(row) {
        row.meanWEDifferencePercent = row.meanWEDifference / row.meanWasteDivideElectricity * 100
        row.meanWWDifferencePercent = row.meanWWDifference / row.meanWasteDivideWater * 100
        row.meanWADifferencePercent = row.meanWADifference / row.meanWasteDivideAll * 100
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

        <Chart height={400} data={dv} forceFit>
          <ChartTitle>危废电量比较均值变化百分比</ChartTitle>
          <Legend />
          <Axis name="year" />
          <Axis name="meanWEDifferencePercent" />
          <Tooltip
            crosshairs={{
              type: "y"
            }}
          />
          <Geom
            type="interval"
            position="year*meanWEDifferencePercent"
            color={['year', '#36B37E']}
          />
        </Chart>

        <Chart height={400} data={dv} forceFit>
          <ChartTitle>危废水量比较均值变化百分比</ChartTitle>
          <Legend />
          <Axis name="year" />
          <Axis name="meanWWDifferencePercent" />
          <Tooltip
            crosshairs={{
              type: "y"
            }}
          />
          <Geom
            type="interval"
            position="year*meanWWDifferencePercent"
            color={['year', '#FFE380']}
          />
        </Chart>

        <Chart height={400} data={dv} forceFit>
          <ChartTitle>危废水电总量比较均值变化百分比</ChartTitle>
          <Legend />
          <Axis name="year" />
          <Axis name="meanWADifferencePercent" />
          <Tooltip
            crosshairs={{
              type: "y"
            }}
          />
          <Geom
            type="interval"
            position="year*meanWADifferencePercent"
            color={['year', '#FF7452']}
          />
        </Chart>
      </Wrapper>
    );
  }
}

export default App;
