let meetingTimesArray = [];
export function showModal(studyGroup) {
	const userId = localStorage.getItem("id");

	const modal = document.getElementById("myModal");
	modal.value = studyGroup._id;

	if (studyGroup.participants.includes(userId)) {
		const button = modal.querySelector("#join-button");
		button.innerHTML = "Leave";
		button.value = "remove=true";
		button.style.display = "block";
	} else if (studyGroup.owner === userId) {
		const button = modal.querySelector("#join-button");
		button.style.display = "none";
	} else {
		const button = modal.querySelector("#join-button");
		button.innerHTML = "Join";
		button.value = "add=true";
		button.style.display = "block";
	}

	if (userId == studyGroup.owner) {
		const button = modal.querySelector("#edit-button");
		button.style.display = "block";

		button.addEventListener("click", function () {
			meetingTimesArray = [];
			modal.querySelector("#read-only").style.display = "none";
			const form = modal.querySelector("#edit-form");

			form.querySelector("#meetingTimes").innerHTML = "";

			form.style.display = "block";

			const nameField = form.querySelector("#groupName");
			nameField.value = studyGroup.name;

			const isPublicField = form.querySelector("#isPublic");
			isPublicField.checked = studyGroup.is_public;

			const maxParticipants = form.querySelector("#maxParticipants");
			maxParticipants.value = studyGroup.max_participants;

			const description = form.querySelector("#description");
			description.value = studyGroup.description;

			const startDate = form.querySelector("#start");
			startDate.value = studyGroup.start_date.substring(0, 10);

			const endDate = form.querySelector("#end");
			endDate.value = studyGroup.end_date.substring(0, 10);

			const schoolField = form.querySelector("#school");
			schoolField.value = studyGroup.school;

			const courseNumberField = form.querySelector("#courseNumber");
			courseNumberField.value = studyGroup.course_number;

			studyGroup.meeting_times.forEach((x) => {
				const meetingTimesDiv = form.querySelector("#meetingTimes");
				const meetingTimeTemplate = form.querySelector("#meetingTimeTemplate");

				const clonedMeetingTime = meetingTimeTemplate.cloneNode(true);
				clonedMeetingTime.style.display = "block";
				meetingTimesDiv.appendChild(clonedMeetingTime);

				const inputElements = clonedMeetingTime.querySelectorAll("input");
				const selectorElements = clonedMeetingTime.querySelectorAll("select");

				const button = clonedMeetingTime.querySelector("#delete");
				button.value = meetingTimesArray.length;

				function deleteMeetingTime(index) {
					const list = form.querySelector("#meetingTimes");
					list.removeChild(list.children[index]);
					meetingTimesArray.splice(index, 1);
				}

				button.onclick = function () {
					deleteMeetingTime(button.value);
				};

				inputElements.forEach((input, index) => {
					const currentId = input.id;
					const newId = currentId + "_" + meetingTimesArray.length;
					input.id = newId;
					input.value = x[currentId];
				});
				selectorElements.forEach((input, index) => {
					const currentId = input.id;
					const newId = currentId + "_" + meetingTimesArray.length;
					input.id = newId;
					input.value = x[currentId];
				});

				meetingTimesArray.push(clonedMeetingTime);
			});
		});
	} else {
		modal.querySelector("#edit-button").style.display = "none";
	}

	modal.querySelector("#read-only").style.display = "block";
	modal.querySelector("#edit-form").style.display = "none";
	modal.querySelector("#read-only-times").innerHTML = "";
	const nameHeading = modal.querySelector("[data-name]");
	nameHeading.textContent = studyGroup.name;

	const dateRange = modal.querySelector("[data-date-range]");
	const startDate = new Date(studyGroup.start_date).toLocaleDateString(
		"en-US",
		{ timeZone: "UTC" }
	);
	const endDate = new Date(studyGroup.end_date).toLocaleDateString("en-US", {
		timeZone: "UTC",
	});
	dateRange.textContent = `${startDate} - ${endDate}`;

	const descriptionPara = modal.querySelector("[data-description]");
	descriptionPara.textContent = studyGroup.description;

	const maxParticipants = modal.querySelector("[data-max-participants]");
	maxParticipants.textContent =
		"Max Participants: " + studyGroup.max_participants;

	studyGroup.meeting_times.forEach((meetingTime) => {
		const template = modal.querySelector("#meetingTimeDisplayTemplate");
		const clone = document.importNode(template.content, true);
		const day = clone.querySelector("[data-day]");
		const time = clone.querySelector("[data-time]");
		const location = clone.querySelector("[data-location]");

		day.textContent = meetingTime.day + " @ ";
		time.textContent = meetingTime.time;
		location.textContent = meetingTime.location;

		modal.querySelector("#read-only-times").appendChild(clone);
	});

	modal.style.display = "block";
}

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

		const options = {
			method: "PATCH",
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
			body,
		};

		console.log(body);

		let response = await fetch(url, options);

		location.reload();

		if (response.status == 200) {
			console.log("Group creation successful");
		} else {
			console.log("Something went wrong.");
		}
	});

const button = document.querySelector("#addMeetingTimeEdit");
console.log(button);
button.addEventListener("click", (ev) => {
	const form = ev.currentTarget.parentNode;
	console.log(form);
	const meetingTimesDiv = form.querySelector("#meetingTimes");
	const meetingTimeTemplate = form.querySelector("#meetingTimeTemplate");

	const clonedMeetingTime = meetingTimeTemplate.cloneNode(true);
	clonedMeetingTime.style.display = "block";
	meetingTimesDiv.appendChild(clonedMeetingTime);

	const button = clonedMeetingTime.querySelector("#delete");
	button.value = meetingTimesArray.length;

	function deleteMeetingTime(index) {
		const list = form.querySelector("#meetingTimes");
		list.removeChild(list.children[index]);
		meetingTimesArray.splice(index, 1);
	}

	button.onclick = function () {
		deleteMeetingTime(button.value);
	};

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
