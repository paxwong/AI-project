// async function getOwner(userId) {
//     const res = await fetch(`/user/user-info/${userId}`)
//     if (res.ok) {
//         let data = await res.json()
//         return data.data
//     } else {
//         return null
//     }

// }
getUserInfo()

// async function getUserPosts() {
//     const res = await fetch(`/post/my-posts`)
//     let postsDetail = await res.json()

//     if (res.ok) {

//         addItemsInUserPost(postsDetail)

//     }

// }
function myPostRight(id) {
    let imgContainer = document.getElementById(`myPost${id}`).querySelector('.img-container')
    var pic = imgContainer.getElementsByTagName('div')
    // console.log(numberOfPic)
    let currentPic = 0
    for (i = 0; i < pic.length; i++) {
        if (pic[i].className.includes('active')) {
            currentPic = i + 1
            if (currentPic > pic.length - 1) {
                currentPic = 0
            }
        }
        pic[i].style.display = 'none'
        pic[i].className = pic[i].className.replace(" active", "");
    }
    pic[currentPic].className += " active"
    pic[currentPic].style.display = 'flex'
    const raw = pic[currentPic].querySelector('.raw')
    const con = pic[currentPic].querySelector('.con')
    raw.addEventListener('mouseover', () => {
        raw.style.display = "none"
        con.style.display = ""
    })
    con.addEventListener('mouseleave', () => {
        raw.style.display = ""
        con.style.display = "none"
    })
}

function myPostLeft(id) {
    let imgContainer = document.getElementById(`myPost${id}`).querySelector('.img-container')
    var pic = imgContainer.getElementsByTagName('div')
    // console.log(numberOfPic)
    let currentPic = 0
    for (i = pic.length - 1; i > -1; i--) {

        if (pic[i].className.includes('active')) {
            currentPic = i - 1
            if (currentPic < 0) {
                currentPic = pic.length - 1
            }
        }
        pic[i].style.display = 'none'
        pic[i].className = pic[i].className.replace(" active", "");
    }
    pic[currentPic].className += " active"
    pic[currentPic].style.display = 'flex'
    const raw = pic[currentPic].querySelector('.raw')
    const con = pic[currentPic].querySelector('.con')
    raw.addEventListener('mouseover', () => {
        raw.style.display = "none"
        con.style.display = ""
    })
    con.addEventListener('mouseleave', () => {
        raw.style.display = ""
        con.style.display = "none"
    })

}
async function loadMyPosts() {
    const res = await fetch('/post/my-posts')
    const data = await res.json()

    let counter = 0
    if (res.ok) {
        let myPost = document.querySelector('#MyPosts')
        let myPostContainer = myPost.querySelector('.my-post-container')
        myPostContainer.innerHTML = ''
        if (data.length == 0) {
            myPostContainer.innerHTML = '<div class="no-post">¯|_( ͡° ͜ʖ ͡°)_/¯ NO POST YET</div>'
        }
        for (let post of data) {
            // console.log(post)
            if (document.getElementById(`myPost${post.id}`)) {

                let imgContainer = document.getElementById(`myPost${post.id}`).querySelector('.img-container')
                var numberOfImg = imgContainer.getElementsByTagName('img').length / 2 + 1
                imgContainer.innerHTML += `
                <div id="pic-${post.id}"class="pic" style="display:none">
                <img id="raw-${post.id}-${numberOfImg}" class="raw" src="/uploads/${post.raw_image}" alt="" style="">
                <img id="con-${post.id}-${numberOfImg}" class="con" src="/uploads/${post.con_image}" alt="" style="display:none">
                </div>
                `
                if (!imgContainer.querySelector("button")) {
                    imgContainer.innerHTML += `
                    <button id="left-btn"onClick="myPostLeft(${post.id})"><i class="arrow"></i></button>
                <button id="right-btn" onClick="myPostRight(${post.id})"><i class="arrow"></i></button>
                `
                }


            } else {
                // console.log(post)
                counter = counter + 0.3
                let timeDiff = getTimeDiff(post.created_at)

                myPostContainer.innerHTML += `
            <div class="myPost" id="myPost${post.id}" style="animation: postEffect ${counter}s linear;">
                <div class="post-header">
                    <div class="caption">
                        <div class="icon-container">
                            <img class="user-icon" src="/uploads/${post.icon}" alt="" style="">
                        </div>
                        <div class="user">
                         ${post.nickname}
                        </div>
                        <div class="content" id="myPost${post.id}-caption">
                        
                         </div>
                    </div>
                    <div class="post-status">${post.status}</div>
                </div>
                    <div class="img-container">
                  
                        <div id="pic-${post.id}"class="pic active">
                        <img id="raw-${post.id}-1" class="raw" src="/uploads/${post.raw_image}" alt="" style="">
                        <img id="con-${post.id}-1" class="con" src="/uploads/${post.con_image}" alt="" style="display:none">
                        </div>
                        
                    </div>
                    <div class="post-footer">
                        <div class="buttons-container">
                            <i class="btn like fa-regular fa-heart tooltip" style='display:'><span class="tooltiptext">Like</span></i>
                            <i class=" btn liked fa-solid fa-heart tooltip" style='display:none'><span class="tooltiptext">Unlike</span></i>
                            <i class="btn message fa-regular fa-message tooltip"><span class="tooltiptext">Comment</span></i>
                            <i class="btn delete-btn fa fa-trash tooltip" data_index="${post.id}"><span class="tooltiptext">Delete Post</span></i>
                        </div>
                        <div class="posted-on">${timeDiff + " ago"}</div>
                     <div class="likes"> <div class="liked-by" style="display:none"></div></div>
                    
                        <div class="comment">
                     
                        </div>
                    </div>
                    <div class="comment-pop-up-container" id="my-comment-pop-up-${post.id}"></div>
                </div>

            `
                document.getElementById(`myPost${post.id}-caption`).textContent = post.caption
                const comment = await fetch(`/post/comment/${post.id}`)
                let commentData = await comment.json()
                // console.log(commentData.data.comment)
                let currentPost = document.getElementById(`myPost${post.id}`)
                let commentContainer = currentPost.querySelector('.comment')
                let i = 0
                for (let comment of commentData.data.comment) {
                    // console.log(comment)
                    commentContainer.innerHTML += `

                <div class="user">
                
                ${comment.nickname}
                </div>
                <div class="content" id="myPost${post.id}comment${i}">
                   
                </div>
                `
                    document.getElementById(`myPost${post.id}comment${i}`).textContent = comment.content
                    i++
                }
                if (post.status == "public") {
                    currentPost.querySelector(".buttons-container").innerHTML += `
                    <i class="fa-solid fa-lock-open btn private-btn tooltip" data_index="${post.id}"><span class=tooltiptext>Private Post</span></i>
                `
                }
                if (post.status == "private") {
                    currentPost.querySelector(".buttons-container").innerHTML += `
                    <i class="fa-solid fa-lock btn public-btn tooltip" data_index="${post.id}"><span class=tooltiptext>Public Post</span></i>
                `
                }
                const likes = await fetch(`/post/like-count/${post.id}`)
                let likesData = (await likes.json()).data.results
                let likesCount = 0
                let likesContainer = currentPost.querySelector('.likes')
                let likeBtn = currentPost.querySelector('.like')
                let likedBtn = currentPost.querySelector('.liked')

                let likedByContainer = currentPost.querySelector('.liked-by')
                for (let like of likesData) {

                    if (like.user_id == userID && like.is_deleted == true) {
                        likeBtn.style.display = "block"
                        likedBtn.style.display = "none"
                    }

                    if (like.user_id == userID && like.is_deleted == false) {
                        likeBtn.style.display = "none"
                        likedBtn.style.display = "block"
                    }
                    if (like.is_deleted == false) {
                        likesCount++
                        likedByContainer.innerHTML += `
                    <div class="user">
                    ${like.nickname}
                     </div>`}

                }
                if (likesCount > 1) { likesContainer.innerHTML += likesCount + ' likes' }
                if (likesCount == 1) { likesContainer.innerHTML += likesCount + ' like' }


            }
        }
        if (document.querySelectorAll(".myPost").length % 2 != 0 && document.querySelectorAll(".myPost").length != 1) {
            myPostContainer.innerHTML += `
            <div class="place-holder"></div>
            `
        }



        // add event listener
        const posts = document.querySelectorAll('.myPost')
        for (let postDiv of posts) {
            const commentBtn = postDiv.querySelector('.message')
            const likeBtn = postDiv.querySelector('.like')
            const deleteBtn = postDiv.querySelector('.delete-btn')
            let publicBtn = postDiv.querySelector('.public-btn')
            let privateBtn = postDiv.querySelector('.private-btn')
            let likedBtn = postDiv.querySelector('.liked')
            const raw = postDiv.querySelector('.raw')
            const con = postDiv.querySelector('.con')
            const likes = postDiv.querySelector('.likes')
            let likedBy = postDiv.querySelector('.liked-by')
            const postID = postDiv.getAttribute('id').slice(6)
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
            likeBtn.addEventListener('click', async (e) => {
                const element = e.target
                const data_index = element.getAttribute('data_index')
                const likeCountRes = await fetch(`/post/like-count/${postID}`)
                let likesData = (await likeCountRes.json()).data.results
                for (let like of likesData) {
                    if (like.user_id == userID && like.is_deleted == true) {
                        const res = await fetch(`/post/update-like/${postID}`, {
                            method: 'POST',
                            body: JSON.stringify({
                                post: postID,
                                user: userID
                            }),
                            headers: {
                                'Content-Type': 'application/json; charset=utf-8',
                            }


                        })
                        if (res.ok) {
                            const res = await fetch(`/post/like-count/${postID}`)
                            let likesData = (await res.json()).data.results
                            let likesCount = 0
                            for (let like of likesData) {
                                if (like.user_id == userID && like.is_deleted == true) {
                                    likeBtn.style.display = "block"
                                    likedBtn.style.display = "none"
                                }
                                if (like.user_id == userID && like.is_deleted == false) {
                                    likeBtn.style.display = "none"
                                    likedBtn.style.display = "block"
                                }
                                if (like.is_deleted == false) {
                                    likesCount++
                                }
                            }

                            if (likesCount > 1) { likes.innerHTML = likesCount + ' likes' + `<div class="liked-by" style="display:none">` }
                            if (likesCount == 1) { likes.innerHTML = likesCount + ' like' + `<div class="liked-by" style="display:none">` }
                            let likedByContainer = likes.querySelector('.liked-by')
                            for (let like of likesData) {
                                if (like.is_deleted == false) {
                                    likedByContainer.innerHTML += `
                                     <div class="user">
                                    ${like.nickname}
                                    </div>`}
                            }
                            likedBy = likedByContainer
                        }
                        return
                    }
                }
                const res = await fetch(`/post/like/${postID}`, {
                    method: 'POST',
                    body: JSON.stringify({
                        postIndex: data_index
                    }),
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8',
                    }
                })
                if (res.ok) {
                    const res = await fetch(`/post/like-count/${postID}`)
                    let likesData = (await res.json()).data.results
                    let likesCount = 0
                    for (let like of likesData) {
                        if (like.user_id == userID && like.is_deleted == true) {
                            likeBtn.style.display = "block"
                            likedBtn.style.display = "none"
                        }
                        if (like.user_id == userID && like.is_deleted == false) {
                            likeBtn.style.display = "none"
                            likedBtn.style.display = "block"
                        }
                        if (like.is_deleted == false) {
                            likesCount++
                        }
                    }
                    if (likesCount > 1) { likes.innerHTML = likesCount + ' likes' + `<div class="liked-by" style="display:none">` }
                    if (likesCount == 1) { likes.innerHTML = likesCount + ' like' + `<div class="liked-by" style="display:none">` }
                    let likedByContainer = likes.querySelector('.liked-by')
                    for (let like of likesData) {
                        if (like.is_deleted == false) {
                            likedByContainer.innerHTML += `
                                     <div class="user">
                                    ${like.nickname}
                                    </div>`}
                    }
                    likedBy = likedByContainer
                }
            })

            likedBtn.addEventListener('click', async (e) => {
                const element = e.target
                const data_index = element.getAttribute('data_index')
                const likeCountRes = await fetch(`/post/like-count/${postID}`)
                let likesData = (await likeCountRes.json()).data.results
                for (let like of likesData) {
                    if (like.user_id == userID && like.is_deleted == false) {
                        const res = await fetch(`/post/remove-like/${postID}`, {
                            method: 'POST',
                            body: JSON.stringify({
                                post: postID,
                                user: userID
                            }),
                            headers: {
                                'Content-Type': 'application/json; charset=utf-8',
                            }


                        })
                        if (res.ok) {

                            const res = await fetch(`/post/like-count/${postID}`)
                            let likesData = (await res.json()).data.results
                            let likesCount = 0
                            for (let like of likesData) {
                                if (like.user_id == userID && like.is_deleted == true) {
                                    likeBtn.style.display = "block"
                                    likedBtn.style.display = "none"
                                }
                                if (like.user_id == userID && like.is_deleted == false) {
                                    likeBtn.style.display = "none"
                                    likedBtn.style.display = "block"
                                }
                                if (like.is_deleted == false) {
                                    likesCount++
                                }
                            }
                            if (likesCount > 1) { likes.innerHTML = likesCount + ' likes' + `<div class="liked-by" style="display:none">` }
                            if (likesCount == 1) { likes.innerHTML = likesCount + ' like' + `<div class="liked-by" style="display:none">` }
                            let likedByContainer = likes.querySelector('.liked-by')
                            for (let like of likesData) {
                                if (like.is_deleted == false) {
                                    likedByContainer.innerHTML += `
                                     <div class="user">
                                    ${like.nickname}
                                    </div>`}
                            }
                            likedBy = likedByContainer
                        }
                    }
                }
            }
            )

            commentBtn.addEventListener('click', async (e) => {
                // console.log('comment')
                let popUp = document.querySelector(`#my-comment-pop-up-${postID}`)
                if (popUp.querySelector(".comment-pop-up")) {
                    return
                }

                popUp.innerHTML += `   <div class="comment-pop-up">Place your comment below:
                <form id="my-comment-form">
                <input name="comment" type="text" required autocomplete="off" id="comment">
                    <label for="comment" title="comment" data-title="comment"></label>
                <input type="submit" value="Submit" class="btn" id="submit-button">
                </form>
                <div class="close-comment-tab" onclick="removeTab()">x</div>
                </div>`
                popUp.style.zIndex = "+10000"
                let submit = document.querySelector('#my-comment-form')

                submit.addEventListener('submit', async function (event) {
                    event.preventDefault();
                    const comment = event.target.comment.value;

                    const res = await fetch(`/post/comment/${postID}`, {
                        method: 'POST',
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            comment
                        })
                    })
                    let result = await res.json()

                    if (res.ok) {
                        removeTab()
                        loadMyPosts()
                    }
                })
            })

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
                        loadPosts()
                        loadMyPosts()
                    }
                }

            })

            if (publicBtn) {
                publicBtn.addEventListener('click', async (e) => {
                    const element = e.target
                    const postId = element.getAttribute('data_index')
                    // console.log(postId)

                    const res = await fetch('/post/change-post-status', {
                        method: 'POST',
                        body: JSON.stringify({
                            postId: postId,
                            postStatus: "public"
                        }),
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                    )
                    if (res.ok) {
                        loadPosts()
                        loadMyPosts()
                    }
                })
            }

            if (privateBtn) {
                privateBtn.addEventListener('click', async (e) => {
                    const element = e.target
                    const postId = element.getAttribute('data_index')
                    // console.log(postId)

                    const res = await fetch('/post/change-post-status', {
                        method: 'POST',
                        body: JSON.stringify({
                            postId: postId,
                            postStatus: "private"
                        }),
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                    )
                    if (res.ok) {
                        loadPosts()
                        loadMyPosts()
                    }
                })
            }

        }

    }
}



loadMyPosts()