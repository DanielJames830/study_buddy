document.querySelector("#submitButton").addEventListener("click", async () => {
	var password = document.getElementById("password").value;
	var reconfirm = document.getElementById("reconfirm").value;
    var errorMessage = document.getElementById("errorMessage");

	if (password !== reconfirm) {
		document.getElementById("password").classList.add("error");
		document.getElementById("reconfirm").classList.add("error");
        errorMessage.textContent = "passwords do not match";
		return;
	} else {
        errorMessage.textContent = "";
		document.getElementById("password").classList.remove("error");
		document.getElementById("reconfirm").classList.remove("error");
	}

	console.log("creating user");

	const url = "https://study-buddy-api.azurewebsites.net/user/";

	const h1 = document.querySelector("h1");
	const p = document.querySelector("p");

	let body = {
		email: document.getElementById("email").value,
		username:
			document.getElementById("firstName").value +
			" " +
			document.getElementById("lastName").value,
		password: document.getElementById("password").value,
		school: document.getElementById("school").value,
		majors: [document.getElementById("major").value],
		ig_username: document.getElementById("ig_username").value,
		ig_password: document.getElementById("ig_password").value,
	}

	body = JSON.stringify(body);
	console.log(body);

	const options = {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body,
	};

	let response = await fetch(url, options);

	if (response.status == 201) {
		h1.innerHTML = "Thank you!";
		p.innerHTML = "Please check your email for verification";

		location.href = "../home.html"

	} else {
		console.log(response);
		h1.innerHTML = "Something went wrong.";
		p.innerHTML = "Please check the information you entered";
	}
});