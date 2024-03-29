document.querySelector("#loginButton").addEventListener("click", async () => {
	console.log("logging in user");

	const url = "https://study-buddy-api.azurewebsites.net/user/login/";

	const h1 = document.querySelector("h1");
	const p = document.querySelector("p");

	let body = {
		email: document.getElementById("loginEmail").value,	
		password: document.getElementById("loginPassword").value,
	};

	body = JSON.stringify(body);
	console.log(body);

	const options = {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body,
	};

	let response = await fetch(url, options);

	if (response.status == 200) {
        
		const data = await response.json()
		console.log(data)
		localStorage.setItem("token", data.token);
		localStorage.setItem("id", data.user._id)
		location.href = "home.html"

	} else if (response.status == 401){
        h1.innerHTML = "Something went wrong.";
		p.innerHTML = "This account has not been verified!";
    } 
    else {
		console.log(response);
		h1.innerHTML = "Something went wrong.";
		p.innerHTML = "Please check the information you entered";
	}
});