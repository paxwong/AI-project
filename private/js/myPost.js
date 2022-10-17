async function getOwner(userId) {
    const res = await fetch(`/user/user-info/${userId}`)
    if (res.ok) {
        let data = await res.json()
        return data.data
    } else {
        return null
    }

}


// async function getUserPosts() {
//     const res = await fetch(`/post/my-posts`)
//     let postsDetail = await res.json()

//     if (res.ok) {

//         addItemsInUserPost(postsDetail)

//     }

// }

async function loadMyPosts() {
    const res = await fetch('/post/my-posts')
    const data = await res.json()
    console.log(data)
    let counter = 0
    if (res.ok) {
        let myPost = document.querySelector('#MyPosts')
        let myPostContainer = myPost.querySelector('.my-post-container')

        myPostContainer.innerHTML = ''
        for (let post of data) {
            // console.log(post)
            if (document.getElementById(`post${post.id}`)) {

                let imgContainer = document.getElementById(`myPost${post.id}`).querySelector('.img-container')
                var numberOfImg = imgContainer.getElementsByTagName('img').length / 2 + 1
                imgContainer.innerHTML += `
                <div id="pic-${post.id}"class="pic" style="display:none">
                <img id="raw-${post.id}-${numberOfImg}" class="raw" src="/uploads/${post.raw_image}" alt="" style="">
                <img id="con-${post.id}-${numberOfImg}" class="con" src="/uploads/${post.con_image}" alt="" style="display:none">
                </div>
                `

            } else {
                // console.log(post)
                counter = counter + 0.3
                let timeDiff = getTimeDiff(post.created_at)

                myPostContainer.innerHTML += `
            <div class="myPost" id="myPost${post.id}" style="animation: postEffect ${counter}s linear;">
                    <div class="post-header">
                    <div class="caption">
                    <div class="icon-container"><img class="user-icon" src="/uploads/${post.icon}" alt="" style=""></div>
                    
                    <div class="user">
                    ${post.nickname}
                    </div>
                    <div class="content">
                        ${post.caption}
                    </div>
                </div>
                    </div>
                    <div class="img-container">
                        <button id="left-btn"onClick="left(${post.id})"><i class="arrow"></i></button>
                        <div id="pic-${post.id}"class="pic active">
                        <img id="raw-${post.id}-1" class="raw" src="/uploads/${post.raw_image}" alt="" style="">
                        <img id="con-${post.id}-1" class="con" src="/uploads/${post.con_image}" alt="" style="display:none">
                        </div>
                        <button id="right-btn" onClick="right(${post.id})"><i class="arrow"></i></button>
                    </div>
                    <div class="posted-on">${timeDiff + " ago"}</div>
                     <div class="likes"> <div class="liked-by" style="display:none"></div></div>
                    <div class="post-footer">
                    <div class="delete-btn" data_index="${post.id}">
					<i data_index="${post.id}"> DELETE </i>
				</div>
                     
                        
                    
                        <div class="comment">
                     
                        </div>
                    </div>

                </div>


            `

                const comment = await fetch(`/post/comment/${post.id}`)
                let commentData = await comment.json()
                // console.log(commentData.data.comment)
                let currentPost = document.getElementById(`myPost${post.id}`)
                let commentContainer = currentPost.querySelector('.comment')
                for (let comment of commentData.data.comment) {
                    // console.log(comment)
                    commentContainer.innerHTML += `

                <div class="user">
                
                ${comment.nickname}
                </div>
                <div class="content">
                    ${comment.content}
                </div>
                `
                }

                const likes = await fetch(`/post/like-count/${post.id}`)
                let likesData = (await likes.json()).data.results
                let likesCount = likesData.length
                let likesContainer = currentPost.querySelector('.likes')
                likesContainer.innerHTML += likesCount + ' likes'
                let likedByContainer = currentPost.querySelector('.liked-by')
                for (let like of likesData) {
                    likedByContainer.innerHTML += `
                    <div class="user">
                    ${like.nickname}
                     </div>`
                }


            }
        }




        // add event listener
        const posts = document.querySelectorAll('.myPost')
        for (let postDiv of posts) {
            const commentBtn = postDiv.querySelector('.message')
            const likeBtn = postDiv.querySelector('.like')
            const raw = postDiv.querySelector('.raw')
            const con = postDiv.querySelector('.con')
            const likes = postDiv.querySelector('.likes')
            let likedBy = postDiv.querySelector('.liked-by')
            const postID = postDiv.getAttribute('id').slice(4)
            // console.log(postID.slice(4))
            likes.addEventListener('mouseover', () => {
                likedBy.style.display = "flex"
            })
            likes.addEventListener('mouseleave', () => {
                likedBy.style.display = "none"
            })
            raw.addEventListener('mouseover', () => {
                raw.style.display = "none"
                con.style.display = ""
            })
            con.addEventListener('mouseleave', () => {
                raw.style.display = ""
                con.style.display = "none"
            })

        }

    }
}

function setEventListenerOnItemDiv(postDiv) {
    const deleteBtn = postDiv.querySelector('.delete-btn')

    deleteBtn.addEventListener('click', async (e) => {
        const element = e.target
        const postId = element.getAttribute('data_index')
        console.log(postId)
        let result = window.confirm("Are you sure to delete this item?\n")
        if (result) {
            const res = await fetch('/post/del-my-posts', {
                method: 'DELETE',
                body: JSON.stringify({
                    postId: postId
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            )
            if (res.ok) {
                loadMyPosts()
            }
        } else { }

    })
}

loadMyPosts()