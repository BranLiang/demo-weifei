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
import baijingyuData from './data/baijingyu'
import weixunData from './data/weixun'
import jpysData from './data/jpys'
import _ from 'lodash'
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
      { label: '南京白敬宇制药有限责任公司', value: 'baijingyu' },
      { label: '维迅化工(南京)有限公司', value: 'weixun' },
      { label: '南京金浦英萨橡胶合成有限公司', value: 'jpys' },
      { label: '博世汽车技术服务有限公司', value: 'boshi' },
      { label: '艾欧史密斯热水器有限公司', value: 'shimisi' }
    ]
  }
];

const icons = {
  'warning': <WarningIcon label="Warning icon" secondaryColor="inherit" />,
  'error': <ErrorIcon label="Error icon" secondaryColor="inherit" />
}

const mapping = {
  'zhongqi': zhongqiData,
  'zhongqiM': zhongqiMonthData,
  'desida': desidaData,
  'desidaM': desidaMonthData,
  'meixingpeng': meixingpengData,
  'meixingpengM': meixingpengMonthData,
  'daji': dajiData,
  'dajiM': dajiMonthDate,
  'boshi': boshiData,
  'shimisi': shimisiData,
  'zhengda': zhengdaData,
  'wakeM': wakeMonthData,
  'naerkeM': naerkeMonthData,
  'jintongM': jintongMonthData,
  'baijingyu': baijingyuData,
  'weixun': weixunData,
  'jpys': jpysData
}

class App extends Component {
  constructor(props) {
    super(props)
    
    this.state = {
      selected: { label: '中旗科技股份有限公司(按月分析)', value: 'zhongqiM'},
      warningPoint: 40,
      errorPoint: 70,
      offset: 0,
      groupNumber: 1
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

  onOffsetChange = (value) => {
    this.setState({
      offset: value
    })
  }

  onGroupNumberChange = (value) => {
    this.setState({
      groupNumber: value
    })
  }

  onErrorPointChange = (value) => {
    this.setState({
      errorPoint: value
    })
  }

  render() {
    const {
      selected,
      warningPoint,
      errorPoint,
      offset,
      groupNumber
    } = this.state
    const isMonthData = selected.value.match(/M/) ? true : false

    const ds = new DataSet();
    
    let originData = mapping[selected.value]
    originData = _.drop(originData, offset)

    const chunkedData = _.chunk(originData, groupNumber)
    let counter = 0
    const chunkedResult = chunkedData.map((groupElements) => {
      counter = counter + 1
      let result = {
        year: `Group${counter}`
      }
      if (groupElements[0].water) {
        result.water = _.reduce(groupElements, (sum, e) => {
          return sum + e.water
        }, 0)
      }
      if (groupElements[0].electricity) {
        result.electricity = _.reduce(groupElements, (sum, e) => {
          return sum + e.electricity
        }, 0)
      }
      if (groupElements[0].waste) {
        result.waste = _.reduce(groupElements, (sum, e) => {
          return sum + e.waste
        }, 0)
      }
      return result
    })

    ds.createView('default').source(chunkedResult)

    let dv = ds.getView('default')
    
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

    dv.rows.map((r) => {
      let checkValue = 0
      if (r.waterChangeRate > 200 || r.electricityChangeRate > 200 || r.waste < 1) {
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
          message: `${r.year}出现异常,指数${checkValue.toFixed(1)}%`
        })
      }
      if (checkValue > errorPoint) {
        errorCount += 1
        banners.push({
          level: 'error',
          message: `${r.year}异常明显,指数${checkValue.toFixed(1)}%`
        })
      }
      
      if (!isMonthData) {
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
    let changeColors = ['#00B8D9']
    if (hasWater) {
      foldFields.unshift('waterChangeRate') 
      changeColors.unshift('#172B4D')
    }
    if (hasElectricity) {
      foldFields.unshift('electricityChangeRate')
      changeColors.unshift('#36B37E')
    }

    dvNew.transform({
      type: 'filter',
      callback(row) {
        if (row.water && row.electricity) {
          return row.waste > 1 && row.waterChangeRate < 200 && row.electricityChangeRate < 200 && row.wasteChangeRate < 200;
        } else if (row.water) {
          return row.waste > 1 && row.waterChangeRate < 200 && row.wasteChangeRate < 200;
        } else {
          return row.waste > 1 && row.electricityChangeRate < 200 && row.wasteChangeRate < 200;
        }
      }
    })

    dvNew.transform({
      type: 'fold',
      fields: foldFields,
      key: 'changeType',
      value: 'changeRate'
    });

    return (
      <div>
        <SelectorWrapper>
          <SelectorContainer>
            计算偏移量: {offset}
            <FieldRange
              value={offset}
              min={0}
              max={6}
              step={1}
              onChange={this.onOffsetChange}
            />
            计算时间间隔: {groupNumber}
            <FieldRange
              value={groupNumber}
              min={1}
              max={6}
              step={1}
              onChange={this.onGroupNumberChange}
            />
            警告系数: {warningPoint}
            <FieldRange
              value={warningPoint}
              min={1}
              max={60}
              step={1}
              onChange={this.onWarningPointChange}
            />
            危险系数: {errorPoint}
            <FieldRange
              value={errorPoint}
              min={61}
              max={150}
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
              color={['changeType', changeColors]}
              adjust={[
                {
                  type: "dodge",
                  marginRatio: 1 / 32
                }
              ]}
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
