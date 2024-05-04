import './index.css'

const SimilarProductItem = props => {
  const {productDetails} = props
  const {title, brand, imageUrl, price, rating} = productDetails
  return (
    <li className="product-details-list">
      <img
        src={imageUrl}
        alt="similar product"
        className="similar-product-image"
      />
      <h1 className="title">{title}</h1>
      <p className="brand">by {brand}</p>
      <div className="price-and-rating-container">
        <p className="price">Rs {price}</p>
        <div className="rating-cards">
          <p className="ratings">{rating}</p>
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="star"
            className="rating-images"
          />
        </div>
      </div>
    </li>
  )
}
export default SimilarProductItem
