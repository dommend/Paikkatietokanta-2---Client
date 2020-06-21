import React, {useState, useEffect} from 'react';
import LocationDataService from '../services/LocationService';
import {Map as LeafletMap, TileLayer, Marker, Popup} from 'react-leaflet';
import ReactPlayer from 'react-player';
import FlickrLightbox from 'react-flickr-lightbox';
import Icon from '@material-ui/core/Icon';
import {icon as leafletIcon} from 'leaflet';
import {ThreeQuarters} from 'css-spinners-react';
import Moment from 'react-moment';
import ModalImage from 'react-modal-image';
import Weather from 'simple-react-weather';
import SEO from '@americanexpress/react-seo';

const Location = props => {
  const initialLocationState = {
    id: null,
    title: '',
    description: '',
    markedImportant: false,
    coordinateN: '',
    coordinateE: '',
    videoEmbed: '',
    url: '',
    flickrTag: '',
    featuredImage: '',
  };
  
  const [currentLocation, setCurrentLocation] = useState (initialLocationState);

  const getLocation = id => {
    LocationDataService.get (id)
      .then (response => {
        setCurrentLocation (response.data);
        console.log (response.data);
      })
      .catch (e => {
        console.log (e);
      });
  };

  useEffect (
    () => {
      getLocation (props.match.params.id);
    },
    [props.match.params.id]
  );

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
      currentLocation
        ? window.open (
            process.env.REACT_APP_ADMIN_BASE_URL +
              '/edit/' +
              currentLocation.id,
            '_self'
          )
        : window.open (process.env.REACT_APP_ADMIN_BASE_URL + '/add', '_self');
    }
  };
  return (
  
    <div>
  <SEO
      title={currentLocation.title + " - Paikkatietokanta"}
      description={currentLocation.description}
      locale="fi_FI"
      siteUrl={process.env.REACT_APP_BASE_URL + '/view/' + currentLocation.id}
      image={{
        src: currentLocation.featuredImage
      }}
      openGraph={{
        title: currentLocation.title + " - Paikkatietokanta",
        description: currentLocation.description,
        type: "article",
        siteName: "Paikkatietokanta",
        url: process.env.REACT_APP_BASE_URL + '/view/' + currentLocation.id,
        locale: "fi_FI",
        image: {
          src: currentLocation.featuredImage,
          alt: currentLocation.title,
        }
      }}
    />
      {currentLocation
        ? <div id="page" className="locationView-page">
            <div className="container">
              <div className="row">
                <div className="col-sm map">
                  <LeafletMap
                    center={[
                      currentLocation.coordinateN,
                      currentLocation.coordinateE,
                    ]}
                    zoom={15}
                    maxZoom={20}
                    attributionControl={true}
                    zoomControl={false}
                    doubleClickZoom={true}
                    scrollWheelZoom={true}
                    dragging={true}
                    animate={true}
                    easeLinearity={0.35}
                  >
                    <TileLayer url="https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png" />
                    <Marker
                      icon={
                        currentLocation.markedImportant
                          ? importantMarkerIcon
                          : customMarkerIcon
                      }
                      position={[
                        currentLocation.coordinateN,
                        currentLocation.coordinateE,
                      ]}
                    >
                      <Popup>
                        {currentLocation.title}
                      </Popup>
                    </Marker>
                  </LeafletMap>
                  <div id="weather-bg">
                    <div id="weather">
                      <Weather
                        unit="C"
                        lat={currentLocation.coordinateN}
                        lon={currentLocation.coordinateE}
                        appid={process.env.REACT_APP_OW_API}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-sm details">
                  <div className="innercontainer">
                    <button
                      type="button"
                      className="go-back"
                      onClick={() => props.history.goBack ()}
                    >
                      <span className="material-icons">arrow_back_ios</span>
                      {' '}
                      Takaisin edelliselle sivulle
                    </button>
                    <h4>
                      {currentLocation.title}
                      {currentLocation.markedImportant
                        ? <div className="float-right">
                            <Icon className="favorite">favorite</Icon>
                          </div>
                        : ''}
                    </h4>
                    <div className="time-and-place">
                      <div className="coordinates">
                        <span className="material-icons">place</span>
                        {' '}{' '}
                        {currentLocation.coordinateN}
                        ,
                        {currentLocation.coordinateE}
                      </div>
                      <div className="date">
                        <div>
                          <span className="material-icons" title="Julkaistu">
                            schedule
                          </span>
                          <Moment format="DD.MM.YYYY">
                            {currentLocation.createdAt}
                          </Moment>
                        </div>
                        <div>
                          <span className="material-icons" title="Päivitetty">
                            update
                          </span>
                          <Moment format="DD.MM.YYYY">
                            {currentLocation.updatedAt}
                          </Moment>
                        </div>
                      </div>
                    </div>
                    <div className="get-directions">
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-info btn-sm"
                        href={
                          'https://www.google.com/maps/dir/Current+Location/' +
                            currentLocation.coordinateN +
                            ',' +
                            currentLocation.coordinateE
                        }
                      >
                        <span className="material-icons">near_me</span>
                        Google Maps: Hae reittiohje
                      </a>
                    </div>
                    {currentLocation.featuredImage
                      ? <div id="featuredImage">
                          <ModalImage
                            small={currentLocation.featuredImage}
                            large={currentLocation.featuredImage}
                            hideDownload={true}
                            hideZoom={true}
                            showRotate={false}
                            alt={currentLocation.title}
                          />
                        </div>
                      : ''}
                    <div className="description white-space">
                      {currentLocation.description}
                      <div>
                        <div className="meta">
                          {currentLocation.url
                            ? <a
                                className="link-to-out"
                                href={currentLocation.url}
                              >
                                <Icon className="material-icons">link</Icon>
                                {currentLocation.url}
                              </a>
                            : ''}
                          {currentLocation.flickrMore
                            ? <a
                                className="link-to-flickr"
                                href={currentLocation.flickrMore}
                              >
                                <Icon className="material-icons">link</Icon>
                                {currentLocation.flickrMore}
                              </a>
                            : ''}
                          {currentLocation.flickrTag
                            ? <div className="flickr-lightbox-container">
                                <ThreeQuarters />
                                <div className="flickr-lightbox">
                                  <FlickrLightbox
                                    api_key={process.env.REACT_APP_FLICKR_API}
                                    searchTerm={currentLocation.flickrTag}
                                    user_id={process.env.REACT_APP_FLICKR_USERNAME}
                                  />
                                </div>
                              </div>
                            : ''}
                          <div>
                            {currentLocation.videoEmbed
                              ? <div className="player-wrapper">
                                  <ReactPlayer
                                    className="react-player"
                                    width="100%"
                                    height="100%"
                                    url={currentLocation.videoEmbed}
                                  />
                                </div>
                              : ''}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        : <div>
            <p>Error.</p>
          </div>}
    </div>
  );
};
export default Location;
