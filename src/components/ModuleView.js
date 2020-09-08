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
import {Dropdown} from 'react-bootstrap';
import Moment from 'react-moment';
import ModalImage from 'react-modal-image';
import Weather from 'simple-react-weather';
import LazyLoad from 'react-lazyload';
import SEO from '@americanexpress/react-seo';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {Modal, Button} from 'react-bootstrap';
import Spinner from 'react-bootstrap/Spinner';
import {
  EmailShareButton,
  FacebookShareButton,
  LinkedinShareButton,
  RedditShareButton,
  TumblrShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from 'react-share';
import {
  EmailIcon,
  FacebookIcon,
  LinkedinIcon,
  RedditIcon,
  TumblrIcon,
  TwitterIcon,
  WhatsappIcon,
} from 'react-share';

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
  const [currentIndex, setCurrentIndex] = useState (-1);
  const [searchTitle, setSearchTitle] = useState ('');
  const [isLoading, setLoading] = useState (true);
  const [show, setShow] = useState (false);
  const [showBreakdance, setShowBreakdance] = useState (false);


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
        setLocations (response.data);
        setLoading (false);
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
        if (
          searchTitle.toLowerCase () === 'lets have a break dance party' ||
          searchTitle.toLowerCase () === "let's have a break dance party" ||
          searchTitle.toLowerCase () === 'lets have a breakdance party' ||
          searchTitle.toLowerCase () === "let's have a breakdance party"
        ) {
          document.body.classList.add ('breakdance');
          toast ('Here it comes! Prepare yourselves!');
          setTimeout (function () {
            document.getElementById ('breakdance').click ();
          }, 6000);
        }
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

  const handleKeyDown = e => {
    if (e.key === 'Enter') {
      findByTitle ();
    }
  };

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
    <div id="location-list" className="module-view">
      <SEO
        title="Moduulinäkymä - Paikkatietokanta"
        description="Paikkatietokanta yhdistää valokuvaharrastus, historiallinen dokumentointi ja ammatillinen päämäärä kehittyä paremmaksi koodariksi. Sivuston on tarkoitettu henkilökohtaiseen käyttöön."
        locale="fi_FI"
        siteUrl={process.env.REACT_APP_BASE_URL + '/module/'}
        image={{
          src: process.env.REACT_APP_BASE_URL + '/logo512.png',
        }}
        openGraph={{
          title: 'Moduulinäkymä - Paikkatietokanta',
          description: 'Paikkatietokanta yhdistää valokuvaharrastus, historiallinen dokumentointi ja ammatillinen päämäärä kehittyä paremmaksi koodariksi. Sivuston on tarkoitettu henkilökohtaiseen käyttöön.',
          type: 'article',
          siteName: 'Paikkatietokanta',
          url: process.env.REACT_APP_BASE_URL + '/module/',
          locale: 'fi_FI',
          image: {
            src: process.env.REACT_APP_BASE_URL + '/logo512.png',
            alt: 'Moduulinäkymä - Paikkatietokanta',
          },
        }}
      />
      <aside>
        <div className="search input-group mb-3">
          <input
            type="text"
            className="form-control"
            title="Mitä hakea? Kokeile: Let's have a break dance party"
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
        {isLoading
          ? <Spinner animation="border" variant="primary" />
          : <ul id="places" className="list-group">
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
            </ul>}
      </aside>
      <div id="place">
        {currentLocation
          ? <div>
              <div id="details">
                <div className="innercontainer">
                  <h4>
                    {currentLocation.title}
                    {currentLocation.markedImportant
                      ? <Icon className="favorite">favorite</Icon>
                      : ''}
                  </h4>
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
                  {currentLocation.tags ? 
                  <div className="tags">
                         {currentLocation.tags.sort((a, b) => a.tagName.localeCompare(b.tagName)).map((locationTags, index) => (        
                              <span className="tag" key={index}>
                                <Link to={"/tag/" + locationTags.id}>
                                <span className="material-icons">local_offer</span>
                                <span className="tag-name">{locationTags.tagName}</span>
                                </Link>
                              </span>
                            ))} 
                        </div> : "" }


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
                  <div className="place-innercontainer">
                    <div className="description white-space">
                      {currentLocation.description}
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
                      <div id="ShareAndCopy" className="flex">
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
                        <Button
                          className="shareButton"
                          variant="primary"
                          onClick={() => setShow (true)}
                        >
                          Jaa
                        </Button>
                      </div>


                      <div class="time-and-place">
                    <div className="coordinates">
                      <span className="material-icons">place</span>
                      {currentLocation.coordinateN}
                      ,
                      {' '}
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

                      <Modal
                        show={show}
                        onHide={() => setShow (false)}
                        size="sm"
                        className="shareButtons"
                        aria-labelledby="example-custom-modal-styling-title"
                        centered
                      >

                        <Modal.Body>
                          <FacebookShareButton
                            url={
                              process.env.REACT_APP_BASE_URL +
                                '/view/' +
                                currentLocation.id
                            }
                            subject={currentLocation.title}
                            quote={
                              'Paikkatietokanta.net - ' +
                                currentLocation.title +
                                '\n \n' +
                                currentLocation.description
                            }
                            hashtag="#paikkatietokanta"
                          >
                            <FacebookIcon size={32} round />
                          </FacebookShareButton>

                          <TwitterShareButton
                            url={
                              process.env.REACT_APP_BASE_URL +
                                '/view/' +
                                currentLocation.id
                            }
                            subject={currentLocation.title}
                            quote={
                              'Paikkatietokanta.net - ' +
                                currentLocation.title +
                                '\n \n' +
                                currentLocation.description
                            }
                            hashtag="#paikkatietokanta"
                          >
                            <TwitterIcon size={32} round />
                          </TwitterShareButton>

                          <WhatsappShareButton
                            url={
                              process.env.REACT_APP_BASE_URL +
                                '/view/' +
                                currentLocation.id
                            }
                            subject={currentLocation.title}
                            quote={
                              'Paikkatietokanta.net - ' +
                                currentLocation.title +
                                '\n \n' +
                                currentLocation.description
                            }
                            hashtag="#paikkatietokanta"
                          >
                            <WhatsappIcon size={32} round />
                          </WhatsappShareButton>

                          <TumblrShareButton
                            url={
                              process.env.REACT_APP_BASE_URL +
                                '/view/' +
                                currentLocation.id
                            }
                            subject={currentLocation.title}
                            quote={
                              'Paikkatietokanta.net - ' +
                                currentLocation.title +
                                '\n \n' +
                                currentLocation.description
                            }
                            hashtag="#paikkatietokanta"
                          >
                            <TumblrIcon size={32} round />
                          </TumblrShareButton>

                          <LinkedinShareButton
                            url={
                              process.env.REACT_APP_BASE_URL +
                                '/view/' +
                                currentLocation.id
                            }
                            subject={currentLocation.title}
                            quote={
                              'Paikkatietokanta.net - ' +
                                currentLocation.title +
                                '\n \n' +
                                currentLocation.description
                            }
                            hashtag="#paikkatietokanta"
                          >
                            <LinkedinIcon size={32} round />
                          </LinkedinShareButton>

                          <RedditShareButton
                            url={
                              process.env.REACT_APP_BASE_URL +
                                '/view/' +
                                currentLocation.id
                            }
                            subject={currentLocation.title}
                            quote={
                              'Paikkatietokanta.net - ' +
                                currentLocation.title +
                                '\n \n' +
                                currentLocation.description
                            }
                            hashtag="#paikkatietokanta"
                          >
                            <RedditIcon size={32} round />
                          </RedditShareButton>

                          <EmailShareButton
                            url={
                              process.env.REACT_APP_BASE_URL +
                                '/view/' +
                                currentLocation.id
                            }
                            subject={currentLocation.title}
                            quote={
                              'Paikkatietokanta.net - ' +
                                currentLocation.title +
                                '\n \n' +
                                currentLocation.description
                            }
                            hashtag="#paikkatietokanta"
                          >
                            <EmailIcon size={32} round />
                          </EmailShareButton>
                        </Modal.Body>
                      </Modal>
                      {currentLocation.flickrTag
                        ? <div className="flickr-lightbox-container">
                            <Spinner animation="border" variant="primary" />
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
                      <div />
                    </div>
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
                <LayersControl>
                  <BaseLayer checked name="Karttanäkymä">
                    <TileLayer url="https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png" />
                  </BaseLayer>

                  <BaseLayer name="Korkealaatuinen satelliittinäkymä">
                    <TileLayer
                      url={
                        'https://api.maptiler.com/maps/hybrid/256/{z}/{x}/{y}.jpg?key=' +
                          process.env.REACT_APP_MAPTILER_API
                      }
                    />
                  </BaseLayer>

                  <BaseLayer name="Matalalaatuinen satelliittinäkymä">
                    <TileLayer
                      url={
                        'https://api.maptiler.com/maps/hybrid/256/{z}/{x}/{y}.jpg?key=' +
                          process.env.REACT_APP_MAPTILER_API
                      }
                    />
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
              </LeafletMap>
            </div>
          : <div className="innercontainer">
              <div className="welcome">
                <video width="320" height="240" autoPlay loop muted>
                  <source
                    src={require ('../resources/happyrobot.mp4')}
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>}
        <Button
          id="breakdance"
          variant="primary"
          onClick={() => setShow (true)}
        >
          Let's have a break dance party!
        </Button>

        <Modal
          show={showBreakdance}
          onHide={() => setShowBreakdance (false)}
          size="lg"
          dialogClassName="modal-90w"
          aria-labelledby="example-custom-modal-styling-title"
          centered
        >

          <Modal.Body>
            <div
              className="player-wrapper"
              style={{margin: '-20px 0px 20px 0px'}}
            >
              <ReactPlayer
                className="react-player"
                width="100%"
                height="100%"
                url="https://www.youtube.com/watch?v=_stUY1h_qmM"
                playing={true}
              />
              ;
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
};
export default LocationsList;