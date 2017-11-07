import json

locations = [{
		'title': 'Wonderla Amusement Park',
		'visible': True,
		'filter': True,
		'location': {
			'lat': 12.834556,
			'lng': 77.400972
		},
		'icon': 'images/camping.png',
		'favourite': False
	},
	{
		'title': 'Iscon Temple Bangalore',
		'visible': True,
		'filter': True,
		'location': {
			'lat': 13.0096323,
			'lng': 77.55107099999999
		},
		'icon': 'images/temple.png',
		'favourite': False
	},
	{
		'title': 'UB City Bangalore',
		'visible': True,
		'filter': True,
		'location': {
			'lat': 12.9715895,
			'lng': 77.59605859999999
		},
		'icon': 'images/mall.png',
		'favourite': False
	},
	{
		'title': 'Art of Living Bangalore',
		'visible': True,
		'filter': True,
		'location': {
			'lat': 12.793013,
			'lng': 77.5051502
		},
		'icon': 'images/temple.png',
		'favourite': False
	},
	{
		'title': 'Lalbagh Botanical Garden',
		'visible': True,
		'filter': True,
		'location': {
			'lat': 12.9507432,
			'lng': 77.5847773
		},
		'icon': 'images/forest.png',
		'favourite': False
	},
	{
		'title': 'Cubbon Park',
		'visible': True,
		'filter': True,
		'location': {
			'lat': 12.9763472,
			'lng': 77.59292839999999
		},
		'icon': 'images/forest.png',
		'favourite': False
	},
	{
		'title': 'M. Chinnaswamy Stadium',
		'visible': True,
		'filter': True,
		'location': {
			'lat': 12.9788139,
			'lng': 77.5995932
		},
		'icon': 'images/stadium.png',
		'favourite': False
	},
	{
		'title': 'Commercial Street Bangalore',
		'visible': True,
		'filter': True,
		'location': {
			'lat': 12.9821663,
			'lng': 77.6083553
		},
		'icon': 'images/mall.png',
		'favourite': False
	}
];

with open('location.json','w') as out:
	json.dump(locations,out)
