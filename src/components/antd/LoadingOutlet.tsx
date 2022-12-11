import React from 'react'
import { connect } from 'react-redux'
import {Outlet} from "react-router-dom";
import {Spin} from "antd";

interface LoadingOutletProps {
  loading:boolean
}
const LoadingOutlet: React.FC<LoadingOutletProps> = (props) => {
  const { loading } = props
    return (
        <Spin size='large' spinning={loading}>
          <Outlet />
        </Spin>
    )
}
const mapStateToProps = (state:any) => {
  const { LoadingReducer: { loading } } = state
  return {
    loading
  }
}
export default connect(mapStateToProps)(LoadingOutlet)