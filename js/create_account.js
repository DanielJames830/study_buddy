document.querySelector("#submitButton").addEventListener("click", async () => {
    console.log('creating user')

    const url = "https://study-buddy-api.azurewebsites.net/user/"

    const h1 = document.querySelector("h1")
    const p = document.querySelector("p")

    let body = {
        "email": document.getElementById('email').value,
        "username":  document.getElementById('name').value,
        "password": document.getElementById('password').value,
        "school":  document.getElementById('college').value,
        "majors": [
            document.getElementById('major').value
        ],
    }
    body = JSON.stringify(body)
    const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body
    }

    let response = await fetch(url, options)

    if (response.status == 201) {
        h1.innerHTML = 'Thank you!'
        p.innerHTML = 'Please check your email for verification'
    }

    else {
        console.log(response)
        h1.innerHTML = "Something went wrong."
        p.innerHTML = "Please check the information you entered"
    }
})