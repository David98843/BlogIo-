import PostItem from "./PostItem"

const RecommendedListing = () => {
  return (
    <div className="post-listing recommended">
      <h3>Articles you might like</h3>
      <PostItem/>
      <PostItem/>
      <PostItem/>
      <PostItem/>
    </div>
  )
}

export default RecommendedListing
