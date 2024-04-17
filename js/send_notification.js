document.querySelector("#sendMessageButton").addEventListener("click", async () => {
	console.log("sending notification");

	const url = "https://study-buddy-api.azurewebsites.net/notification";

	const token = localStorage.getItem("token");

	if (!token) {
        return
    }

    let value = document.getElementById("message").value

	console.log(token)

    let body = {
		subject: document.getElementById("subject").value,
		body: document.getElementById("body").value,
        receiver: value,
        sender: localStorage.getItem("id")
	};

	body = JSON.stringify(body);

    console.log(body)

	const options = {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body
    }

    let response = await fetch(url, options)

    if (response.status == 201) {
        console.log("Message send successful")
		console.log(response.body)
        location.reload()
    }
    
});