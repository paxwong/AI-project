let accountContainer = document.querySelector('.account')
function loginForm() {
    accountContainer.innerHTML = `
    <form id="loginForm">
    <label>
        <input type="text" name="email" placeholder="Email" id="reg-email" />
    </label>
    <label>
        <input type="password" name="password" placeholder="Password" id="reg-password" />
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
        <div class="btn" id="login" onclick="signupForm()">Signup</div>
    </div>
    </form>
 `
}
function signupForm() {
    accountContainer.innerHTML = `
    <form id="signupForm">
    <label>
        <input type="text" name="email" placeholder="Email" id="reg-email" />
    </label>
    <label>
        <input type="text" name="username" placeholder="Username" id="reg-username" />
    </label>
    <label>
        <input type="password" name="password" placeholder="Password" id="reg-password" />
    </label>
    <!-- <label>
        Profile Picture:
        <input type="file" value="Choose File" name="UserImage" placeholder="file" class="button"
            id="userImage" />
    </label> -->
    <div class="signup">
        <div class="google-button">
            <a href="/connect/google" class="btn btn-success"><i class="fa-brands fa-google"></i></a>
        </div>
        <div>
            <input type="submit" value="Sign Up" class="btn" id="signup-button">
        </div>
    </div>
    <div>
        Already a member?
        <div class="btn" id="login" onclick="loginForm()">Login</div>

    </div>
</form>
    `
}