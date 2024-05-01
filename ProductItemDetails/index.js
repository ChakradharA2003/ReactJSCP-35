// Write your code here
import {Component} from 'react'

import {withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import Header from '../Header/index'

import './index.css'

class ProductItemDetails extends Component {
  fetchData = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    console.log(id)
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const apiUrl = `https://apis.ccbp.in/products/${id}`
    const response = await fetch(apiUrl, options)
    const data = await response.json()
    console.log(data)
  }

  render() {
    this.fetchData()
    return (
      <>
        <Header />
        <div className="main-container">
          <h1>Rashmika</h1>
        </div>
      </>
    )
  }
}
export default withRouter(ProductItemDetails)
