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
import Icon from '@material-ui/core/Icon';
import ReactPlayer from 'react-player';
import FlickrLightbox from 'react-flickr-lightbox';
import {icon as leafletIcon} from 'leaflet';
import MainScreen from './textScramble';
import {Throbber, ThreeQuarters} from 'css-spinners-react';
import ShowMoreText from 'react-show-more-text';
import {Dropdown} from 'react-bootstrap';
import ModalImage from 'react-modal-image';
import Weather from 'simple-react-weather';
import LazyLoad from 'react-lazyload';
import SEO from '@americanexpress/react-seo';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

toast.configure ({
  position: 'top-center',
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
});

const LocationsList = () => {
  const [locations, setLocations] = useState ([]);
  const [currentLocation, setCurrentLocation] = useState (null);
  const [currentIndex, setCurrentIndex] = useState ();
  const [searchTitle, setSearchTitle] = useState ('');

  useEffect (() => {
    retrieveLocations ();
  }, []);

  const onChangeSearchTitle = e => {
    const searchTitle = e.target.value;
    setSearchTitle (searchTitle);
  };

  const retrieveLocations = () => {
    LocationDataService.getAll ()
      .then (response => {
        document.body.classList.remove ('locations-loaded');
        setLocations (response.data);
        document.body.classList.add ('locations-loaded');
        console.log (response.data);
      })
      .catch (e => {
        console.log (e);
      });
  };

  const setActiveLocation = (location, index) => {
    setCurrentLocation (location);
    setCurrentIndex (index);
  };

  const findByTitle = () => {
    LocationDataService.findByTitle (searchTitle)
      .then (response => {
        setLocations (response.data);
        console.log (response.data);
      })
      .catch (e => {
        console.log (e);
      });
  };

  const findAllmarkedImportant = () => {
    LocationDataService.findMarkedImportant ()
      .then (response => {
        setLocations (response.data);
        setCurrentLocation (null);
        setCurrentIndex (null);
        console.log (response.data);
      })
      .catch (e => {
        console.log (e);
      });
  };

  const findAllReversed = () => {
    LocationDataService.getAll ()
      .then (response => {
        setLocations (response.data.reverse ());
        setCurrentLocation (null);
        setCurrentIndex (null);
        console.log (response.data);
      })
      .catch (e => {
        console.log (e);
      });
  };

  const findAllLocations = () => {
    LocationDataService.getAll ()
      .then (response => {
        setLocations (response.data);
        setCurrentLocation (null);
        setCurrentIndex (null);
        console.log (response.data);
      })
      .catch (e => {
        console.log (e);
      });
  };

  const findAllTitle = () => {
    LocationDataService.findAllTitle ()
      .then (response => {
        setLocations (response.data);
        setCurrentLocation (null);
        setCurrentIndex (null);
        console.log (response.data);
      })
      .catch (e => {
        console.log (e);
      });
  };

  const findAllTitleReverse = () => {
    LocationDataService.findAllTitle ()
      .then (response => {
        setLocations (response.data.reverse ());
        setCurrentLocation (null);
        setCurrentIndex (null);
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
    popupAnchor: [0, -10],
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

  const handleKeyDown = e => {
    if (e.key === 'Enter') {
      findByTitle ();
    }
  };

  const copyToClipBoard = async copyMe => {
    try {
      await navigator.clipboard.writeText (copyMe);
      toast (
        'Osoite kopioitu leikepöydälle ' +
          process.env.REACT_APP_BASE_URL +
          '/view/' +
          currentLocation.id
      );
    } catch (err) {
      toast ('Permalinkiä ei kopioitu');
    }
  };

  const {BaseLayer} = LayersControl;

  return (
    <div id="location-list" className="frontpage">
      <SEO
        title="Paikkalista - Paikkatietokanta"
        description="Paikkatietokanta yhdistää valokuvaharrastus, historiallinen dokumentointi ja ammatillinen focus kehittyä paremmaksi koodariksi. Sivuston on tarkoitettu henkilökohtaiseen käyttöön."
        locale="fi_FI"
        siteUrl={process.env.REACT_APP_BASE_URL + '/locations/'}
        image={{
          src: process.env.REACT_APP_BASE_URL + '/logo512.png',
        }}
        openGraph={{
          title: 'Paikkalista - Paikkatietokanta',
          description: 'Paikkatietokanta yhdistää valokuvaharrastus, historiallinen dokumentointi ja ammatillinen focus kehittyä paremmaksi koodariksi. Sivuston on tarkoitettu henkilökohtaiseen käyttöön.',
          type: 'article',
          siteName: 'Paikkatietokanta',
          url: process.env.REACT_APP_BASE_URL + '/locations/',
          locale: 'fi_FI',
          image: {
            src: process.env.REACT_APP_BASE_URL + '/logo512.png',
            alt: 'Paikkalista - Paikkatietokanta',
          },
        }}
      />
      <aside>
        <div className="search input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Hae otsikon perusteella"
            value={searchTitle}
            onChange={onChangeSearchTitle}
            onKeyDown={handleKeyDown}
          />
          <div className="input-group-append">
            <button
              className="btn btn-secondary"
              type="button"
              onClick={findByTitle}
            >
              <span className="material-icons">search</span>
            </button>
          </div>
        </div>
        <div id="filter">
          <Dropdown>
            <Dropdown.Toggle variant="primary" id="dropdown-basic">
              <span className="material-icons">sort_by_alpha</span> Järjestä
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={findAllLocations}>
                Uudet ensin
              </Dropdown.Item>
              <Dropdown.Item onClick={findAllReversed}>
                Vanhat ensin
              </Dropdown.Item>
              <Dropdown.Item onClick={findAllTitle}>
                A - Z
              </Dropdown.Item>
              <Dropdown.Item onClick={findAllTitleReverse}>
                Z - A
              </Dropdown.Item>
              <Dropdown.Item onClick={findAllmarkedImportant}>
                Tärkeäksi merkatut
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <Throbber />
        <ul id="places" className="list-group">
          {locations &&
            locations.map ((location, index) => (
              <LazyLoad
                overflow
                once={location.once}
                placeholder={<li className="list-group-item">...</li>}
                scroll={true}
                key={index}
                throttle={30}
                height={30}
              >
                <li
                  key={index}
                  className={
                    'list-group-item ' +
                      (index === currentIndex ? 'active' : '')
                  }
                  onClick={() => setActiveLocation (location, index)}
                >
                  {location.markedImportant
                    ? <div className="float-right">
                        <Icon className="favorite">favorite</Icon>
                      </div>
                    : ''}
                  {location.title} <br />
                  <div className="coordinates">
                    <Icon className="material-icons">place</Icon>
                    {[location.coordinateN + ', ' + location.coordinateE]}
                  </div>
                </li>
              </LazyLoad>
            ))}
        </ul>
      </aside>
      <div id="place">
        {currentLocation
          ? <div>
              <div id="details">
                <div className="innercontainer">
                  <div className="place-innercontainer">
                    <h4>
                      {currentLocation.title}
                      {currentLocation.markedImportant
                        ? <Icon className="favorite">favorite</Icon>
                        : ''}
                    </h4>
                    <div
                      className={
                        currentLocation.description
                          ? 'description white-space'
                          : 'no-description white-space'
                      }
                    >
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
                      <ShowMoreText
                        lines={5}
                        more="Näytä enemmän"
                        less="Näytä vähemmän"
                        anchorClass=""
                        expanded={false}
                      >
                        {currentLocation.description}
                      </ShowMoreText>
                    </div>
                    <div className="meta">
                      {currentLocation.url
                        ? <a className="link-to-out" href={currentLocation.url}>
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

                      <button
                        title="Kopioi osoite leikepöydälle"
                        className="copyToClipBoard"
                        onClick={() =>
                          copyToClipBoard (
                            process.env.REACT_APP_BASE_URL +
                              '/view/' +
                              currentLocation.id
                          )}
                      >
                        <span className="material-icons">content_copy</span>
                        {' '}
                        {process.env.REACT_APP_BASE_URL +
                          '/view/' +
                          currentLocation.id}
                      </button>

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
                  <div className="metadata flex">
                    <Link
                      to={'/view/' + currentLocation.id}
                      className="open-page button"
                    >
                      Avaa
                    </Link>
                  </div>
                </div>
              </div>
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
                <LayersControl position="topleft">
                  <BaseLayer checked name="Karttanäkymä">
                    <TileLayer url="https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png" />
                  </BaseLayer>

                  <BaseLayer name="Korkealaatuinen satelliittinäkymä">
                    <TileLayer url={"https://api.maptiler.com/maps/hybrid/256/{z}/{x}/{y}.jpg?key=" + process.env.REACT_APP_MAPTILER_API} />
                  </BaseLayer>

                  <BaseLayer name="Matalalaatuinen satelliittinäkymä">
                    <TileLayer url={"https://api.maptiler.com/maps/hybrid/256/{z}/{x}/{y}.jpg?key=" + process.env.REACT_APP_MAPTILER_API} />
                  </BaseLayer>
                </LayersControl>

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
          : <div className="innercontainer">
              <div id="welcome">
                <div>
                <video width="320" height="240" autoPlay loop muted >
                <source src={require ('../resources/happyrobot.mp4')} type="video/mp4" />
                Your browser does not support the video tag.
                </video>
                  <p>
                    <small className="even-smaller">
                      jani@penttinen.fi
                    </small>
                  </p>
                  <MainScreen />
                </div>
              </div>
            </div>}
      </div>
    </div>
  );
};
export default LocationsList;
