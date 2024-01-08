// function myFunction() {
//   var totalnumberOfTable = document.getElementsByTagName("span").length;
//   for (let y = 0; y < totalnumberOfTable; y++) {
//     var searchString = "Venue";
//     var elements = document.getElementsByTagName("span");
//     for (var i = 0; i < elements.length; i++) {
//       if (elements[y].innerHTML.indexOf(searchString) !== -1) {
//         var mystr = elements[y].innerText || elements[y].textContent;

//         console.log(mystr);
//         break;
//       }
//     }
//   }
// }

function scrapeTimetable() {
  var totalnumberOfTable = document.getElementsByTagName("span").length;
  for (let y = 0; y < totalnumberOfTable; y++) {
    var elements = document.getElementsByTagName("span");
    for (var i = 0; i < elements.length; i++) {
      var mystr = elements[y].innerText || elements[y].textContent;
      console.log(mystr);
      break;
    }
  }

  const icsContent = generateICS();
  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const fileName = "test-event.ics";

  const link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.download = fileName;

  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
}

function generateICS() {
  const now = new Date();
  const startDate = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 1 day from now
  const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000); // 2 hours later

  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:Test Event
DESCRIPTION:This is a test event for the browser extension.
LOCATION:Online
DTSTART:${formatDate(startDate)}
DTEND:${formatDate(endDate)}
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

function formatDate(date) {
  return date.toISOString().replace(/-|:|\.\d+/g, "");
}

function generateUID() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

chrome.runtime.onMessage.addListener(async (request, sender, response) => {
  // console.log(request);
  if (request.action == "SCRAPE_CONTENT") {
    scrapeTimetable();
  }
});
