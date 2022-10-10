let accountContainer = document.querySelector('.account')
function loginForm() {
    accountContainer.innerHTML = `
    <div class="title" id="title">Mang<div class="wave">A.I.</div>
    </div>
    <div class="header">Welcome</div>
    <form id="loginForm">


                <div class="field">
                    <input type="text" required autocomplete="off" id="reg-email">
                    <label for="reg-email" title="Email" data-title="Email"></label>
                </div>
                <div class="field">
                    <input type="password" required autocomplete="off" id="reg-password">
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
 `
}
function signupForm() {
    accountContainer.innerHTML = `
    <div class="title" id="title">Mang<div class="wave">A.I.</div>
    </div>
    <div class="header">Welcome</div>
    <form id="signupForm">
    <div class="field">
    <input type="text" required autocomplete="off" id="reg-username">
    <label for="reg-username" title="Username" data-title="Username"></label>
</div>
    <div class="field">
    <input type="text" required autocomplete="off" id="reg-email">
    <label for="reg-email" title="Email" data-title="Email"></label>
</div>

<div class="field">
    <input type="password" required autocomplete="off" id="reg-password">
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
    `
}