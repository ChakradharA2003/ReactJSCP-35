// Write your code here
import {Component} from 'react'
import Loader from 'react-loader-spinner'
import {withRouter, Redirect} from 'react-router-dom'
import {BsDashSquare, BsPlusSquare} from 'react-icons/bs'
import Cookies from 'js-cookie'
import Header from '../Header/index'
import SimilarProductItem from '../SimilarProductItem/index'
import './index.css'

const apiStatusConstants = {
  loading: 'LOADING',
  success: 'SUCCESS',
  failure: 'FAILURE',
  initial: 'INITIAL',
}

class ProductItemDetails extends Component {
  state = {
    productsCount: 1,
    apiCurrentStatus: apiStatusConstants.initial,
    data: [],
  }

  componentDidMount() {
    this.fetchData()
  }

  clickedMinus = () => {
    const {productsCount} = this.state
    if (productsCount <= 1) {
      this.setState({productsCount: 1})
    } else {
      this.setState(prevState => ({
        productsCount: prevState.productsCount - 1,
      }))
    }
  }

  clickedPlus = () => {
    this.setState(prevState => ({
      productsCount: prevState.productsCount + 1,
    }))
  }

  successView = () => {
    const {data, productsCount} = this.state
    const {
      imageUrl,
      totalReviews,
      similarProducts,
      availability,
      brand,
      description,
      id,
      price,
      rating,
      style,
      title,
    } = data
    console.log(similarProducts)

    return (
      <div className="product-item-container">
        <div className="product-details-container">
          <img src={imageUrl} alt="product" className="product-image" />
          <div className="product-details">
            <h1 className="product-title">{title}</h1>
            <p className="product-price">Rs {price} /- </p>
            <div className="review-container">
              <div className="rating-card">
                <p className="product-rating">{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="rating-image"
                />
              </div>
              <p className="product-total-reviews">{totalReviews} Reviews</p>
            </div>
            <p className="product-description">{description}</p>
            <p className="product-available">
              Available: <span className="availability">{availability}</span>
            </p>
            <p className="product-available">
              Brand: <span className="availability">{brand}</span>
            </p>
            <hr />
            <div className="products-inc-dec-container">
              {/* eslint-disable-next-line */}
              <button
                type="button"
                className="products-count-btn"
                onClick={this.clickedMinus}
                data-testid="minus"
              >
                <BsDashSquare />
              </button>

              <p className="product-count">{productsCount}</p>
              {/* eslint-disable-next-line */}
              <button
                type="button"
                className="products-count-btn"
                onClick={this.clickedPlus}
                data-testid="plus"
              >
                <BsPlusSquare />
              </button>
            </div>
            <button type="button" className="add-cart-btn">
              ADD TO CART
            </button>
          </div>
        </div>
        <br />
        <div className="similar-products-container">
          <h1 className="similar-products-heading">Similar Products</h1>
          <ul className="similar-products-list">
            {similarProducts.map(prod => (
              <SimilarProductItem key={prod.id} productDetails={prod} />
            ))}
          </ul>
        </div>
      </div>
    )
  }

  onClickedContinueShopping = () => {
    const {history} = this.props
    history.replace('/products')
  }

  failureView = msg => {
    console.log(msg)
    return (
      <div className="no-product-item-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
          alt="failure view"
          className="failure-image"
        />
        <h1 className="error-message">Product Not Found</h1>
        <button
          type="button"
          className="continue-shopping-btn"
          onClick={this.onClickedContinueShopping}
        >
          Continue Shopping
        </button>
      </div>
    )
  }

  fetchData = async () => {
    this.setState({apiCurrentStatus: apiStatusConstants.loading})
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
    if (response.ok) {
      const data = await response.json()
      const similarProducts = data.similar_products.map(prod => ({
        imageUrl: prod.image_url,
        totalReviews: prod.total_reviews,
        availability: prod.availability,
        brand: prod.brand,
        description: prod.description,
        id: prod.id,
        price: prod.price,
        rating: prod.rating,
        style: prod.style,
        title: prod.title,
      }))
      // console.log(similarProducts)
      const updatedData = {
        imageUrl: data.image_url,
        totalReviews: data.total_reviews,
        availability: data.availability,
        brand: data.brand,
        description: data.description,
        id: data.id,
        price: data.price,
        rating: data.rating,
        style: data.style,
        title: data.title,
        similarProducts,
      }
      // console.log(updatedData)
      this.setState(
        {apiCurrentStatus: apiStatusConstants.success, data: updatedData},
        this.successView,
      )
    }
    if (response.status === 404) {
      this.setState({apiCurrentStatus: apiStatusConstants.failure})
      const data = await response.json()
      this.failureView(data.error_msg)
    }
  }

  loaderView = () => (
    <div className="no-product-item-container">
      <div data-testid="loader">
        <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
      </div>
    </div>
  )

  renderView = () => {
    const {apiCurrentStatus} = this.state
    switch (apiCurrentStatus) {
      case apiStatusConstants.loading:
        return this.loaderView()
      case apiStatusConstants.success:
        return this.successView()
      case apiStatusConstants.failure:
        return this.failureView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        {this.renderView()}
      </>
    )
  }
}
export default withRouter(ProductItemDetails)
