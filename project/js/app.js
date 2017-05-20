// Udacity lectures, forum posts by mentors 
// and a few smart individuals were key to this


var locations = [
	{title: 'Black River Park', location: {lat: -33.93452, lng: 18.471301}},
	{title: 'Groote Schuur Hospital', location: {lat: -33.941038, lng: 18.461718 }},
	{title: 'The Drawing Room', location: {lat: -33.93787, lng: 18.470578 }},
	{title: 'St James Cafe', location: {lat: -33.93818, lng: 18.46837}},
	//{title: 'Stones', location: {lat: -33.93847, lng: 18.46908}}
	{title: 'Observatory Train Station', location: {lat: -33.93848, lng: 18.472117}}
];


function initMap() {
	// Constructor creates a new map - only center and zoom are required.
	map = new google.maps.Map(document.getElementById('map'), {
	  center: {lat:-33.941038, lng: 18.46837},
	  zoom: 15
	});

	var largeInfowindow = new google.maps.InfoWindow();
	var bounds = new google.maps.LatLngBounds();

	// The following group uses the location array
	// to create an array of markers on initialize.
	for (var i = 0; i < locations.length; i++) {
		 	// Get the position from the location array.
		var position = locations[i].location;
		var title = locations[i].title;

		var marker = new google.maps.Marker({
			map: map,
		    position: position,
		    title: title,
		    animation: google.maps.Animation.DROP,
		    id: i
		});

		marker.addListener('click', function() {
        	toggleBounce(this);
         	populateInfoWindow(this, largeInfowindow);
        });

		// add marker attribute to each of the locations
		locations[i].marker = marker;

    	marker.setMap(map);

    	bounds.extend(marker.position);

	}
	
	var ViewModel = function() {
	var self = this;

    //this.areaList = ko.observableArray(areaObj);
    //this.filter = ko.observable("");
	this.locationList = ko.observableArray([]);

	locations.forEach(function(areaItem) {
		self.locationList.push(new Area(areaItem));
	});

	this.currentArea = ko.observable(this.locationList()[0]);
	// console.log(this.currentArea());
	this.areaCurrent = function() {
    locations.forEach(function(areaItem, i) {

	this.currentArea = ko.observable(this.locationList()[0]);
		self.currentArea = ko.observable(self.locationList()[i]);
		});

	};
		// next few lines adapted from John Mavraudis codepen link on 
		// the search functionality which was on the discussion forum

    self.points = ko.observableArray(locations);

    self.query = ko.observable('');

    self.search = ko.computed(function() {
	    return ko.utils.arrayFilter(self.points(), function(point) {
	    	if (point.marker) {
		      	if (point.title.toLowerCase().indexOf(self.query().toLowerCase()) >= 0) {
		      		point.marker.setVisible(true);
		      	} else {
		      		point.marker.setVisible(false);
		      	}
	        }
	    	return point.title.toLowerCase().indexOf(self.query().toLowerCase()) >= 0;
	    });
	});

	clickHandler = function(data) {
		var largeInfowindow = new google.maps.InfoWindow();
		toggleBounce(data.marker);
		populateInfoWindow(data.marker, largeInfowindow);
    };

    populateInfoWindow = function(marker, infowindow) {
	// Check to make sure the infowindow is not already opened on this marker.

		console.log(marker);

		var lat = marker.position.lat();
		var lon = marker.position.lng();
		var clientID = 'K0W3M00C2CHY2EUNV1CAGT5FCVRP5DIS5L3YNIBZQCKGYSJK';
		var secret = 'VHIV14SZU4L2VYSQW5GUV20RF1KHAYEBSEOCNE0NKNHCXE4L';

		if (infowindow.marker != marker) {
		  	infowindow.marker = marker;

		  	url = 'https://api.foursquare.com/v2/' + 'venues/search?ll=' + lat + ',' + lon +
		  	'&client_id=' + clientID + '&client_secret=' + secret + '&v=20170420&m=foursquare';

		  	$.getJSON(url, function(data) {

			  	infowindow.setContent('<div>' + data.response.venues[0].categories[0].name + '</div>');
				infowindow.open(map, marker);
		  	}).fail(function() {

			  	alert('ajax request failed check url entered');
			});


		}
	};

	// This function will loop through the listings and hide them all.
	hideMarkers = function(markers) {
	    for (var i = 0; i < markers.length; i++) {
	      markers[i].setMap(null);
	    }
	};

	toggleBounce = function(marker) {
		if (marker.getAnimation() !== null) {
			marker.setAnimation(null);
		} else {
			marker.setAnimation(google.maps.Animation.BOUNCE);
			setTimeout(function() {
				marker.setAnimation(null);
			}, 500);
		}
	};


};

  ko.applyBindings(new ViewModel());
}

googleError = function() {
			console.log('this works');
			if (typeof google === 'undefined') {
		   		alert('We were unable to load your page');
			}

	};



function gm_authFailure() {
	alert('authentication failed check api key entered');
}


function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
}


function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}



var map;
// Create a new blank array for all the listing markers.
var markers = [];

// Create placemarkers array to use in multiple functions to have control
      // over the number of places that show.
var placeMarkers = [];


// data model

var Area = function(data) {
	this.title = ko.observable(data.title);
	this.location = ko.observable(data.location);
	this.marker = ko.observable(data.marker);
};






