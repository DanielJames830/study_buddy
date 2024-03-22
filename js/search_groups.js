let skip = 0;
import { showModal } from "./modal.js";

document
	.getElementById("studyGroupForm")
	.addEventListener("submit", async function (event) {
		event.preventDefault();
		skip = 0;

		await fetchStudyGroups();
	});

document
	.getElementById("prevButton")
	.addEventListener("click", async function (event) {
		event.preventDefault();

		const form = document.getElementById("studyGroupForm");
		const formData = new FormData(form);
		skip = Number(skip) - Number(formData.get("skip"));
		if (skip < 0) {
			skip = 0;
		}
		console.log(skip);
		await fetchStudyGroups();
	});

document
	.getElementById("nextButton")
	.addEventListener("click", async function (event) {
		event.preventDefault();
		const form = document.getElementById("studyGroupForm");
		const formData = new FormData(form);
		skip = Number(skip) + Number(formData.get("skip"));
		console.log(skip);
		await fetchStudyGroups();
	});

async function fetchStudyGroups() {
	const form = document.getElementById("studyGroupForm");
	const formData = new FormData(form);
	const searchParams = new URLSearchParams();

	// Iterate through form data and add non-empty values to searchParams
	formData.forEach((value, key) => {
		if (value !== "" && key !== "skip") {
			searchParams.append(key, value);
		}

		searchParams.append("skip", skip);
	});

	const token = localStorage.getItem("token");

	if (!token) {
		h1.innerHTML = "Something went wrong.";

		console.log("No token found");
		return;
	}
	const url = `https://study-buddy-api.azurewebsites.net/studygroups?${searchParams}`;
	console.log(url);
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
		displayResults(data);
	} catch (error) {
		console.error("Error:", error);
	}
}

function displayResults(results) {
	const resultsContainer = document.getElementById("results");
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


var span = document.getElementsByClassName("close")[0];

span.onclick = function () {
	const modal = document.getElementById("myModal");
	modal.style.display = "none";
};

window.onclick = function (event) {
	const modal = document.getElementById("myModal");
	if (event.target == modal) {
		modal.style.display = "none";
	}
};

document
	.querySelector("#saveGroupButton")
	.addEventListener("click", async () => {
		const modal = document.getElementById("myModal");
		const id = modal.value;

		const url = `https://study-buddy-api.azurewebsites.net/studygroup/${id}`;
		console.log(url);
		const token = localStorage.getItem("token");

		if (!token) {
			console.log("No token found");
			return;
		}

		const form = modal.querySelector("#edit-form");

		let body = {
			name: form.querySelector("#groupName").value,
			is_public: form.querySelector("#isPublic").checked,
			description: form.querySelector("#description").value,
			school: form.querySelector("#school").value,
			course_number: form.querySelector("#courseNumber").value,
			max_participants: form.querySelector("#maxParticipants").value,
			start_date: form.querySelector("#start").value,
			end_date: form.querySelector("#end").value,
			meeting_times: [
				...meetingTimesArray.map((x) => {
					return {
						day: x.querySelector("#day_" + meetingTimesArray.indexOf(x)).value,
						time: x.querySelector("#time_" + meetingTimesArray.indexOf(x))
							.value,
						location: x.querySelector(
							"#location_" + meetingTimesArray.indexOf(x)
						).value,
					};
				}),
			],
		};

		body = JSON.stringify(body);

		console.log(body);

		const options = {
			method: "PATCH",
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
			body,
		};

		let response = await fetch(url, options);

		location.reload();

		if (response.status == 200) {
			console.log("Group creation successful");
		} else {
			console.log("Something went wrong.");
		}
	});


const button = document.querySelector("#addMeetingTimeEdit")
console.log(button)
button.addEventListener("click", (ev) => {

    const form = ev.currentTarget.parentNode
    console.log(form)
	const meetingTimesDiv = form.querySelector("#meetingTimes");
	const meetingTimeTemplate = form.querySelector("#meetingTimeTemplate");

	const clonedMeetingTime = meetingTimeTemplate.cloneNode(true);
	clonedMeetingTime.style.display = "block";
	meetingTimesDiv.appendChild(clonedMeetingTime);

	const inputElements = clonedMeetingTime.querySelectorAll("input");
	const selectorElements = clonedMeetingTime.querySelectorAll("select");

	inputElements.forEach((input, index) => {
		const currentId = input.id;
		const newId = currentId + "_" + meetingTimesArray.length;
		input.id = newId;
	});
	selectorElements.forEach((input, index) => {
		const currentId = input.id;
		const newId = currentId + "_" + meetingTimesArray.length;
		input.id = newId;
	});

	meetingTimesArray.push(clonedMeetingTime);
});
