import { showModal } from "./modal.js";

async function fetchOwnedStudyGroups() {

	const token = localStorage.getItem("token");

	if (!token) {
		h1.innerHTML = "Something went wrong.";

		console.log("No token found");
		return;
	}
	const url = `https://study-buddy-api.azurewebsites.net/studygroups?mine=true`;
	try {
		const response = await fetch(url, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`, // Replace <token> with your actual token
			},
		});

		if (!response.ok) {
			throw new Error("Failed to fetch study groups");
		}

		const data = await response.json();
		displayResults(data, "owned-groups");
	} catch (error) {
		console.error("Error:", error);
	}
}
async function fetchJoinedStudyGroups() {

	const token = localStorage.getItem("token");

	if (!token) {
		h1.innerHTML = "Something went wrong.";

		console.log("No token found");
		return;
	}
	const url = `https://study-buddy-api.azurewebsites.net/studygroups`;
	try {
		const response = await fetch(url, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`, // Replace <token> with your actual token
			},
		});

		if (!response.ok) {
			throw new Error("Failed to fetch study groups");
		}

		const data = await response.json();

		var filteredArray = data.filter(function(obj) {
			return obj.participants.includes(localStorage.getItem("id"));
		});
		
		displayResults(filteredArray, "joined-groups");
	} catch (error) {
		console.error("Error:", error);
	}
}

function displayResults(results, group) {
	console.log('my results are being called')
	const resultsContainer = document.getElementById(group);
	const userId = localStorage.getItem("id");
	resultsContainer.innerHTML = "";

	if (results.length === 0) {
		resultsContainer.textContent = "No study groups found.";
		return;
	}

	const div = document.createElement("div");
	results.forEach((studyGroup) => {
		const template = document.getElementById("resultCardTemplate");
		const clone = document.importNode(template.content, true);

		const nameHeading = clone.querySelector("[data-name]");
		nameHeading.textContent = studyGroup.name;

		const dateRange = clone.querySelector("[data-date-range]");
		const startDate = new Date(Date.parse(studyGroup.start_date)).toLocaleDateString('en-US', {timeZone: 'UTC'});
		const endDate = new Date(studyGroup.end_date).toLocaleDateString('en-US', {timeZone: 'UTC'});
		dateRange.textContent = `${startDate} - ${endDate}`;

		const descriptionPara = clone.querySelector("[data-description]");
		descriptionPara.textContent = studyGroup.description;

		const card = clone.querySelector(".resultCard");
		card.addEventListener("click", function () {
			showModal(studyGroup);
		});

		resultsContainer.appendChild(clone);
	});

	resultsContainer.appendChild(div);
}



fetchOwnedStudyGroups();
fetchJoinedStudyGroups();