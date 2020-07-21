import React, {useState, useEffect} from 'react';
import LocationDataService from '../services/LocationService';
import {Link} from 'react-router-dom';
import {
  Map as LeafletMap,
  TileLayer,
  Marker,
  Popup,
  LayersControl,
} from 'react-leaflet';
import ReactPlayer from 'react-player';
import FlickrLightbox from 'react-flickr-lightbox';
import Icon from '@material-ui/core/Icon';
import {icon as leafletIcon} from 'leaflet';
import ShowMoreText from 'react-show-more-text';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import SEO from '@americanexpress/react-seo';

const LocationsList = () => {
  const [locations, setLocations] = useState ([]);

  useEffect (() => {
    retrieveLocations ();
  }, []);

  const retrieveLocations = () => {
    LocationDataService.getAll ()
      .then (response => {
        setLocations (response.data);
        console.log (response.data);
      })
      .catch (e => {
        console.log (e);
      });
  };

  const customMarkerIcon = leafletIcon ({
    iconUrl: require ('../resources/marker.png'),
    shadowUrl: require ('../resources/marker-shadow.png'),
    iconSize: [29, 39],
    shadowSize: [26, 16],
    shadowAnchor: [12, -12],
    popupAnchor: [0, -10],
  });

  const importantMarkerIcon = leafletIcon ({
    iconUrl: require ('../resources/marker-important.png'),
    shadowUrl: require ('../resources/marker-shadow.png'),
    iconSize: [26, 36],
    shadowSize: [26, 16],
    shadowAnchor: [12, -12],
  });

  document.onkeydown = function (evt) {
    evt = evt || window.event;
    if (evt.keyCode === 220) {
      window.open (process.env.REACT_APP_ADMIN_BASE_URL + '/add', '_self');
    }
  };

  const {BaseLayer} = LayersControl;

  return (
    <div id="fullpage" className="map-view">
      <SEO
        title="Karttanäkymä - Paikkatietokanta"
        description="Paikkatietokanta yhdistää valokuvaharrastus, historiallinen dokumentointi ja ammatillinen focus kehittyä paremmaksi koodariksi. Sivuston on tarkoitettu henkilökohtaiseen käyttöön."
        locale="fi_FI"
        siteUrl={process.env.REACT_APP_BASE_URL + '/map/'}
        image={{
          src: process.env.REACT_APP_BASE_URL + '/logo512.png',
        }}
        openGraph={{
          title: 'Karttanäkymä - Paikkatietokanta',
          description: 'Paikkatietokanta yhdistää valokuvaharrastus, historiallinen dokumentointi ja ammatillinen focus kehittyä paremmaksi koodariksi. Sivuston on tarkoitettu henkilökohtaiseen käyttöön.',
          type: 'article',
          siteName: 'Paikkatietokanta',
          url: process.env.REACT_APP_BASE_URL + '/map/',
          locale: 'fi_FI',
          image: {
            src: process.env.REACT_APP_BASE_URL + '/logo512.png',
            alt: 'Karttanäkymä - Paikkatietokanta',
          },
        }}
      />
      <LeafletMap
        center={[61, 20]}
        zoom={5}
        maxZoom={20}
        attributionControl={true}
        zoomControl={false}
        doubleClickZoom={true}
        scrollWheelZoom={true}
        dragging={true}
        animate={true}
        easeLinearity={0.35}
      >

        <LayersControl>
          <BaseLayer checked name="Karttanäkymä">
            <TileLayer
              url="https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png"
              attribution="&copy; <a href=&quot;https://stadiamaps.com/&quot;>Stadia Maps</a>, &copy; <a href=&quot;https://openmaptiles.org/&quot;>OpenMapTiles</a> &copy; <a href=&quot;http://openstreetmap.org&quot;>OpenStreetMap</a> contributors"
            />
          </BaseLayer>

          <BaseLayer name="Korkealaatuinen satelliittinäkymä">
            <TileLayer
              url="https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}@2x.jpg?key=jJUAv4qRQJq0F3KAP2Y9"
            />
          </BaseLayer>

          <BaseLayer name="Matalalaatuinen satelliittinäkymä">
            <TileLayer
              url="https://api.maptiler.com/maps/hybrid/256/{z}/{x}/{y}.jpg?key=jJUAv4qRQJq0F3KAP2Y9"
            />
          </BaseLayer>
        </LayersControl>

        <MarkerClusterGroup>
          {locations.reverse &&
            locations.map ((location, index) => (
              <Marker
                key={index}
                icon={
                  location.markedImportant
                    ? importantMarkerIcon
                    : customMarkerIcon
                }
                position={[location.coordinateN, location.coordinateE]}
              >
                <Popup>
                  <div className="map-innercontainer">
                    {location.markedImportant
                      ? <div className="float-right">
                          <Icon className="favorite">favorite</Icon>
                        </div>
                      : ''}
                    <h5>
                      <Link to={'/view/' + location.id}>{location.title}</Link>
                    </h5>

                    <div className="description white-space">
                      <ShowMoreText
                        lines={3}
                        more="Näytä enemmän"
                        less="Näytä vähemmän"
                        anchorClass=""
                        expanded={false}
                      >
                        {location.description}
                      </ShowMoreText>
                    </div>
                    <div className="meta">

                      {location.flickrTag
                        ? <div className="flickr-lightbox">
                            {' '}
                            <FlickrLightbox
                              api_key={process.env.REACT_APP_FLICKR_API}
                              searchTerm={location.flickrTag}
                              user_id={process.env.REACT_APP_FLICKR_USERNAME}
                              limit={4}
                            />
                          </div>
                        : ''}
                      {location.videoEmbed
                        ? <div className="player-wrapper">
                            <ReactPlayer
                              className="react-player"
                              width="100%"
                              height="100%"
                              url={location.videoEmbed}
                            />
                          </div>
                        : ''}
                    </div>{' '}
                  </div>
                  <div className="metadata flex">
                    <Link
                      to={'/view/' + location.id}
                      className="open-page button"
                    >
                      Avaa
                    </Link>
                  </div>
                </Popup>
              </Marker>
            ))}
        </MarkerClusterGroup>
      </LeafletMap>
    </div>
  );
};
export default LocationsList;