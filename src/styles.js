import styled from 'styled-components'

export const Wrapper = styled.div`
  flex: 1;
  margin-top: 50px;
  margin-bottom: 50px;
  margin-left: 430px;
`

export const ChartTitle = styled.div`
  text-align: center;
  font-size: 16px;
`

export const SelectorWrapper = styled.div`
  width: 400px;
  position: fixed;
  left: 24px;
  top: 24px;
`

export const SelectorContainer = styled.div`
  height: calc(100vh - 48px);
  overflow-y: scroll;
  padding: 4px;
`

export const AnalysisWrapper = styled.div`
  width: 380px;
  position: fixed;
  right: 24px;
  top: 48px;
`

export const TagWrapper = styled.div`
  margin: 8px 0;
`

export const NoticeText = styled.div`
  font-size: 16px;
`

export const BadgeWrapper = styled.span`
  border-radius: 5px;
  padding: 2px 5px;

  span {
    margin-right: 5px;
  }

  &:hover {
    background-color: #F4F5F7;
  }
`;

export const CompanyName = styled.div`
  color: #8993A4;
  font-size: 16px;
  text-align: center;
`
