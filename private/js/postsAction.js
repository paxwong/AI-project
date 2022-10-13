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

async function loadPosts() {
    const res = await fetch('/post')
    const data = await res.json()
    console.log(data)
    if (res.ok) {
        const postContainer = document.querySelector('.post-container')
        for (let post of data) {
            postContainer.innerHTML += `
            <div class="post" id="${post.id}">
                    <div class="post-header">
                        <div class="user">
                            Jane Doe
                        </div>
                    </div>
                    <div class="img-container">
                        <button id="left-btn"><i class="arrow"></i></button>
                        <img" src="" alt="">
                        <button id="right-btn"><i class="arrow"></i></button>
                    </div>
                    <div class="post-footer">
                        <div class="buttons-container">
                            <i class="btn like fa-regular fa-heart"></i>
                            <i class="btn message fa-regular fa-message"></i>
                        </div>
                        <div class="posted-on">2h ago</div>
                        <div class="caption">
                            <div class="user">
                                Jane Doe
                            </div>
                            <div class="content">
                                Attack On Titan
                            </div>
                        </div>
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
        const memoContainers = document.querySelectorAll('.memo-container')
        for (let memoDiv of memoContainers) {
            const editBtn = memoDiv.querySelector('.edit-btn')
            const deleteBtn = memoDiv.querySelector('.delete-btn')

            const likeBtn = memoDiv.querySelector('.like-btn')

            likeBtn.addEventListener('click', async (e) => {
                const element = e.target
                const data_index = element.getAttribute('data_index')

                const res = await fetch('/memos/like', {
                    method: 'POST',
                    body: JSON.stringify({
                        memoIndex: data_index
                    }),
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8',
                    }
                })
                if (res.ok) {
                    loadMemos()
                }

            })

            editBtn.addEventListener('click', async (e) => {
                const element = e.target
                const data_index = element.getAttribute('data_index')
                const messageInput =
                    memoDiv.querySelector('.message-input').value
                // Call Edit API
                const res = await fetch('/memos', {
                    method: 'PUT',
                    body: JSON.stringify({
                        text: messageInput,
                        index: data_index
                    }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })

                if (res.ok) {
                    loadMemos()
                }
            })

            deleteBtn.addEventListener('click', async (e) => {
                // Call Delete API
                const element = e.target
                const data_index = element.getAttribute('data_index')
                const res = await fetch('/memos', {
                    method: 'DELETE',
                    body: JSON.stringify({
                        index: data_index
                    }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                if (res.ok) {
                    loadMemos()
                }
            })
        }

    }
}

loadPosts()