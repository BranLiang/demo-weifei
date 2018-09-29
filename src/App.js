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
import Banner from '@atlaskit/banner'
import FieldRange from '@atlaskit/field-range';
import ErrorIcon from '@atlaskit/icon/glyph/error';
import WarningIcon from '@atlaskit/icon/glyph/warning';
import Tag from '@atlaskit/tag';
import zhongqiData from './data/zhongqi'
import zhongqiMonthData from './data/zhongqiM'
import desidaData from './data/desida'
import desidaMonthData from './data/desidaM'
import dajiData from './data/daji'
import dajiMonthDate from './data/dajiM'
import meixingpengData from './data/meixingpeng'
import meixingpengMonthData from './data/meixingpengM'
import boshiData from './data/boshiqiche'
import shimisiData from './data/shimisi'
import zhengdaData from './data/zhengda'
import wakeMonthData from './data/wakeM'
import naerkeMonthData from './data/naerkeM'
import {
  Wrapper,
  ChartTitle,
  SelectorWrapper,
  AnalysisWrapper,
  TagWrapper,
  SelectorContainer
} from './styles'

const GROUP_OPTIONS = [
  {
    label: '问题企业',
    options: [
      { label: '中旗科技股份有限公司', value: 'zhongqi' },
      { label: '中旗科技股份有限公司(按月分析)', value: 'zhongqiM' },
      { label: '南京美星鹏科技实业有限公司', value: 'meixingpeng' },
      { label: '南京美星鹏科技实业有限公司(按月分析)', value: 'meixingpengM' },
      { label: '德司达(南京)染料有限公司', value: 'desida' },
      { label: '德司达(南京)染料有限公司(按月分析)', value: 'desidaM' },
      { label: '南京大吉铁塔制造有限公司', value: 'daji' },
      { label: '南京大吉铁塔制造有限公司(按月分析)', value: 'dajiM' },
      { label: '瓦克(按月分析)', value: 'wakeM' },
      { label: '纳尔科(按月分析)', value: 'naerkeM' }
    ],
  },
  {
    label: '正常企业',
    options: [
      { label: '博世汽车技术服务有限公司', value: 'boshi' },
      { label: '艾欧史密斯热水器有限公司', value: 'shimisi' },
      { label: '正大天晴药业集团股份有限公司', value: 'zhengda' }
    ]
  }
];

const icons = {
  'warning': <WarningIcon label="Warning icon" secondaryColor="inherit" />,
  'error': <ErrorIcon label="Error icon" secondaryColor="inherit" />
}

const ds = new DataSet();
/* Source data */
ds.createView('zhongqi').source(zhongqiData)
ds.createView('zhongqiM').source(zhongqiMonthData)
ds.createView('desida').source(desidaData)
ds.createView('desidaM').source(desidaMonthData)
ds.createView('meixingpeng').source(meixingpengData)
ds.createView('meixingpengM').source(meixingpengMonthData)
ds.createView('daji').source(dajiData)
ds.createView('dajiM').source(dajiMonthDate)
ds.createView('boshi').source(boshiData)
ds.createView('shimisi').source(shimisiData)
ds.createView('zhengda').source(zhengdaData)
ds.createView('wakeM').source(wakeMonthData)
ds.createView('naerkeM').source(naerkeMonthData)

class App extends Component {
  constructor(props) {
    super(props)
    
    this.state = {
      selected: { label: '中旗科技股份有限公司', value: 'zhongqi'},
      warningPoint: 30,
      errorPoint: 60
    }
  }

  handleChangeSelected = (selected) => {
    this.setState({ selected })
  }

  onWarningPointChange = (value) => {
    this.setState({
      warningPoint: value
    })
  }

  onErrorPointChange = (value) => {
    this.setState({
      errorPoint: value
    })
  }

  render() {
    const { selected, warningPoint, errorPoint } = this.state
    
    const dv = ds.getView(selected.value)
    let hasElectricity = false
    let hasWater = false

    dv.transform({
      type: 'map',
      callback(row) {
        if (row.electricity) {
          hasElectricity = true
          row.wasteDivideElectricity = row.waste / row.electricity * 10000
        }
        if (row.water) {
          hasWater = true
          row.wasteDivideWater = row.waste / row.water * 10000
        }
        return row
      }
    })

    dv.transform({
      type: 'map',
      callback(row, i) {
        if (i === 0) {
          row.wasteChangeRate = 0
          if (row.electricity) {
            row.electricityChangeRate = 0
            row.WDEChangeRate = 0
          }
          if (row.water) {
            row.waterChangeRate = 0
            row.WDWChangeRate = 0
          }
        } else {
          const prevRow = dv.rows[i - 1]
          
          if (row.electricity) {
            const electricityChange = row.electricity - prevRow.electricity
            const WDEChange = row.wasteDivideElectricity - prevRow.wasteDivideElectricity
            row.electricityChangeRate = electricityChange / prevRow.electricity * 100
            row.WDEChangeRate = WDEChange / prevRow.wasteDivideElectricity * 100
          }

          if (row.water) {
            const waterChange = row.water - prevRow.water
            const WDWChange = row.wasteDivideWater - prevRow.wasteDivideWater
            row.waterChangeRate = waterChange / prevRow.water * 100
            row.WDWChangeRate = WDWChange / prevRow.wasteDivideWater * 100
          }

          const wasteChange = row.waste - prevRow.waste
          row.wasteChangeRate = wasteChange / prevRow.waste * 100
        }
        return row
      }
    })

    // 30 - 60 warning
    // 60 - up danger
    let banners = []
    const rows = dv.rows
    rows.map((r) => {
      if (r.wasteChangeRate > warningPoint && r.wasteChangeRate <= errorPoint) {
        banners.push({
          level: 'warning',
          message: `${r.year}危废增长较快,幅度为${r.wasteChangeRate.toFixed(2)}%`
        })
      }
      if (r.wasteChangeRate > errorPoint) {
        banners.push({
          level: 'error',
          message: `${r.year}危废增长异常, 幅度为${r.wasteChangeRate.toFixed(2)}%`
        })
      }
      if (r.wasteChangeRate < -warningPoint && r.wasteChangeRate >= -errorPoint) {
        banners.push({
          level: 'warning',
          message: `${r.year}危废减少较快, 幅度为${r.wasteChangeRate.toFixed(2)}%`
        })
      }
      if (r.wasteChangeRate < -errorPoint) {
        banners.push({
          level: 'error',
          message: `${r.year}危废减少异常, 幅度为${r.wasteChangeRate.toFixed(2)}%`
        })
      }

      if (r.WDEChangeRate > warningPoint && r.WDEChangeRate <= errorPoint) {
        banners.push({
          level: 'warning',
          message: `${r.year}危废电量比增长较快, 幅度为${r.WDEChangeRate.toFixed(2)}%`
        })
      }
      if (r.WDEChangeRate > errorPoint) {
        banners.push({
          level: 'error',
          message: `${r.year}危废电量比增长异常, 幅度为${r.WDEChangeRate.toFixed(2)}%`
        })
      }
      if (r.WDEChangeRate < -warningPoint && r.WDEChangeRate >= -errorPoint) {
        banners.push({
          level: 'warning',
          message: `${r.year}危废电量比减少较快, 幅度为${r.WDEChangeRate.toFixed(2)}%`
        })
      }
      if (r.WDEChangeRate < -errorPoint) {
        banners.push({
          level: 'error',
          message: `${r.year}危废电量比减少异常, 幅度为${r.WDEChangeRate.toFixed(2)}%`
        })
      }

      if (r.WDWChangeRate > warningPoint && r.WDWChangeRate <= errorPoint) {
        banners.push({
          level: 'warning',
          message: `${r.year}危废水量比增长较快, 幅度为${r.WDWChangeRate.toFixed(2)}%`
        })
      }
      if (r.WDWChangeRate > errorPoint) {
        banners.push({
          level: 'error',
          message: `${r.year}危废水量比增长异常, 幅度为${r.WDWChangeRate.toFixed(2)}%`
        })
      }
      if (r.WDWChangeRate < -warningPoint && r.WDWChangeRate >= -errorPoint) {
        banners.push({
          level: 'warning',
          message: `${r.year}危废水量比减少较快, 幅度为${r.WDWChangeRate.toFixed(2)}%`
        })
      }
      if (r.WDWChangeRate < -errorPoint) {
        banners.push({
          level: 'error',
          message: `${r.year}危废水量比减少异常, 幅度为${r.WDWChangeRate.toFixed(2)}%`
        })
      }

      return r
    })

    const scale = {
      year: {
        tickCount: 3
      },
      wasteChangeRate: {
        min: -100,
        max: 100
      },
      WDEChangeRate: {
        min: -100,
        max: 100
      },
      WDWChangeRate: {
        min: -100,
        max: 100
      }
    }

    return (
      <div>
        <SelectorWrapper>
          <SelectorContainer>
            警告系数: {warningPoint}
            <FieldRange
              value={warningPoint}
              min={1}
              max={50}
              step={1}
              onChange={this.onWarningPointChange}
            />
            危险系数: {errorPoint}
            <FieldRange
              value={errorPoint}
              min={51}
              max={100}
              step={1}
              onChange={this.onErrorPointChange}
            />
            <Select
              options={GROUP_OPTIONS} placeholder="请选择一个企业"
              value={selected}
              onChange={this.handleChangeSelected}
            />
            <TagWrapper>
              {hasElectricity && (
                <Tag text="用电分析" color="green" />
              )}
              {hasWater && (
                <Tag text="用水分析" color="yellow" />
              )}
            </TagWrapper>
            {banners.map((b, i) => (
              <Banner key={i} isOpen icon={icons[b.level]} appearance={b.level}>
                {b.message}
              </Banner>
            ))}
          </SelectorContainer>
        </SelectorWrapper>
        <Wrapper>
          {hasElectricity && (
            <Chart height={400} data={dv} scale={scale} forceFit>
              <ChartTitle>电使用量</ChartTitle>
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
            <Chart height={400} data={dv} scale={scale} forceFit>
              <ChartTitle>水使用量</ChartTitle>
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

          <Chart height={400} data={dv} scale={scale} forceFit>
            <ChartTitle>危险废物量</ChartTitle>
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

          <Chart height={400} data={dv} scale={scale} forceFit>
            <ChartTitle>危险废物量变化情况</ChartTitle>
            <Axis name="year" />
            <Axis name="wasteChangeRate" />
            <Tooltip
              crosshairs={{
                type: "y"
              }}
            />
            <Geom
              type="interval"
              position="year*wasteChangeRate"
              color={['year', '#FF7452']}
            />
          </Chart>

          {hasElectricity && (
            <Chart height={400} data={dv} scale={scale} forceFit>
              <ChartTitle>危废电量比(吨/万度)</ChartTitle>
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

          {hasElectricity && (
            <Chart height={400} data={dv} scale={scale} forceFit>
              <ChartTitle>危废电量比变化</ChartTitle>
              <Axis name="year" />
              <Axis name="WDEChangeRate" />
              <Tooltip
                crosshairs={{
                  type: "y"
                }}
              />
              <Geom
                type="interval"
                position="year*WDEChangeRate"
                color={['year', '#BF2600']}
              />
            </Chart>
          )}

          {hasWater && (
            <Chart height={400} data={dv} scale={scale} forceFit>
              <ChartTitle>危废水量比(吨/万吨水)</ChartTitle>
              <Axis name="year" />
              <Axis name="wasteDivideWater" />
              <Tooltip
                crosshairs={{
                  type: "y"
                }}
              />
              <Geom
                type="interval"
                position="year*wasteDivideWater"
                color={['year', '#FFAB00']}
              />
            </Chart>
          )}

          {hasWater && (
            <Chart height={400} data={dv} scale={scale} forceFit>
              <ChartTitle>危废水量比变化</ChartTitle>
              <Axis name="year" />
              <Axis name="WDWChangeRate" />
              <Tooltip
                crosshairs={{
                  type: "y"
                }}
              />
              <Geom
                type="interval"
                position="year*WDWChangeRate"
                color={['year', '#DE350B']}
              />
            </Chart>
          )}

        </Wrapper>
      </div>
    );
  }
}

export default App;
