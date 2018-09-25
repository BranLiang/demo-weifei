import React, { Component } from 'react';
import {
  Chart,
  Geom,
  Axis,
  Tooltip,
  Legend
} from "bizcharts";
import DataSet from "@antv/data-set";
import Select from '@atlaskit/select';
import zhongqiData from './data/zhongqi'
import desidaData from './data/desida'
import meixingpengData from './data/meixingpeng'
import { Wrapper, ChartTitle } from './styles'

const GROUP_OPTIONS = [
  {
    label: '问题企业',
    options: [
      { label: '南京美星鹏科技实业有限公司', value: 'meixingpeng' },
      { label: '中旗科技股份有限公司', value: 'zhongqi' },
      { label: '德司达(南京)染料有限公司', value: 'desida' }
    ],
  },
  {
    label: '正常企业',
    options: []
  }
];

const ds = new DataSet();
/* Source data */
ds.createView('zhongqi').source(zhongqiData)
ds.createView('desida').source(desidaData)
ds.createView('meixingpeng').source(meixingpengData)

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selected: { label: '中旗科技股份有限公司', value: 'zhongqi'}
    } 
  }

  handleChangeSelected = (selected) => {
    this.setState({ selected })
  }

  render() {
    const { selected } = this.state
    const dv = ds.getView(selected.value)
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

    dv.transform({
      type: 'map',
      callback(row) {
        if (row.wasteDivideElectricity) {
          row.meanWasteDivideElectricity = meanWasteDivideElectricity
        }
        if (row.wasteDivideWater) {
          row.meanWasteDivideWater = meanWasteDivideWater
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
        return row
      }
    })

    // 1. 电量上升，危废下降
    // 2. 危废电量比减小一定比例
    // 3. 水量上升，危废下降
    // 4. 危废水量比减小一定比例
    // 5. 危废电量比增加一定比例
    // 6. 危废水量比增加一定比例

    console.log(dv);

    return (
      <div>
        <Select
          options={GROUP_OPTIONS} placeholder="请选择一个企业"
          value={selected}
          onChange={this.handleChangeSelected}
        />
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
        </Wrapper>
      </div>
    );
  }
}

export default App;
