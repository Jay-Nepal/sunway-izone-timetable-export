// Initializing variable to store class timings
let classTimings = [];

// The main function called when the user clicks on extract
function scrapeTimetable() {
  // The start date of the semester is scraped through the code below
  const semesterStartDate = document
    .getElementById("infoHeader")
    .getElementsByTagName("tr")[3]
    .getElementsByTagName("td")[1]
    .textContent.split(" ")[0];
  console.log(semesterStartDate);

  // Extracting all td elements from the document
  var elements = document.getElementsByTagName("td");

  for (var i = 0; i < elements.length; i++) {
    var mystr = elements[i].innerText || elements[i].textContent;

    // Checking if the td element contains information about class timings
    if (mystr.includes("Time")) {
      const lines = mystr.split("\n").map((line) => line.trim());

      // Initialize variables to store class details
      let startTime = "";
      let endTime = "";
      let course = "";
      let grouping = "";
      let venue = "";
      let lecturer = "";

      // Iterate through the lines and extract information
      for (const line of lines) {
        if (line.startsWith("Time")) {
          // Split the string into an array using ' - ' as the separator
          const timeParts = line.split(" - ");

          // Extract the start time and end time
          startTime = timeParts[0].replace("Time : ", "").trim();
          endTime = timeParts[1].trim();
        } else if (line.includes("(")) {
          course = line.trim();
        } else if (line.startsWith("Grouping")) {
          grouping = line.split(":")[1].trim();
        } else if (line.startsWith("Venue")) {
          venue = line.split(":")[1].trim() || "Online";
        } else if (line.startsWith("Lecturer")) {
          lecturer = line.split(":")[1].trim();
        }
      }

      // Output the extracted information
      console.log("NEW CLASS BELOW");
      console.log("Start Time:", startTime);
      console.log("End Time:", endTime);
      console.log("Course:", course);
      console.log("Grouping:", grouping);
      console.log("Venue:", venue);
      console.log("Lecturer:", lecturer);
      console.log("------");
    }
  }

  // Generate ICS content and create a download link
  const icsContent = generateICS();
  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const fileName = "time-table.ics";

  // Create a link element to trigger the download
  const link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.download = fileName;

  // Append link to the body, trigger click, and remove link
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// The function generates ICS file with the schedule
function generateICS() {
  const now = new Date();
  const startDate = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000);

  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:Course title and class type goes here
DESCRIPTION:Grouping goes here
LOCATION:Venue goes here
DTSTART:Start date and time here
DTEND:End date and time here
UID:${generateUID()}
SEQUENCE:0
STATUS:CONFIRMED
TRANSP:OPAQUE
BEGIN:VALARM
TRIGGER:-PT15M
DESCRIPTION:Reminder
ACTION:DISPLAY
END:VALARM
END:VEVENT
END:VCALENDAR`;

  return icsContent;
}

// Function to format date to be used in the ICS file
function formatDate(date) {
  return date.toISOString().replace(/-|:|\.\d+/g, "");
}

// Function to generate a unique ID for the ICS event
function generateUID() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Adding a listener for messages from the Chrome extension
chrome.runtime.onMessage.addListener(async (request, sender, response) => {
  if (request.action == "SCRAPE_CONTENT") {
    // Trigger the timetable scraping function
    scrapeTimetable();
  }
});
