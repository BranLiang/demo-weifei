import React, { Component } from 'react';
import {
  Chart,
  Geom,
  Axis,
  Tooltip
} from "bizcharts";
import DataSet from "@antv/data-set";
import Select from '@atlaskit/select';
import Banner from '@atlaskit/banner'
import Badge from '@atlaskit/badge'
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
import jintongMonthData from './data/jintongM'
import {
  Wrapper,
  ChartTitle,
  SelectorWrapper,
  TagWrapper,
  SelectorContainer,
  BadgeWrapper,
  CompanyName
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
      { label: '纳尔科(按月分析)', value: 'naerkeM' },
      { label: '金桐(按月分析)', value: 'jintongM' }
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
ds.createView('jintongM').source(jintongMonthData)

class App extends Component {
  constructor(props) {
    super(props)
    
    this.state = {
      selected: { label: '中旗科技股份有限公司(按月分析)', value: 'zhongqiM'},
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
    let warningCount = 0
    let errorCount = 0
    const rows = dv.rows

    rows.map((r) => {
      let checkValue = 0
      if (Math.abs(r.waterChangeRate) > 200 || Math.abs(r.electricityChangeRate) > 200) {
        return r
      }
      if (r.waterChangeRate && r.electricityChangeRate) {
        checkValue = (r.waterChangeRate + r.electricityChangeRate) / 2 - r.wasteChangeRate
      }
      if (r.waterChangeRate && !r.electricityChangeRate) {
        checkValue = r.waterChangeRate - r.wasteChangeRate
      }
      if (!r.waterChangeRate && r.electricityChangeRate) {
        checkValue = r.electricityChangeRate - r.wasteChangeRate
      }
      if (checkValue > warningPoint && checkValue <= errorPoint) {
        warningCount += 1
        banners.push({
          level: 'warning',
          value: checkValue,
          message: `${r.year}出现异常,指数${checkValue.toFixed(1)}%`
        })
      }
      if (checkValue > errorPoint) {
        errorCount += 1
        banners.push({
          level: 'error',
          value: checkValue,
          message: `${r.year}异常明显,指数${checkValue.toFixed(1)}%`
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

    /* Copy a new ds view */
    const dsNew = new DataSet();
    dsNew.createView('summary').source(dv.rows)
    const dvNew = dsNew.getView('summary')

    let foldFields = ['wasteChangeRate']
    if (hasWater) {
      foldFields.push('waterChangeRate') 
    }
    if (hasElectricity) {
      foldFields.push('electricityChangeRate')
    }

    dvNew.transform({
      type: 'fold',
      fields: foldFields,
      key: 'changeType',
      value: 'changeRate'
    });

    dvNew.transform({
      type: 'filter',
      callback(row) {
        return row.changeRate < 200;
      }
    })

    const isMonthData = dvNew.rows.length >= 36
    
    let dsNew1
    let dvNew1
    if (isMonthData) {
      dsNew1 = new DataSet();
      dsNew1.createView('summary').source(dvNew.rows.slice(0,36))
      dvNew1 = dsNew1.getView('summary')
    }

    let dsNew2
    let dvNew2
    if (isMonthData) {
      dsNew2 = new DataSet();
      dsNew2.createView('summary').source(dvNew.rows.slice(36,72))
      dvNew2 = dsNew2.getView('summary')
    }

    let dsNew3
    let dvNew3
    if (isMonthData) {
      dsNew3 = new DataSet();
      dsNew3.createView('summary').source(dvNew.rows.slice(72))
      dvNew3 = dsNew3.getView('summary')
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
              <BadgeWrapper>
                <span>危险️</span>
                <Badge appearance="important">{errorCount}</Badge>
              </BadgeWrapper>
              <BadgeWrapper>
                <span>警告</span>
                <Badge>{warningCount}</Badge>
              </BadgeWrapper>
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
                color={'#36B37E'}
              />
              <Geom
                type="line"
                position="year*electricity"
                color={'#36B37E'}
                size={2}
              />
              <Geom
                type="point"
                position="year*electricity"
                size={4}
                shape={"circle"}
                color={'#36B37E'}
                style={{
                  stroke: "#fff",
                  lineWidth: 1
                }}
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
                color={'#172B4D'}
              />
              <Geom
                type="line"
                position="year*water"
                color={'#172B4D'}
                size={2}
              />
              <Geom
                type="point"
                position="year*water"
                size={4}
                shape={"circle"}
                color={'#172B4D'}
                style={{
                  stroke: "#fff",
                  lineWidth: 1
                }}
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
              color={'#00B8D9'}
            />
            <Geom
              type="line"
              position="year*waste"
              color={'#00B8D9'}
              size={2}
            />
            <Geom
              type="point"
              position="year*waste"
              size={4}
              shape={"circle"}
              color={'#00B8D9'}
              style={{
                stroke: "#fff",
                lineWidth: 1
              }}
            />
          </Chart>

          <Chart height={400} data={dvNew} scale={scale} forceFit>
            <ChartTitle>水电、危废变化率对比</ChartTitle>
            <Axis name="year" />
            <Axis name="changeRate" />
            <Tooltip
              crosshairs={{
                type: "y"
              }}
            />
            <Geom
              type="interval"
              position="year*changeRate"
              color={['changeType', ['#00B8D9', '#172B4D', '#36B37E']]}
              adjust={[
                {
                  type: "dodge",
                  marginRatio: 1 / 32
                }
              ]}
            />
          </Chart>

          {isMonthData && (
            <Chart height={400} data={dvNew1} scale={scale} forceFit>
              <ChartTitle>水电、危废变化率对比1</ChartTitle>
              <Axis name="year" />
              <Axis name="changeRate" />
              <Tooltip
                crosshairs={{
                  type: "y"
                }}
              />
              <Geom
                type="interval"
                position="year*changeRate"
                color={['changeType', ['#00B8D9', '#172B4D', '#36B37E']]}
                adjust={[
                  {
                    type: "dodge",
                    marginRatio: 1 / 32
                  }
                ]}
              />
            </Chart>
          )}

          {isMonthData && (
            <Chart height={400} data={dvNew2} scale={scale} forceFit>
              <ChartTitle>水电、危废变化率对比2</ChartTitle>
              <Axis name="year" />
              <Axis name="changeRate" />
              <Tooltip
                crosshairs={{
                  type: "y"
                }}
              />
              <Geom
                type="interval"
                position="year*changeRate"
                color={['changeType', ['#00B8D9', '#172B4D', '#36B37E']]}
                adjust={[
                  {
                    type: "dodge",
                    marginRatio: 1 / 32
                  }
                ]}
              />
            </Chart>
          )}

          {isMonthData && (
            <Chart height={400} data={dvNew3} scale={scale} forceFit>
              <ChartTitle>水电、危废变化率对比3</ChartTitle>
              <Axis name="year" />
              <Axis name="changeRate" />
              <Tooltip
                crosshairs={{
                  type: "y"
                }}
              />
              <Geom
                type="interval"
                position="year*changeRate"
                color={['changeType', ['#00B8D9', '#172B4D', '#36B37E']]}
                adjust={[
                  {
                    type: "dodge",
                    marginRatio: 1 / 32
                  }
                ]}
              />
            </Chart>
          )}

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

          <CompanyName>南京酷猿信息技术有限公司©2018</CompanyName>

        </Wrapper>
      </div>
    );
  }
}

export default App;
