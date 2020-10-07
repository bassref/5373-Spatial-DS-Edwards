""" Code Provided by Dr. Terry Griffin
Edited by Rephael Edwards
flask_folium_02.py

    Required packages:
        import geopandas as gpd
        import pandas as pd
        import folium
        import branca
        import requests
        import json

    Usage:

    Start the flask server by running:

        $ python flask_folium_02.py

    And then head to http://127.0.0.1:5000/ in your browser to see the map displayed


import geopandas as gpd
import pandas as pd """
import folium
import branca
import requests
import json
import rtree
from flask import Flask
from flask import jsonify
from folium.features import GeoJson, GeoJsonTooltip, GeoJsonPopup
from flask import request
from folium.plugins import MousePosition
from rtree import index

app = Flask(__name__)
mbr = {}
coords = ()
features = []
foundFeatures = {}


def getEarthquakes():
    with open("Assignments/1982_1.json") as f:
        earthquakes = f.read()

    earthqData = json.loads(earthquakes)
    return earthqData


@app.route('/')
def indexes():
    return  "This is the base route"

#capture the point from the click and create a bounding box
@app.route('/click/')
def post_click():
    lat = request.args.get('lat', default = 0.0, type = float)
    lon = request.args.get('lon', default = 0.0, type = float) 
    coords = (lat,lon)
    return coords

    #myclick = {}

    """
    https://skipperkongen.dk/2013/02/18/trying-a-python-r-tree-implementation/
    
    Adjust your point data to be inserted into an R-Tree
    """

    
#put the earthquake data into an rtree  
def getCoords(earthqData):
    id = 0
    points = []
    earthqTree = index.Index()
    

    for quake in earthqData:
        lon = quake['geometry']['coordinates'][0]
        lat = quake['geometry']['coordinates'][1]
        points.append((lon,lat))
        #insert into the rTree
        earthqTree.insert(id, (lat, lon, lat, lon))
        id+=1
    return earthqTree
    
    #find which features from the tree are in the bounding box
def findFeaturesInBox (earthqTree, coords):
    featuresList = []
    lat = coords[0]
    lon = coords[1]
    # The max coords from bounding rectangles
    maxx = float(lon + 0.002) 
    minx = float(lon - 0.002)
    maxy = float(lat + 0.002)
    miny = float(lat - 0.002)

    left, bottom, right, top = (minx, miny, maxx, maxy)
    features = list(earthqTree.nearest((left, bottom, right, top), 3))[0].object

    for item in features:
        featuresList.append({
            'type':'feature',
             'geometry':earthqTree[item]['geometry'],
             'properties':earthqTree[item]['properties']
        })
    iD+=1
    foundFeatures['feature'] = featuresList
    return jsonify([str(iD),foundFeatures)]
 



if __name__ == '__main__':
    app.run(debug=True,port=5556)