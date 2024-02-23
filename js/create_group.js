document.querySelector("#createGroupButton").addEventListener("click", async () => {
	console.log("creating study group");

	const url = "https://study-buddy-api.azurewebsites.net/user/studygroup";

	const h1 = document.querySelector("h1");
	const p = document.querySelector("p");

	const token = localStorage.getItem("token");

	if (!token) {
        h1.innerHTML = "Something went wrong."

        console.log("No token found")
        return
    }

	console.log(token)

    let body = {
		name: document.getElementById("groupName").value,
		is_public: document.getElementById("isPublic").value,
        description: document.getElementById("description").value,
		school: document.getElementById("school").value,
        course_number: document.getElementById('courseNumber').value,
        max_participants: document.getElementById('maxParticipants').value,
        participants: [],
        start_date: "2011-10-05T14:48:00.000Z",
        end_date: "2011-10-05T14:48:00.000Z",
		meeting_times: [
            {
               day: document.getElementById('dayOfWeek').value,
               time: document.getElementById('timeOfDay').value + ":00",
               location: document.getElementById('location').value
            }
        ],
	};

	body = JSON.stringify(body);

	const options = {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`
        },
        body
    }

    let response = await fetch(url, options)

    if (response.status == 200) {
        console.log("Logout successful")
        localStorage.removeItem("token", token);
		location.href = "index.html";
    }
    else {
        h1.innerHTML = "Something went wrong."
    }
});