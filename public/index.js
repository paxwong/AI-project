let login = document.getElementById('login')
let accountContainer = document.querySelector('.account')
login.addEventListener('click', (e) => {
    e.preventDefault()
    accountContainer.innerHTML = `
    <form id="login-form">

    <label class="email">
        Email Address:
        <input type="text" name="email" placeholder="email" id="reg-email" />
    </label>
    <label class="password">
        Password:
        <input type="password" name="password" placeholder="password" id="reg-password" />
    </label>
 
    <div class="login">
        <div class="google-button">
            <a href="/connect/google" class="btn btn-success"><i class="fa-brands fa-google"></i></a>
        </div>
        <div>
            <input type="submit" value="Login" class="button" id="login-button">
        </div>
    </div>
    <div>
        Not a member?
        <button id="signup">Sign Up</button>

    </div>
    </form>
 `

})