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
}

chrome.runtime.onMessage.addListener(async (request, sender, response) => {
  // console.log(request);
  if (request.action == "SCRAPE_CONTENT") {
    scrapeTimetable();
  }
});
