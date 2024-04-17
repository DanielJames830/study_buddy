async function fetchNotifications() {

	const token = localStorage.getItem("token");

	if (!token) {
		return;
	}
	const url = `https://study-buddy-api.azurewebsites.net/notifications/${localStorage.getItem("id")}`;
    console.log(url)
	try {
		const response = await fetch(url, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		});

		if (!response.ok) {
			throw new Error("Failed to fetch notifications");
		}

		const data = await response.json();
		displayResults(data, "my_notifications");
	} catch (error) {
		console.error("Error:", error);
	}
}

function displayResults(results, group) {
	const resultsContainer = document.getElementById(group);
	const userId = localStorage.getItem("id");
	resultsContainer.innerHTML = "";

	if (results.length === 0) {
		resultsContainer.textContent = "No notifications";
		return;
	}

	const div = document.createElement("div");
	results.forEach((notification) => {
		const template = document.getElementById("notificationCardTemplate");
		const clone = document.importNode(template.content, true);

		const nameHeading = clone.querySelector("[data-sender]");
		nameHeading.textContent = notification.sender ?? 'No sender';

		const subject = clone.querySelector("[data-subject]");
		subject.textContent = `${notification.subject}"`;

        const body = clone.querySelector("[data-body]");
		body.textContent =  `${notification.body}"`;

		resultsContainer.appendChild(clone);
	});

	resultsContainer.appendChild(div);
}

fetchNotifications();