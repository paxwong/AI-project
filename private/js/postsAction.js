// const postFormElement = document.querySelector()

// async function createItems() {
//     e.preventDefault();

//     const formData = new FormData(postFormElement);

//     const res = await fetch("/post/formidable", {
//         method: "POST",
//         body: formData,
//     });

//     if (res.ok) {
//         form.reset()
//         loadPosts()

//     }
// }

// async function init() {
//     postFormElement.addEventListener("submit", createItems);
// }
// init();

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
    // let con = document.getElementById(`con-${id}`)
    // let raw = document.getElementById(`raw-${id}`)
    // con.style.display = ""
    // raw.style.display = "none"
}

function left(id) {
    // let con = document.getElementById(`con-${id}`)
    // let raw = document.getElementById(`raw-${id}`)
    // con.style.display = "none"
    // raw.style.display = ""
}

async function loadPosts() {
    const res = await fetch('/post')
    const data = await res.json()
    // console.log(data)
    let counter = 0
    if (res.ok) {
        const postContainer = document.querySelector('.post-container')
        for (let post of data) {
            counter = counter + 0.3
            let timeDiff = getTimeDiff(post.created_at)

            const comment = await fetch('/z')


            postContainer.innerHTML += `
            <div class="post" id="post${post.id}" style="animation: postEffect ${counter}s linear;">
                    <div class="post-header">
                    <div class="caption">
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
                        <img id="raw-${post.id}" class="raw" src="/uploads/${post.raw_image}" alt="" style="">
                        <img id="con-${post.id}" class="con" src="/uploads/${post.con_image}" alt="" style="display:none">
                        <button id="right-btn" onClick="right(${post.id})"><i class="arrow"></i></button>
                    </div>
                    <div class="post-footer">
                        <div class="buttons-container">
                            <i class="btn like fa-regular fa-heart"></i>
                            <i class="btn message fa-regular fa-message"></i>
                        </div>
                        <div class="posted-on">${timeDiff + " ago"}</div>
                     
                        <div class="comment">
                            <div class="user">
                                ABC
                            </div>
                            <div class="content">
                                Wa
                            </div>
                        </div>
                    </div>

                </div>


            `

        }


        // add event listener
        const posts = document.querySelectorAll('.post')
        for (let postDiv of posts) {
            const commentBtn = postDiv.querySelector('.message')
            const likeBtn = postDiv.querySelector('.like')
            const raw = postDiv.querySelector('.raw')
            const con = postDiv.querySelector('.con')
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

                const res = await fetch('/post/like', {
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

loadPosts()