
var map = null;
var newvm;

var locations = [];
var timevar = setTimeout(function(){
	console.log("Couldnt fetch location list!!,Please Try again!!");
},2000);

var locFunc = function(){
	$.ajax({
		url:'json/location.json',
		dataType:'json',
		success:function(res){
			clearTimeout(timevar);
			locations=res;
			newvm = new ViewModel();
			ko.applyBindings(newvm);
		},
		error: function (err) {
			console.error(err);
		}
	});
};


locFunc();

// @description object respresent a marker on the map.
// @constructor-
// @param {string} loc- represent a element in location list

var Mark = function (loc) {
	var self = this;
	self.title = loc.title;
	self.latLng = loc.location;
	self.icon = loc.icon;
	self.visible = ko.observable(loc.visible);
	self.favourite = ko.observable(loc.favourite);
	self.filter = ko.observable(loc.filter);

};
var markers = [];

//knockout viewModel
//Containes set of observable elemnet and array
//viewModel object is databinded with the contents on the html page
var ViewModel = function () {
	var self = this;
	self.selected_marker = ko.observable(null);
	self.marks = ko.observableArray($.map(locations, function (loc) {
		return new Mark(loc);
	}));
	self.wiki = function () {
		var query = self.selected_marker().title.split(' ').join('+');
		var wikiRequestTimeout = setTimeout(function () {
			self.wikiData = [{url:'',title:'',content:'wiki links could not be fetched'}];
		}, 8000);

		$.ajax({
			url: 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' + query + '&format=json&callback=?',
			dataType: 'jsonp',
			success: function (response) {
				clearTimeout(wikiRequestTimeout);
				if (response[1].length === 0) {
					self.wikiData([{url:'',title:'',content:'No Articles Available'}]);
				} else {
					var titles = response[1];
					var urls = response[3];
					var contents = response[2];
					var wikiLink =[];
					titles.forEach(function (title, id) {
						wikiLink.push({url:urls[id],title:title,content:contents[id]});
					});
					self.wikiData(wikiLink);
				}
			},
			error: function (err) {
				console.error('An error has occurred');
			}
		});
	};

	self.wikiData = ko.observableArray([{url:'',title:'',content:'No Articles Available'}]);
	//is true when an element is selected
	self.selected = ko.observable(false);
	//when an user clicks on an element in the list this is run
	self.enableCurrent = function (loc) {
		self.selected_marker(loc);
		self.selected(true);
		for (var i = 0; i < self.marks().length; i++) {
			if (self.marks()[i] === self.selected_marker()) {
				self.marks()[i].visible(true);
				continue;
			}
			self.marks()[i].visible(false);

		}
		var bounds = new google.maps.LatLngBounds();
		createMarkers(map, bounds,false);
		map.fitBounds(bounds);
		map.setZoom(14);
		self.wiki();

	};

	//this resets the zoom level and displays all the initial markers
	self.getInitial = function () {
		for (var i = 0; i < self.marks().length; i++) {
			self.marks()[i].visible(true);
		}
		self.selected(false);
		var bounds = new google.maps.LatLngBounds();
		createMarkers(map, bounds,true);
		map.fitBounds(bounds);

	};

	//filter property used to filter marker based on user search option
	self.filteredMarks = ko.computed(function () {
		return ko.utils.arrayFilter(self.marks(), function (loc) {
			return loc.filter();
		});
	}, self);


	self.searchStr = ko.observable('');
	//flters the list availlable if the user has not yet selected a
	//destination else resets the filter list
	self.filterClick = function () {
		var substr =self.searchStr().toLowerCase();
		if(substr === '')
		{
			//this is called when filter has been clicked when user has already
			//selected an option
			for (var i = 0; i < self.marks().length; i++)
			{
				self.marks()[i].filter(true);
			}
			self.filterIt(true);
		}
		else
		{

			for (var j = 0; j < self.marks().length; j++)
			{
				if (self.marks()[j].title.toLowerCase().indexOf(substr) < 0)
				{
					self.marks()[j].filter(false);
				}
			}
			self.filterIt(false);
		}

	};
	//used to filter the markers on the map
	self.filterIt = function(clear){
		self.marks().forEach(function(curVal,id){
			if(self.marks()[id].filter())
			{
				markers[id].setVisible(true);
			}
			else {
				markers[id].setVisible(false);
			}
		});
	};

	//animation for side panel
	self.sidepanel = ko.observable(false);

	self.sidebutton = function(){
		var res = self.sidepanel()?false:true;
		self.sidepanel(res);
	};

	//animations for wiki panel
	self.wikipanel = ko.observable(false);
	self.wikibutton = function(){
		var res = self.wikipanel()?false:true;
		self.wikipanel(res);
	};

};


//This is the callback function for google api
function initMap() {
	// Constructor creates a new map.
	clearTimeout(timevar);
	map = new google.maps.Map(document.getElementById('map'), {
		center: {
			lat: 12.971594,
			lng: 77.594561
		},
		zoom: 8,
		mapTypeControl: false,
		zoomControl: true
	});

	var bounds = new google.maps.LatLngBounds();
	createMarkers(map, bounds,false);


	map.fitBounds(bounds);
}


//
// * @description creates a merker icon
// * @constructor
// * @param {string}  markerColor-color of the marker icon

function makeMarkerIcon(markerColor) {

	var markerImage = new google.maps.MarkerImage(
		'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor +
		'|40|_|%E2%80%A2',
		new google.maps.Size(21, 25),
		new google.maps.Point(0, 0),
		new google.maps.Point(10, 34),
		new google.maps.Size(21, 34));
	return markerImage;
}

// /**
// * @description creates a marker and populate the infowindow
// * @constructor
// * @param {string} map - map for the marker to set
// * @param {string} bounds- used to adjust the display area  of the map
// */
function createMarkers(map, bounds,clear) {
	for (var i = 0; i < newvm.marks().length; i++) {
		if (!markers[i] && newvm.marks()[i].visible()) {
			//this code is run when a initially markers are created
			var position = newvm.marks()[i].latLng;
			var title = newvm.marks()[i].title;
			var favourite = newvm.marks()[i].favourite;
			var defaultIcon = makeMarkerIcon('D3D3D3');
			// Create a marker per location, and put into markers array.
			var marker = new google.maps.Marker({
				position: position,
				title: title,
				animation: google.maps.Animation.DROP,
				id: i,
				icon: defaultIcon
			});
			markers[i] = marker;
			bounds.extend(position);
			marker.setMap(map);
			marker.addListener('click', populateInfoWindow);
			marker.addListener('mouseover', mouseoverFunc);

			marker.addListener('mouseout', mouseoutFunc);
		} else {
			if (newvm.marks()[i].visible()) {
				//for the marker which is selected
				markers[i].setVisible(true);
				var animation = clear ? null : google.maps.Animation.BOUNCE;
				markers[i].setAnimation(animation);
				bounds.extend(markers[i].position);
			} else {
				//for marker which arebt selected
				markers[i].setVisible(false);
			}
		}
	}
}

//This function changes the marker color cursor hovers above it
//no change if marker destination is favourite.
function mouseoutFunc() {
	markers[this.id].setAnimation(null);
	var hoverIcon = makeMarkerIcon('D3D3D3');
	this.setAnimation(null);
	if (!newvm.marks()[this.id].favourite())
		this.setIcon(hoverIcon);
}

function mouseoverFunc() {
	var marker = this;
	markers[marker.id].setAnimation(google.maps.Animation.BOUNCE);
	var defaultIcon = makeMarkerIcon('FFFFFF');
	if (!newvm.marks()[this.id].favourite())
		this.setIcon(defaultIcon);
}

var infowindowLoaded = false;


// * @description populated infowindow of the marker upon click
// * @constructor
// * @param {string} marker-the marker clicked on


function populateInfoWindow() {

	var infowindow = new google.maps.InfoWindow();
	// Check to make sure the infowindow is not already opened on this marker.
	var marker = this;
	if (infowindow.marker != marker) {
		infowindow.marker = marker;
		infowindow.open(map, marker);
		infowindow.setContent(marker.title);

		// Make sure the marker property is cleared if the infowindow is closed.
		infowindow.addListener('closeclick', function () {
			infowindow.marker = null;
		});
		//include street if availlable in the infowindow.
		//
		var getStreetView = function (data, status) {
			if (status == google.maps.StreetViewStatus.OK) {
				var nearStreetViewLocation = data.location.latLng;
				var heading = google.maps.geometry.spherical.computeHeading(nearStreetViewLocation, marker.position);
				infowindow.setContent('<div><h4>' + marker.title + ' <span><img src="' + newvm.marks()[marker.id].icon + '"></span></h4></div><div id="pano"></div>');
				var panoramaOptions = {
					position: nearStreetViewLocation,
					pov: {
						heading: heading,
						pitch: 30
					}
				};
				var panorama = new google.maps.StreetViewPanorama(
					document.getElementById('pano'), panoramaOptions);
			} else {
				infowindow.setContent('<div><h4>' + marker.title + '  <span><img src="' + newvm.marks()[marker.id].icon + '"></span></h4></div><div>No Street View Found</div>');
			}
		};
		var streetViewService = new google.maps.StreetViewService();
		var radius = 50;
		// Use streetview service to get the closest streetview image within
		// 50 meters of the markers position
		streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
		// Open the infowindow on the correct marker.
		infowindow.open(map, marker);
		newvm.selected(true);
		newvm.selected_marker(newvm.marks()[marker.id]);
		newvm.wiki();
	}
}
