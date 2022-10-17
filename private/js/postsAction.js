

function getTimeDiff(time) {
    let currentDate = new Date
    let createDate = new Date(time.replace(' ', 'T'))
    let timeFormat = 'm'
    let diffInTime = Math.floor((currentDate.getTime() - createDate.getTime()) / 1000 / 60)
    if (diffInTime > 60) {
        diffInTime = Math.floor(diffInTime / 60)
        timeFormat = 'h'
    }
    if (diffInTime > 24) {
        diffInTime = Math.floor(diffInTime / 24)
        timeFormat = 'days'
    }

    return (diffInTime + timeFormat)
}

function right(id) {
    let imgContainer = document.getElementById(`post${id}`).querySelector('.img-container')
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

function left(id) {
    let imgContainer = document.getElementById(`post${id}`).querySelector('.img-container')
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

async function loadPosts() {
    const res = await fetch('/post')
    const data = await res.json()
    // console.log(data)
    let counter = 0
    if (res.ok) {
        const postContainer = document.querySelector('.post-container')
        postContainer.innerHTML = ''
        for (let post of data) {
            // console.log(post)
            if (document.getElementById(`post${post.id}`)) {

                let imgContainer = document.getElementById(`post${post.id}`).querySelector('.img-container')
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

                postContainer.innerHTML += `
            <div class="post" id="post${post.id}" style="animation: postEffect ${counter}s linear;">
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
                    <div class="post-footer">
                        <div class="buttons-container">
                            <i class="btn like fa-regular fa-heart"></i>
                            <i class="btn message fa-regular fa-message"></i>
                        </div>
                        <div class="posted-on">${timeDiff + " ago"}</div>
                     <div class="likes"> <div class="liked-by" style="display:none"></div></div>
                    
                        <div class="comment">
                     
                        </div>
                    </div>

                </div>


            `

                const comment = await fetch(`/post/comment/${post.id}`)
                let commentData = await comment.json()
                // console.log(commentData.data.comment)
                let currentPost = document.getElementById(`post${post.id}`)
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
        const posts = document.querySelectorAll('.post')
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
            likeBtn.addEventListener('click', async (e) => {
                const element = e.target
                const data_index = element.getAttribute('data_index')

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
                    let likesCount = likesData.length
                    likes.innerHTML = likesCount + ' likes' + `<div class="liked-by" style="display:none">`
                    let likedByContainer = likes.querySelector('.liked-by')
                    for (let like of likesData) {
                        likedByContainer.innerHTML += `
                    <div class="user">
                    ${like.nickname}
                     </div>`
                    }
                    likedBy = likedByContainer
                }

            })

            commentBtn.addEventListener('click', async (e) => {
                const element = e.target
                const data_index = element.getAttribute('data_index')
                const res = await fetch('/post/comment', {
                    method: 'POST',
                    body: JSON.stringify({
                        postIndex: data_index
                    }),
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8',
                    }
                })
                if (res.ok) {
                    loadPosts()
                }
            })
        }

    }
}

function getPostIdInQuery() {
    let search = new URLSearchParams(window.location.search)
    let postId = search.get('postId')
    if (!postId) {
        window.location.href = '/'
    }
    return postId
}

// async function getPost() {
//     let postId = getPostIdInQuery()
//     if (!postId) {
//         window.location.href = '/'
//     }
//     console.log('postID=', postId)
//     const res = await fetch(`/post/comment/${postId}`)
//     let commentDetails = await res.json()

//     console.log("commentDetails is " + commentDetails);

//     return commentDetails
// }

async function init() {
    // let commentDetails = await getPost()
    // let owner = await getOwner(commentDetails.user_id)

    loadPosts()
}

init()


function addListenerToDropdown() {
    let logoutButton = document.querySelector('#logout-button')
    logoutButton.addEventListener('click', async (e) => {
        const res = await fetch('/user/logout')
        if (res.ok) {
            console.log('logged out')
            window.location.assign("/")
        }
    })
}

async function getUser() {
    const res = await fetch('/user/getMyInfo')
    let result = await res.json()
    if (res.ok) {
        console.log(result.nickname)
        document.querySelector('#profile-name').textContent = result.nickname
        document.querySelector('#credit-amount').textContent = result.credit //Credit
        document.querySelector('#profile-picture').src = `../uploads/${result.icon}` //轉pfp
    }
}

addListenerToDropdown()
getUser()
