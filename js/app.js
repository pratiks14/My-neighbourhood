var map;
//list of locations for markers in the map.
var locations = [
{title: 'Wonderla Amusement Park',visible:true, location: {lat: 12.834556, lng: 77.400972},icon:'images/camping.png',favourite:false},
{title: 'Iscon Temple Bangalore',visible:true, location: {lat: 13.0096323, lng:77.55107099999999},icon:'images/temple.png',favourite:false},
{title: 'UB City',visible:true, location: {lat: 12.9715895, lng: 77.59605859999999},icon:'images/mall.png',favourite:false},
{title: 'Art of Living International Center',visible:true, location: {lat: 12.793013, lng: 77.5051502},icon:'images/temple.png',favourite:false},
{title: 'Lalbagh Botanical Garden',visible:true, location: {lat: 12.9507432, lng: 77.5847773},icon:'images/forest.png',favourite:false},
{title: 'Cubbon Park',visible:true, location: {lat: 12.9763472, lng: 77.59292839999999},icon:'images/forest.png',favourite:false},
{title: 'M Chinnaswamy Stadium',visible:true, location: {lat: 12.9788139, lng: 77.5995932},icon:'images/stadium.png',favourite:false},
{title: 'Commercial Street',visible:true, location: {lat: 12.9821663, lng:  77.6083553},icon:'images/mall.png',favourite:false}
];

var markers = [];

function initMap() {
  // Constructor creates a new map.
	map = new google.maps.Map(document.getElementById('map'), {
	center: {lat:  12.971594, lng: 77.594561},
	zoom: 15,
	mapTypeControl: false
	});

	var bounds = new google.maps.LatLngBounds();visible:ko.observable(true),
	createMarkers(map,bounds); 
	

	map.fitBounds(bounds);
}
function makeMarkerIcon(markerColor) {

	var markerImage = new google.maps.MarkerImage(
	'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
	'|40|_|%E2%80%A2',
	new google.maps.Size(21, 25),
	new google.maps.Point(0, 0),
	new google.maps.Point(10, 34),
	new google.maps.Size(21,34));
	return markerImage;
}   

// var defaultIcon = makeMarkerIcon('D3D3D3');
// var hoverIcon = makeMarkerIcon('FFFFFF');
// var heartIcon = makeMarkerIcon('FF1493');





function createMarkers(map,bounds)
{	
	for(var i=0;i<locations.length;i++)
	{
		// Get the position from the location array.
		var position = locations[i].location;
		var title = locations[i].title;
		var favourite =locations[i].favourite;
		var defaultIcon = makeMarkerIcon('D3D3D3')
		// Create a marker per location, and put into markers array.
		var marker = new google.maps.Marker({
			position: position,
			title: title,
			animation: google.maps.Animation.DROP,
			id: i,
			icon:defaultIcon
		});
		bounds.extend(position);	
		markers.push(marker);
		marker.setMap(map);
		marker.addListener('click', function() {
              populateInfoWindow(this);
        });
	}	

}
function populateInfoWindow(marker) {

	var infowindow = new google.maps.InfoWindow();
// Check to make sure the infowindow is not already opened on this marker.
	if (infowindow.marker != marker) {
		  infowindow.marker = marker;
		  infowindow.open(map, marker);
		  infowindow.setContent(marker.title);

		  // Make sure the marker property is cleared if the infowindow is closed.
		  infowindow.addListener('closeclick', function() {
		    infowindow.marker = null;
		});

		function getStreetView(data, status) {
            if (status == google.maps.StreetViewStatus.OK)
            {
				var nearStreetViewLocation = data.location.latLng;
				var heading = google.maps.geometry.spherical.computeHeading(nearStreetViewLocation, marker.position);
                infowindow.setContent('<div><a id="heart" href=""><img src="images/heart-empty.png"></a><h4>' + marker.title +' <span><img src="'+locations[marker.id].icon+'"></span></h4></div><div id="pano"></div>');
                var panoramaOptions = {
                  position: nearStreetViewLocation,
                  pov: {
                    heading: heading,
                    pitch: 30
                  }
                };
                var panorama = new google.maps.StreetViewPanorama(
                  document.getElementById('pano'), panoramaOptions);
                } 
           	else {
                infowindow.setContent('<div><a id="heart" href=""><img src="images/heart-empty.png"></a><h4>' + marker.title + '  <span><img src="'+locations[marker.id].icon+'"></span></h4></div><div>No Street View Found</div>');
            }
            $('#heart').click(function(event){
				event.preventDefault();
				var htmlstr;
				if(!locations[marker.id].favourite)
				{
					htmlstr = '<img src="images/heart.png">';
					locations[marker.id].favourite = true;
					marker.setIcon(makeMarkerIcon('FF1493'));                   
				}
				else
				{
					htmlstr = '<img src="images/heart-empty.png">';
					locations[marker.id].favourite = false;
					marker.setIcon(makeMarkerIcon('D3D3D3'));
				}
				$(this).html(htmlstr);
            });
        }
		var streetViewService = new google.maps.StreetViewService();
		var radius = 50;
		// Use streetview service to get the closest streetview image within
		// 50 meters of the markers position
		streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
		// Open the infowindow on the correct marker.
		infowindow.open(map, marker);
	}
}

          
     	     
          // var infowindow = new google.maps.InfoWindow();
          // 
          // var defaultIcon = makeMarkerIcon('D3D3D3');
          // 

          //   bounds.extend(position);

          //   // Push the marker to our array of markers.
          //   markers.push(marker);
          //   var defaultIcon = makeMarkerIcon('D3D3D3');
          //   // Create an onclick event to open an infowindow at each marker.
          //   marker.setMap(map)
          //   marker.addListener('click', function() {
          //     populateInfoWindow(this,locations, infowindow);
          //   });

          //   marker.addListener('mouseover',function(){
              
          //     mouseoutFunc(this,locations);
          //   });

          //   marker.addListener('mouseout',function(){
          //     mouseoverFunc(this,locations);
          //   });
            
          // }
	

// function mouseoutFunc(marker,locations)
// { 
//   var hoverIcon = makeMarkerIcon('FFFFFF');
//   if(!locations[marker.id].favourite)
//         marker.setIcon(hoverIcon);
// }
// function mouseoverFunc(marker,locations)
// { 
//   var defaultIcon = makeMarkerIcon('D3D3D3');
//   if(!locations[marker.id].favourite)
//         marker.setIcon(defaultIcon);
// }

// function populateInfoWindow(marker,locations, infowindow) {
// // Check to make sure the infowindow is not already opened on this marker.
// if (infowindow.marker != marker) {
//   infowindow.marker = marker;
//   infowindow.open(map, marker);
//   infowindow.setContent(marker.title);

//   // Make sure the marker property is cleared if the infowindow is closed.
//   infowindow.addListener('closeclick', function() {
//     infowindow.marker = null;
//   });

//   var streetViewService = new google.maps.StreetViewService();
//   var radius = 50;


//           function getStreetView(data, status) {
//             if (status == google.maps.StreetViewStatus.OK) {
//               var nearStreetViewLocation = data.location.latLng;
//               var heading = google.maps.geometry.spherical.computeHeading(
//                 nearStreetViewLocation, marker.position);
//                 infowindow.setContent('<div><a id="heart" href=""><img src="images/heart-empty.png"></a><h4>' + marker.title +' <span><img src="'+locations[marker.id].icon+'"></span></h4></div><div id="pano"></div>');
//                 var panoramaOptions = {
//                   position: nearStreetViewLocation,
//                   pov: {
//                     heading: heading,
//                     pitch: 30
//                   }
//                 };
//                 var panorama = new google.maps.StreetViewPanorama(
//                   document.getElementById('pano'), panoramaOptions);
//                 } else {
//                   infowindow.setContent('<div><a id="heart" href=""><img src="images/heart-empty.png"></a><h4>' + marker.title + '  <span><img src="'+locations[marker.id].icon+'"></span></h4></div><div>No Street View Found</div>');
//                 }
//                 $('#heart').click(function(event){
//                   event.preventDefault();
//                   var htmlstr;
//                   if(!locations[marker.id].favourite)
//                   {
//                     htmlstr = '<img src="images/heart.png">';
//                     locations[marker.id].favourite = true;
//                     marker.setIcon(makeMarkerIcon('FF1493'));                   
//                   }
//                   else
//                   {
//                     htmlstr = '<img src="images/heart-empty.png">';
//                     locations[marker.id].favourite = false;
//                     marker.setIcon(makeMarkerIcon('D3D3D3'));
//                   }
//                   $(this).html(htmlstr);
//                 });
//               }
//               // Use streetview service to get the closest streetview image within
//               // 50 meters of the markers position
//               streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
//               // Open the infowindow on the correct marker.
//               infowindow.open(map, marker);
//             }
//           }
        // var boxWidth = $(".side-panel").width();
        // $(".side-panel").click(function(){
        //     $(".side-panel").animate({
        //         width: "toggle"
        //     });
        // });
        // $(".side-panel").click(function(){
        //     $(".side-panel").animate({
        //         width: boxWidth
        //     });
        // });


var marker = function(marker){
	self.title = marker.title;
	self.visible = ko.observable(marker.visible);
	self.location = marker.location;
	self.favourite = ko.observable(marker.favourite);
	self.icon = marker.icon
};


var viewModel = function(){
	var self = this;
	self.selected_marker = ko.observable(new marker(locations[0]));
	self.markers = ko.observableArray(locations);
	self.enableCurrentMarker = function(marker){
		self.selected_marker(marker);
	};
};
ko.applyBindings(new viewModel());
































 //     const wikiRequestTimeout = setTimeout(function(){
    //     $wikiElem.text('The wikipedia links could not be fetched');
    // }, 8000);

    // $.ajax({
    //     url: 'https://en.wikipedia.org/w/api.php?action=opensearch&search='+city+'&format=json',
    //     dataType: 'jsonp',
    //     success: function(response){
    //         clearTimeout(wikiRequestTimeout);
            
    //         const titles = response[1];
    //         const urls = response[1];
    //         titles.forEach(function(title, idx){
    //             $wikiElem.append(`
    //                 <li>
    //                     <a href="${ urls[idx] }">${ title }</a>
    //                 </li>
    //             `);
    //         });
    //     },
    //     error: function(err){
    //         console.error('An error has occurred');
    //     }
    // });