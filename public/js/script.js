// script to enable user to toggle the show password feature on and off
const paswrdbtn = document.getElementById("showPassword");
paswrdbtn.addEventListener("click", function() {
    event.preventDefault();
    const passwordInput = document.getElementById("account_password");
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        paswrdbtn.innerHTML = "Hide Password";
    } else {
        passwordInput.type = "password";
        paswrdbtn.innerHTML = "Show Password";
    }
})