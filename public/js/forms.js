let accountContainer = document.querySelector('.account')
function loginForm() {
    accountContainer.innerHTML = `
    <div class="title" id="title">Mang<div class="wave">A.I.</div>
    </div>
    <div class="header">Welcome</div>
    <form id="loginForm">


                <div class="field">
                    <input name="email" type="text" required autocomplete="off" id="reg-email">
                    <label for="reg-email" title="Email" data-title="Email"></label>
                </div>
                <div class="field">
                    <input name="password" type="password" required autocomplete="off" id="reg-password">
                    <label for="reg-password" title="Password" data-title="Password"></label>
                </div>

                <div class="google-button">
                <a href="/connect/google" class="google"><i class="fa-brands fa-google"></i></a>
            </div>
          
                <input type="submit" value="Login" class="btn" id="login-button">

                <br>
                <div>
                    Not a member?
                </div>
                <br>
                <div class="" id="login" onclick="signupForm()">Signup</div>
            </form>
            <div class="message"></div>

 `
    login()
}
function signupForm() {
    accountContainer.innerHTML =
        `
    <div class="title" id="title">Mang<div class="wave">A.I.</div>
    </div>
    <div class="header">Welcome</div>
    <form id="signupForm">
    <div class="field">
    <input name="username" type="text" required autocomplete="off" id="reg-username">
    <label for="reg-username" title="Username" data-title="Username"></label>
</div>
    <div class="field">
    <input name="email" type="text" required autocomplete="off" id="reg-email">
    <label for="reg-email" title="Email" data-title="Email"></label>
</div>

<div class="field">
    <input name="password" type="password" required autocomplete="off" id="reg-password">
    <label for="reg-password" title="Password" data-title="Password"></label>
</div>

  
<div class="google-button">
<a href="/connect/google" class="google"><i class="fa-brands fa-google"></i></a>
</div>

            <input type="submit" value="Sign Up" class="btn" id="signup-button">
        
   <br>
    <div>
        Already a member?
    </div>
    <br>
    <div class="" id="login" onclick="loginForm()">Login</div>
</form>
<div class="message"></div>
    `
    register()

}

function register() {
    const registerButton = document.querySelector('#signupForm');
    registerButton.addEventListener('submit', async function (event) {
        event.preventDefault();
        const username = event.target.username.value;
        const email = event.target.email.value;
        const password = event.target.password.value;
        const res = await fetch('/user/register', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username, email, password
            })
        })
        let result = await res.json()
        if (res.ok) {
            successRegister()
        }
        if (res.error) {
            failRegister()
        }
    })
}

function login() {
    const loginButton = document.querySelector('#loginForm');
    loginButton.addEventListener('submit', async function (event) {
        event.preventDefault();
        const email = event.target.email.value;
        const password = event.target.password.value;
        const res = await fetch('/user/login', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email, password
            })
        })
        let result = await res.json()
        if (res.ok) {
            successLogin()
        }
        if (res.error) {
            failLogin()
        }
    })
}
login()

function successLogin() {
    document.querySelector(".message").textContent = "You have logged in!"
    document.querySelector(".message").style.color = "greenyellow"
    document.querySelector(".gradient-border").setAttribute(`id`, `success-border`)
    document.querySelector(".cursor").parentNode.removeChild(document.querySelector(".cursor"))
    setTimeout(`window.location.assign("/main.html")`, 3000)
    document.querySelector(".nothing").classList.toggle("centered-cursor")
    document.querySelector(".border").classList.toggle("cursor-border")
}

function successRegister() {
    document.querySelector(".message").textContent = "Account created successfully!"
    document.querySelector(".message").style.color = "greenyellow"
    document.querySelector(".gradient-border").setAttribute(`id`, `success-border`)
    setTimeout(`document.querySelector(".gradient-border").setAttribute('id','')
                loginForm()
    `, 3000)
}

function failLogin() {
    document.querySelector(".message").textContent = result.message
    document.querySelector(".message").style.color = "red"
    document.querySelector(".gradient-border").setAttribute(`id`, `fail-border`)
    setTimeout(`document.querySelector(".gradient-border").setAttribute('id','')
                    document.querySelector(".message").textContent = ''
        `, 3000)
}

function failRegister() {
    document.querySelector(".message").textContent = result.message
    document.querySelector(".message").style.color = "red"
    document.querySelector(".gradient-border").setAttribute(`id`, `fail-border`)
    setTimeout(`document.querySelector(".gradient-border").setAttribute('id','')
                document.querySelector(".message").textContent = ''
    `, 3000)
}