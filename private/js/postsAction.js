const postListFormElement = document.querySelector(".create-form");


async function getUserInfo() {
    const res = await fetch('/user/getMyInfo')
    let result = await res.json()
    userID = result.id
    userNickname = result.nickname
}
let userNickname
let userID
getUserInfo()
function removeTab() {
    const tab = document.querySelector(".comment-pop-up")
    tab.remove()

}

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
                if (!imgContainer.querySelector("button")) {
                    imgContainer.innerHTML += `
                    <button id="left-btn"onClick="left(${post.id})"><i class="arrow"></i></button>
                <button id="right-btn" onClick="right(${post.id})"><i class="arrow"></i></button>
                `
                }

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
                        </div>
                        <div class="posted-on">${timeDiff + " ago"}</div>
                     <div class="likes"> <div class="liked-by" style="display:none"></div></div>
                    
                        <div class="comment">
                     
                        </div>
                    </div>
                    <div class="comment-pop-up-container" id="comment-pop-up-${post.id}"></div>
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
        if (document.querySelectorAll(".post").length % 2 != 0) {
            postContainer.innerHTML += `
            <div class="place-holder"></div>
            `
        }



        // add event listener
        const posts = document.querySelectorAll('.post')
        for (let postDiv of posts) {
            const commentBtn = postDiv.querySelector('.message')
            const likeBtn = postDiv.querySelector('.like')
            let likedBtn = postDiv.querySelector('.liked')
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
                let popUp = document.querySelector(`#comment-pop-up-${postID}`)
                if (popUp.querySelector(".comment-pop-up")) {
                    return
                }

                popUp.innerHTML += `   <div class="comment-pop-up">Place your comment below:
                <form id="comment-form">
                <input name="comment" type="text" required autocomplete="off" id="comment">
                    <label for="comment" title="comment" data-title="comment"></label>
                <input type="submit" value="Submit" class="btn" id="submit-button">
                </form>
                <div class="close-comment-tab" onclick="removeTab()">x</div>
                </div>`
                popUp.style.zIndex = "+10000"
                let submit = document.querySelector('#comment-form')

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
                        loadPosts()
                    }
                })
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

function previewLeft() {
    let output = document.querySelector('.preview-panel');
    var pic = output.getElementsByTagName('img')
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
}

function previewRight() {
    let output = document.querySelector('.preview-panel');
    var pic = output.getElementsByTagName('img')
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
}
async function createPosts(e) {
    e.preventDefault();
    let preview = document.querySelector('.preview-panel')
    let ringSwitch = document.querySelector('.lds-ring-switch')
    ringSwitch.classList.add('lds-ring')

    const formData = new FormData(postListFormElement);


    const res = await fetch("/post/formidable", {
        method: "POST",
        body: formData,
    });
    let result = await res.json()
    console.log(result)

    // async function dataURLToFile(resultURL) {
    //     const res = await fetch(resultURL)
    //     // console.log("URLres", res.url)
    //     let filename = (res.url).slice(37)
    //     filename = filename.split("/")[0] + ".jpg"
    //     const blob = await res.blob()
    //     // console.log("URLblob", blob)
    //     const file = new File([blob], `${filename}`)
    //     // console.log("URLfile", file)
    //     return file
    //     // The second argument is the filename
    //     // Now this file is the same as the one you have been working with in input
    // }
    // let convertedImage = dataURLToFile(resultURL)
    //  const convertedRes= await fetch("/post/formidable-converted-image", {
    //     method: "POST",
    //     body: convertedImage,
    // });
    // let convertedResult = await convertedRes.json()

    if (!res.ok) {
        ringSwitch.classList.remove('lds-ring')
        document.querySelector("#edit-setting-message").textContent = result.message
        return
    }
    if (res.ok) {
        ringSwitch.classList.remove('lds-ring')
        preview.innerHTML = ' '
        for (let i = 0; i < result.message.length; i++) {

            if (i == 0) {
                preview.innerHTML += `
            <img class="output-image active" src="${result.message[i]}" style="display:block;">
            `
            } else {
                preview.innerHTML += `
            <img class="output-image"  src="${result.message[i]}" style="display:none;">
            `
            }
        }


        if (preview.querySelectorAll("img").length > 1) {
            preview.innerHTML += `
    <button id="left-btn"onClick="previewLeft()"><i class="arrow"></i></button>
    <button id="right-btn" onClick="previewRight()"><i class="arrow"></i></button>`
        }
        postListFormElement.reset();
        // form.reset()
        // loadPosts()
        loadMyPosts()
        publicizePost(result.postId)
    }
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
    postListFormElement.addEventListener("submit", createPosts);
    loadPosts()


}

init()


loadFile = function (event) {
    let output = document.querySelector('.preview-panel');
    output.innerHTML = `
<div class="ring-container">
                            <div class="lds-ring-switch">
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                            </div>
                        </div>`
    for (let i = 0; i < event.target.files.length; i++) {
        if (i == 0) {
            let src = URL.createObjectURL(event.target.files[i]);
            output.innerHTML += `
        <img class="output-image active" src="${src}" style="display:block;">
        `
        } else {
            let src = URL.createObjectURL(event.target.files[i]);
            output.innerHTML += `
        <img class="output-image"  src="${src}" style="display:none;">
        `
        }
    }

    if (output.querySelectorAll("img").length > 1) {
        output.innerHTML += `
<button id="left-btn"onClick="previewLeft()"><i class="arrow"></i></button>
<button id="right-btn" onClick="previewRight()"><i class="arrow"></i></button>`
    }
}

// output.onload = function () {
//     URL.revokeObjectURL(output.src) // free memory


let popUpFinish = document.querySelector("#pop-up-2-container")
// let blurDiv = document.querySelector("#blur")
let originalHTML = `<div class="outerContainer">
    <div class="account container2 gradient-border">
        <div class="profile-svg-container">
            <i class="bi bi-x-lg"></i>
        </div>
        <div class="profile-title">CONGRATS!</div>
        <div>Your Post is currently private-view only!</div>
        <div class="profile-button-container">
            <div class="profile-button" id="public-post-button">Publicize</div>
            <a target="_blank" href="https://twitter.com/intent/tweet?text=I%20have%20just%20colorized%20a%20manga%20with%20AI%20on%20https%3A%2F%2Fmangai.tech" class="profile-button" id="change-picture">Tweet</a>
            <div onclick="resetCreate()" class="profile-button" id="change-picture">Make a new one</div>
        </div>
        <!-- <div class="message">123</div> -->
    </div>
    </div>`
let crossButton2 = document.querySelector("#pop-up-2-container .bi-x-lg")

crossButton2.addEventListener("click", function () {
    closePopUp2()
})

blurDiv.addEventListener("click", function (e) {
    closePopUp2()
})

function closePopUp2() {
    popUpFinish.innerHTML = originalHTML
    popUpFinish.style.display = "none"
    popUpDiv.style.display = "none"
    blurDiv.style.display = "none"
}

function resetCreate() {
    popUpFinish.style.display = 'none'
    blurDiv.style.display = 'none'
    document.querySelector(".preview-panel").innerHTML =
        `<div class="ring-container">
                <div class="lds-ring-switch">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </div>`
    document.querySelector(".create-form").reset()
}

async function changePublic(postId) {
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
    if (!res.ok) {
        console.log('not ok')
        return
    }
    if (res.ok) {
        console.log('ok')
        // popUpFinish.innerHTML = originalHTML
        document.querySelector("#public-post-button").textContent = "Publicized!"
        crossButton2.addEventListener("click", function () {
            closePopUp2()
        })
        return
    }
}

async function publicizePost(postId) {
    setTimeout(`document.querySelector("#blur").style.display = "block"
    popUpFinish.style.display = 'block'`,5000)
    document.querySelector("#public-post-button").addEventListener("click", async function () {
        await changePublic(postId)
        loadMyPosts()
        loadPosts()
    })

}