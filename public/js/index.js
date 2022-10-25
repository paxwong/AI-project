async function getUser() {
    const res = await fetch('/user/getMyInfo')
    let result = await res.json()
    if (res.ok) {
        // console.log('invalid user')
        window.location.assign("/main.html")
    }
    if (!res.ok) {
        console.log('Please login first')
    }
}

getUser()