/* -------------------------------------------
 Challange : Front end challange
 Created by : Imad El Mendoub
 ---------------------------------------------*/

var past = new Date(); // Today Date variable
past.setDate(past.getDate() - 30); // Today Date minus 30 days
var dateString = past.toISOString().toString().split("T")[0], // Converting Date to string for api url
    pageNum = 1; // Page number

// On document load
$(function () {
    loading(); // Show loading screen
    loadPage(pageNum); // Load first page
});

// On window scroll
window.onscroll = function () {
    var pageHeight = document.documentElement.offsetHeight, // Get documt height
        windowHeight = window.innerHeight, // Get window height
        scrollPosition = window.scrollY || window.pageYOffset || document.body.scrollTop + (document.documentElement && document.documentElement.scrollTop || 0); // Calculate scroll position

    if (pageHeight <= windowHeight + scrollPosition) { // Checking if page height less than window height + scroll position
        loading(); // Show loading screen
        loadPage(pageNum++); // Getting next page
    }
};

// Function for Getting a page from api
function loadPage(pageNum) {
    $.ajax({
        url: "https://api.github.com/search/repositories?q=created:%3E" + dateString + "&sort=stars&order=desc&per_page=100&page=" + pageNum,
        type: "GET",
        success: function (data) { // On success respond
            // Looping through data items
            for (i = 0; i < data.items.length; i++) {
                // Html variable
                var htmlString = '',
                    // Variables from api
                    ownerName = data.items[i].owner.login,
                    avatar = data.items[i].owner.avatar_url,
                    ripoName = data.items[i].name,
                    description = data.items[i].description,
                    nbStars = data.items[i].stargazers_count,
                    nbIssues = data.items[i].open_issues_count,
                    createdDate = new Date(data.items[i].created_at),
                    todayDate = new Date();
                todayDate.toISOString();
                var timeDiff = Math.abs(todayDate.getTime() - createdDate.getTime()),
                    timeInterval = Math.ceil(timeDiff / (1000 * 3600 * 24)),
                    nbSK = (parseFloat(nbStars) / 1000).toFixed(1),
                    nbIK = (parseFloat(nbIssues) / 1000).toFixed(1);

                // Html template for the card
                htmlString = '<div class="card">';
                htmlString += '<div><img src="' + avatar + '" class="avatar" id="image"> </div>';
                htmlString += '<div class="info">';
                htmlString += '<div class="info-personell">';
                htmlString += '<strong>' + ripoName + '</strong>';
                htmlString += '<p>' + description + '</p>';
                htmlString += '</div>';
                htmlString += '<div class="project-info">';
                htmlString += '<div class="nb-info"> Stars: ' + nbSK + 'K </div>';
                htmlString += '<div class="nb-info"> Issus: ' + nbIK + ' K </div>';
                htmlString += '<div class="submitted-text"> Submitted ' + timeInterval + ' day ago by : <strong>' + ownerName + '</strong></div>';
                htmlString += ' </div>';
                htmlString += '</div>';

                // Appending the card to the page
                $('#container').append(htmlString);
            }
        },
        error: function (jqHXR, status, error) { // On error respond
            if (jqHXR.status === 422) { // Checking if the error is 422 (No more items)
                $(".message").show(); // Showing "No more items" message
            }
        }
    })
};

// Loading screen function
function loading() {
    $(".preload").fadeIn(2000, function () { // Show the loading
        $(".preload").fadeOut(1000); // Hide the loading
    });
}
