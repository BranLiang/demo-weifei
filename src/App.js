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
import desidaData from './data/desida'
import meixingpengData from './data/meixingpeng'
import { Wrapper, ChartTitle } from './styles'

const ds = new DataSet();
/* Source data */
ds.createView('zhongqi').source(zhongqiData)
ds.createView('desida').source(desidaData)
ds.createView('meixingpeng').source(meixingpengData)

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selected: 'desida'
    }
  }

  render() {
    const { selected } = this.state
    const dv = ds.getView(selected)
    let hasElectricity = false
    let hasWater = false

    dv.transform({
      type: 'map',
      callback(row) {
        if (row.electricity) {
          hasElectricity = true
          row.wasteDivideElectricity = row.waste / row.electricity
        }
        if (row.water) {
          hasWater = true
          row.wasteDivideWater = row.waste / row.water
        }
        if (row.water && row.electricity) {
          row.wasteDivideAll = row.waste / (row.electricity + row.water)
        }
        return row
      }
    })

    const meanWasteDivideElectricity = dv.rows.reduce((sum, row) => {
      if (row.wasteDivideElectricity) {
        return sum + row.wasteDivideElectricity 
      } else {
        return sum
      }
    }, 0) / dv.rows.length
    const meanWasteDivideWater = dv.rows.reduce((sum, row) => {
      if (row.wasteDivideWater) {
        return sum + row.wasteDivideWater 
      } else {
        return sum
      }
    }, 0) / dv.rows.length
    const meanWasteDivideAll = dv.rows.reduce((sum, row) => {
      if (row.wasteDivideAll) {
        return sum + row.wasteDivideAll
      } else {
        return sum
      }
    }, 0) / dv.rows.length

    dv.transform({
      type: 'map',
      callback(row) {
        if (row.wasteDivideElectricity) {
          row.meanWasteDivideElectricity = meanWasteDivideElectricity
        }
        if (row.wasteDivideWater) {
          row.meanWasteDivideWater = meanWasteDivideWater
        }
        if (row.wasteDivideAll) {
          row.meanWasteDivideAll = meanWasteDivideAll
        }
        return row
      }
    })

    dv.transform({
      type: 'map',
      callback(row) {
        if (row.wasteDivideElectricity) {
          row.meanWEDifference = row.wasteDivideElectricity - row.meanWasteDivideElectricity
        }
        if (row.wasteDivideWater) {
          row.meanWWDifference = row.wasteDivideWater - row.meanWasteDivideWater
        }
        if (row.wasteDivideAll) {
          row.meanWADifference = row.wasteDivideAll - row.meanWasteDivideAll
        }
        return row
      }
    })

    dv.transform({
      type: 'map',
      callback(row) {
        if (row.meanWEDifference) {
          row.meanWEDifferencePercent = row.meanWEDifference / row.meanWasteDivideElectricity * 100
        }
        if (row.meanWWDifference) {
          row.meanWWDifferencePercent = row.meanWWDifference / row.meanWasteDivideWater * 100
        }
        if (row.meanWADifference) {
          row.meanWADifferencePercent = row.meanWADifference / row.meanWasteDivideAll * 100
        }
        return row
      }
    })

    console.log(dv);

    return (
      <Wrapper>
        {hasElectricity && (
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
        )}

        {hasWater && (
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
        )}

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

        {hasElectricity && (
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
        )}

        {hasWater && (
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
        )}

        {hasWater && hasElectricity && (
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
        )}

        {hasElectricity && (
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
        )}

        {hasWater && (
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
        )}

        {hasWater && hasElectricity && (
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
        )}
      </Wrapper>
    );
  }
}

export default App;
