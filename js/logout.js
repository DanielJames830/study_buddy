document.querySelector("#logoutButton").addEventListener("click", async () => {
	console.log("logging out user");

	const url = "https://study-buddy-api.azurewebsites.net/user/logout/";

	const h1 = document.querySelector("h1");
	const p = document.querySelector("p");

	const token = localStorage.getItem("token");

	if (!token) {
        h1.innerHTML = "Something went wrong."

        console.log("No token found")
        return
    }

	console.log(token)

	const options = {
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    let response = await fetch(url, options)

    if (response.status == 200) {
        console.log("Logout successful")
        localStorage.removeItem("token", token);
    }
    else {
        h1.innerHTML = "Something went wrong."
    }
});