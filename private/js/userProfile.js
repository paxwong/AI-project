let settingButton = document.querySelector("#setting-button")
let blurDiv = document.querySelector("#blur")
let popUpDiv = document.querySelector("#pop-up-container")
let crossButton = document.querySelector("#pop-up-container .bi-x-lg")

async function changeSettingButton() {
    const res = await fetch('/user/getMyInfo')
    let result = await res.json()
    console.log("session result", result)
    if (result.is_google == true) {
        settingButton.addEventListener("click", function (e) {
            openPopUp()
            changeGoogleContainer()
        })
    } else

        settingButton.addEventListener("click", function (e) {
            openPopUp()
            returnProfileContainer()
        })
}


blurDiv.addEventListener("click", function (e) {
    closePopUp()
})

crossButton.addEventListener("click", function (e) {
    closePopUp()
})

function openPopUp() {
    blurDiv.style.display = "block"
    popUpDiv.style.display = "block"
}

function closePopUp() {
    blurDiv.style.display = "none"
    popUpDiv.style.display = "none"
}
async function addListenerToDropdown() {
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
        document.querySelector('#credit').style.display = "block"
        document.querySelector('#myName').textContent = result.nickname
        document.querySelector('#profile-name').textContent = result.nickname
        document.querySelector('#credit-amount').textContent = result.credit //Credit
        document.querySelector('#profile-picture').src = `../uploads/${result.icon}` //轉pfp
    }
    if (!res.ok) {
        console.log('invalid user')
        window.location.assign("/") //用住先，之後轉返用app.ts guard
    }
}

function changeGoogleSetting(attribute) {
    let old = ""
    let type = "text"
    let upperCase = attribute.substring(0, 1).toUpperCase() + attribute.slice(1)
    if (attribute === "password") {
        old = "Old"
        type = "password"
    }
    document.querySelector('.profile-button-container').innerHTML =
        `
        <form id="setting-form">
            <div class="field">
                <input name="new${upperCase}" type="${type}" required autocomplete="off" id="reg-${old}${attribute}">
                    <label for="reg-${old}${attribute}" title="New ${upperCase}" data-title="New ${upperCase}"></label>
            </div>
           
            <input id="setting-type" name="type" value="${attribute}">
                <br>
                    <input type="submit" value="Submit" class="submit-return-button">
                        <input onclick="changeGoogleContainer()" type="button" value="Back" class="submit-return-button">

                        </form>
        `
    addListenerToGoogleSetting()
}

function changeSetting(attribute) {
    let old = ""
    let type = "text"
    let upperCase = attribute.substring(0, 1).toUpperCase() + attribute.slice(1)
    if (attribute === "password") {
        old = "Old"
        type = "password"
    }
    document.querySelector('.profile-button-container').innerHTML =
        `
        <form id="setting-form">
            <div class="field">
                <input name="new${upperCase}" type="${type}" required autocomplete="off" id="reg-${old}${attribute}">
                    <label for="reg-${old}${attribute}" title="New ${upperCase}" data-title="New ${upperCase}"></label>
            </div>
            <div class="field">
                <input name="oldPassword" type="password" required autocomplete="off" id="reg-password">
                    <label for="reg-password" title="${old} Password" data-title="${old} Password"></label>
            </div>
            <input id="setting-type" name="type" value="${attribute}">
                <br>
                    <input type="submit" value="Submit" class="submit-return-button">
                        <input onclick="returnProfileContainer()" type="button" value="Back" class="submit-return-button">

                        </form>
        `
    addListenerToSetting()
}
async function changeGoogleContainer() {
    document.querySelector(".profile-button-container").innerHTML =
        `
    <div onclick="changeGoogleProfilePicture()" class="profile-button" id="change-picture">Change Profile Picture</div>
    <div onclick="changeGoogleSetting('username')" class="profile-button" id="change-nickname">Change Nickname
    </div>
    `

}
function changeGoogleProfilePicture() {
    document.querySelector('.profile-button-container').innerHTML =
        `
        <form id="setting-form">
            <div>Upload new profile picture here:</div>
            <div id="upload-picture-container">
            <input type="file" id="upload-picture-btn" name="image" hidden />
            <label id="upload-picture-label2" for="upload-picture-btn">Choose file</label>
            <label id="upload-picture-label" for="upload-picture-btn">Choose file</label>
            </div>
          

            <br>
                <input type="submit" value="Submit" class="submit-return-button">
                    <input onclick="changeGoogleContainer()" type="button" value="Back" class="submit-return-button">

                    </form>
    `
    document.querySelector("#upload-picture-btn").addEventListener('change', function () {
        document.querySelector("#upload-picture-label").textContent = this.files[0].name
    })
    addListenerToGoogleSettingPicture()
}
function changeProfilePicture() {
    document.querySelector('.profile-button-container').innerHTML =
        `
        <form id="setting-form">
            <div>Upload new profile picture here:</div>
            <div id="upload-picture-container">
            <input type="file" id="upload-picture-btn" name="image" hidden />
            <label id="upload-picture-label2" for="upload-picture-btn">Choose file</label>
            <label id="upload-picture-label" for="upload-picture-btn">Choose file</label>
            </div>
            <div class="field">
                <input name="oldPassword" type="password" required autocomplete="off" id="reg-password">
                    <label for="reg-password" title="Password" data-title="Password"></label>
            </div>

            <br>
                <input type="submit" value="Submit" class="submit-return-button">
                    <input onclick="returnProfileContainer()" type="button" value="Back" class="submit-return-button">

                    </form>
    `
    document.querySelector("#upload-picture-btn").addEventListener('change', function () {
        document.querySelector("#upload-picture-label").textContent = this.files[0].name
    })
    addListenerToSettingPicture()
}

async function addListenerToSettingPicture() {
    let setting = document.querySelector('#setting-form')
    setting.addEventListener('submit', async (event) => {
        console.log("submit")
        event.preventDefault();
        const formData = new FormData(event.target)
        const res = await fetch('/user/changePicture', {
            method: 'POST',
            body: formData
        })
        let result = await res.json();
        if (res.ok) {
            document.querySelector(".message").textContent = "Setting changed successfully!"
            document.querySelector(".message").style.color = "greenyellow"
            document.querySelector(".gradient-border").setAttribute(`id`, `success-border`)
            setTimeout(`document.querySelector(".gradient-border").setAttribute('id','')
                    returnProfileContainer()
                    getUser()
                    document.querySelector(".message").textContent = ""
                    `, 2000)
        }
        if (!res.ok) {
            document.querySelector('.message').textContent = result.message
            document.querySelector(".message").style.color = "red"
            document.querySelector(".gradient-border").setAttribute(`id`, `fail-border`)
            setTimeout(`document.querySelector(".gradient-border").setAttribute('id','')
                    document.querySelector(".message").textContent = ""
                    `, 2000)
        }
    })
}

async function addListenerToGoogleSettingPicture() {
    let setting = document.querySelector('#setting-form')
    setting.addEventListener('submit', async (event) => {
        console.log("submit")
        event.preventDefault();
        const formData = new FormData(event.target)
        const res = await fetch('/user/changeGooglePicture', {
            method: 'POST',
            body: formData
        })
        let result = await res.json();
        if (res.ok) {
            document.querySelector(".message").textContent = "Setting changed successfully!"
            document.querySelector(".message").style.color = "greenyellow"
            document.querySelector(".gradient-border").setAttribute(`id`, `success-border`)
            setTimeout(`document.querySelector(".gradient-border").setAttribute('id','')
                    changeGoogleContainer()
                    getUser()
                    document.querySelector(".message").textContent = ""
                    `, 2000)
        }
        if (!res.ok) {
            document.querySelector('.message').textContent = result.message
            document.querySelector(".message").style.color = "red"
            document.querySelector(".gradient-border").setAttribute(`id`, `fail-border`)
            setTimeout(`document.querySelector(".gradient-border").setAttribute('id','')
                    document.querySelector(".message").textContent = ""
                    `, 2000)
        }
    })
}

function ValidateEmail(inputText) {
    let mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    return mailformat.test(inputText)
}

function ValidatePassword(password) {
    const re = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
    return re.test(password);
}

function ValidateUsername(username) {
    let usernameFormat = /^[0-9a-zA-Z_.]+$/
    if (username.length > 10) {
        return false
    } else if (usernameFormat.test(username) == false) {
        return false
    }
    else { return true }


}

async function addListenerToGoogleSetting() {
    let setting = document.querySelector('#setting-form')
    setting.addEventListener('submit', async (event) => {
        event.preventDefault();
        const changeType = event.target.type.value
        const newUsername = event.target.newUsername ? event.target.newUsername.value : '';
        let usernameValidation = ValidateUsername(newUsername)

        if (usernameValidation == false) {
            alert("The username must be between 1 and 10 characters.\nPlease use only letters(a-z)(A-Z), number and special characters(._)")
        }
        const changeData = newUsername
        const res = await fetch('/user/changeGoogleSetting', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({

                "changeType": changeType,
                "changeData": changeData,
                "newUsername": newUsername,
                "usernameValidation": usernameValidation
            })
        })
        let result = await res.json();
        if (res.ok) {
            document.querySelector(".message").textContent = "Setting changed successfully!"
            document.querySelector(".message").style.color = "greenyellow"
            document.querySelector(".gradient-border").setAttribute(`id`, `success-border`)
            setTimeout(`document.querySelector(".gradient-border").setAttribute('id','')
                    changeGoogleContainer()
                    getUser()
                    document.querySelector(".message").textContent = ""
                    `, 2000)
        }
        if (!res.ok) {
            document.querySelector('.message').textContent = result.message
            document.querySelector(".message").style.color = "red"
            document.querySelector(".gradient-border").setAttribute(`id`, `fail-border`)
            setTimeout(`document.querySelector(".gradient-border").setAttribute('id','')
                    document.querySelector(".message").textContent = ""
                    `, 2000)
        }
    })

}

async function addListenerToSetting() {
    let setting = document.querySelector('#setting-form')
    setting.addEventListener('submit', async (event) => {
        event.preventDefault();
        const changeType = event.target.type.value
        const oldPassword = event.target.oldPassword.value;
        const newPassword = event.target.newPassword ? event.target.newPassword.value : '';
        const newEmail = event.target.newEmail ? event.target.newEmail.value : '';
        const newUsername = event.target.newUsername ? event.target.newUsername.value : '';
        let emailValidation = ValidateEmail(newEmail)
        let passwordValidation = ValidatePassword(newPassword)
        let usernameValidation = ValidateUsername(newUsername)
        if (newPassword !== '' && passwordValidation == false) {
            alert("Password must has\nAt least 8 characters.\nA mixture of both uppercase and lowercase letters.\nA mixture of letters and numbers.\nInclusion of at least one special character, e.g.!@#$%^&*")
        }
        if (newUsername !== '' && usernameValidation == false) {
            alert("The username must be between 1 and 10 characters.\nPlease use only letters(a-z)(A-Z), number and special characters(._)")
        }


        const changeData = newPassword + newEmail + newUsername
        const res = await fetch('/user/changeSetting', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "oldPassword": oldPassword,
                "changeType": changeType,
                "changeData": changeData,
                "newUsername": newUsername,
                "emailValidation": emailValidation,
                "passwordValidation": passwordValidation,
                "usernameValidation": usernameValidation
            })
        })
        let result = await res.json();
        if (res.ok) {
            document.querySelector(".message").textContent = "Setting changed successfully!"
            document.querySelector(".message").style.color = "greenyellow"
            document.querySelector(".gradient-border").setAttribute(`id`, `success-border`)
            setTimeout(`document.querySelector(".gradient-border").setAttribute('id','')
                    returnProfileContainer()
                    getUser()
                    document.querySelector(".message").textContent = ""
                    `, 2000)
        }
        if (!res.ok) {
            document.querySelector('.message').textContent = result.message
            document.querySelector(".message").style.color = "red"
            document.querySelector(".gradient-border").setAttribute(`id`, `fail-border`)
            setTimeout(`document.querySelector(".gradient-border").setAttribute('id','')
                    document.querySelector(".message").textContent = ""
                    `, 2000)
        }
    })
}

async function returnProfileContainer() {
    document.querySelector(".profile-button-container").innerHTML =
        `
    <div onclick="changeProfilePicture()" class="profile-button" id="change-picture">Change Profile Picture</div>
    <div onclick="changeSetting('username')" class="profile-button" id="change-nickname">Change Nickname
    </div>
    <div onclick="changeSetting('email')" class="profile-button" id="change-email">Change Email</div>
    <div onclick="changeSetting('password')" class="profile-button" id="change-password">Change Password
    </div>`
}

changeSettingButton()
addListenerToDropdown()
getUser()