// Get input values
// Calculate carbon
// Save data to database
if (!distance || !electricity || !plastic) {
    alert("Please fill all fields");
    return;
}
function calculateCarbon() {
    let transport = document.querySelectorAll("select")[0].value;
    let distance = document.querySelectorAll("input")[0].value;
    let electricity = document.querySelectorAll("input")[1].value;
    let plastic = document.querySelectorAll("input")[2].value;
    let food = document.querySelectorAll("select")[1].value;

    let transportFactor = {
        Car: 0.21,
        Bus: 0.10,
        Train: 0.05,
        Bike: 0
    };

    let foodFactor = food === "Veg" ? 2 : 5;

    let total =
        (distance * transportFactor[transport]) +
        (electricity * 0.85) +
        (plastic * 0.05) +
        foodFactor;

   fetch("http://localhost:5000/save-activity", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        transport,
        distance,
        electricity,
        food,
        plastic,
        totalCarbon: total
    })
})
.then(res => res.text())
.then(data => {
    alert(data);
})
.catch(error => {
    console.log(error);
    alert("Something went wrong");
});
function loadDashboardData() {
    fetch("http://localhost:5000/get-latest-activity")
    .then(res => res.json())
    .then(data => {
        document.getElementById("carbonResult").innerText =
            data.totalCarbon + " kg CO₂";

        document.getElementById("transportData").innerText =
            "Transport: " + data.transport;

        document.getElementById("electricityData").innerText =
            "Electricity: " + data.electricity;

        document.getElementById("foodData").innerText =
            "Food: " + data.food;

        document.getElementById("plasticData").innerText =
            "Plastic: " + data.plastic;
    });
}

function loadAISuggestions() {
    fetch("http://localhost:5000/ai-suggestion")
    .then(res => res.json())
    .then(data => {
        let box = document.getElementById("aiSuggestions");

        box.innerHTML = "";

        data.forEach(item => {
            box.innerHTML += "<p>• " + item + "</p>";
        });
    });
}
function loadCharts() {
    const weeklyCtx = document.getElementById("weeklyChart");

    if (weeklyCtx) {
        new Chart(weeklyCtx, {
            type: "bar",
            data: {
                labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
                datasets: [{
                    label: "CO₂ Emission",
                    data: [8, 6, 7, 5, 4]
                }]
            }
        });
    }

    const categoryCtx = document.getElementById("categoryChart");

    if (categoryCtx) {
        new Chart(categoryCtx, {
            type: "pie",
            data: {
                labels: ["Transport", "Electricity", "Food", "Plastic"],
                datasets: [{
                    data: [40, 30, 20, 10]
                }]
            }
        });
    }
}

loadCharts();

