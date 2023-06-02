import { useDataLayerValue } from "../DataLayer"
import PostItemLazy from "./PostItemLazy"
import React, { Suspense } from "react"
const PostItem = React.lazy(() => import('./PostItem'))

const PostListing = () => {
    const [{posts}, dispatch] = useDataLayerValue()
    return (
        <div className = 'post-listing'>
            {posts.map((post, index) => {
                    return(
                        <Suspense fallback={<PostItemLazy/>} key = {index}>
                            <PostItem post = {post} id = {index} />
                        </Suspense>
                    )
                }
            )}
        </div>
    )
}

export default PostListing