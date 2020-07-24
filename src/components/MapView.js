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
import {BoxZoomControl} from 'react-leaflet-box-zoom';
import ReactLeafletSearch from 'react-leaflet-search';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Moment from 'react-moment';
import {Modal, Button} from 'react-bootstrap';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
  const [show, setShow] = useState (false);

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

  const copyToClipBoard = async copyMe => {
    try {
      await navigator.clipboard.writeText (copyMe);
      toast ('Osoite kopioitu leikepöydälle');
    } catch (err) {
      toast ('Permalinkiä ei kopioitu');
    }
  };

  const {BaseLayer} = LayersControl;

  return (
    <div id="fullpage" className="map-view">
      <SEO
        title="Karttanäkymä - Paikkatietokanta"
        description="Paikkatietokanta yhdistää valokuvaharrastus, historiallinen dokumentointi ja ammatillinen päämäärä kehittyä paremmaksi koodariksi. Sivuston on tarkoitettu henkilökohtaiseen käyttöön."
        locale="fi_FI"
        siteUrl={process.env.REACT_APP_BASE_URL + '/map/'}
        image={{
          src: process.env.REACT_APP_BASE_URL + '/logo512.png',
        }}
        openGraph={{
          title: 'Karttanäkymä - Paikkatietokanta',
          description: 'Paikkatietokanta yhdistää valokuvaharrastus, historiallinen dokumentointi ja ammatillinen päämäärä kehittyä paremmaksi koodariksi. Sivuston on tarkoitettu henkilökohtaiseen käyttöön.',
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

        <BoxZoomControl position="topright" sticky={false} />

        <ReactLeafletSearch
          position="topleft"
          inputPlaceholder="Hae"
          search={[]}
          zoom={14}
          showMarker={false}
          showPopup={false}
          openSearchOnLoad={false}
          closeResultsOnClick={false}
          providerOptions={{searchBounds: []}}
          customProvider={undefined | {search: searchString => {}}}
        />
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
                    <Tabs
                      defaultActiveKey="Kuvaus"
                      transition={false}
                      id="noanim-tab-example"
                    >
                      <Tab eventKey="Kuvaus" title="Kuvaus">

                        {location.markedImportant
                          ? <div className="float-right">
                              <Icon className="favorite">favorite</Icon>
                            </div>
                          : ''}
                        <h5>
                          <Link to={'/view/' + location.id}>
                            {location.title}
                          </Link>
                        </h5>

                        <div className="description white-space">
                          <ShowMoreText
                            lines={6}
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
                                  user_id={
                                    process.env.REACT_APP_FLICKR_USERNAME
                                  }
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
                        </div>
                      </Tab>
                      <Tab eventKey="Tiedot" title="Tiedot">
                        <div class="time-and-place">
                          <div className="coordinates">
                            <span className="material-icons">place</span>
                            {location.coordinateN}, {location.coordinateE}
                          </div>
                          <div className="date">
                            <div>
                              <span
                                className="material-icons"
                                title="Julkaistu"
                              >
                                schedule
                              </span>
                              <Moment format="DD.MM.YYYY">
                                {location.createdAt}
                              </Moment>
                            </div>
                            <div>
                              <span
                                className="material-icons"
                                title="Päivitetty"
                              >
                                update
                              </span>
                              <Moment format="DD.MM.YYYY">
                                {location.updatedAt}
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
                                location.coordinateN +
                                ',' +
                                location.coordinateE
                            }
                          >
                            <span className="material-icons">near_me</span>
                            Google Maps: Hae reittiohje
                          </a>
                        </div>
                        {location.url
                          ? <a className="link-to-out" href={location.url}>
                              <Icon className="material-icons">link</Icon>
                              {location.url}
                            </a>
                          : ''}
                        {location.flickrMore
                          ? <a
                              className="link-to-flickr"
                              href={location.flickrMore}
                            >
                              <Icon className="material-icons">link</Icon>
                              {location.flickrMore}
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
                                  location.id
                              )}
                          >
                            <span className="material-icons">content_copy</span>
                            {process.env.REACT_APP_BASE_URL +
                              '/view/' +
                              location.id}
                          </button>
                          <Button
                            className="shareButton"
                            variant="primary"
                            onClick={() => setShow (true)}
                          >
                            Jaa
                          </Button>
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
                                  location.id
                              }
                              subject={location.title}
                              quote={
                                'Paikkatietokanta.net - ' +
                                  location.title +
                                  '\n \n' +
                                  location.description
                              }
                              hashtag="#paikkatietokanta"
                            >
                              <FacebookIcon size={32} round />
                            </FacebookShareButton>

                            <TwitterShareButton
                              url={
                                process.env.REACT_APP_BASE_URL +
                                  '/view/' +
                                  location.id
                              }
                              subject={location.title}
                              quote={
                                'Paikkatietokanta.net - ' +
                                  location.title +
                                  '\n \n' +
                                  location.description
                              }
                              hashtag="#paikkatietokanta"
                            >
                              <TwitterIcon size={32} round />
                            </TwitterShareButton>

                            <WhatsappShareButton
                              url={
                                process.env.REACT_APP_BASE_URL +
                                  '/view/' +
                                  location.id
                              }
                              subject={location.title}
                              quote={
                                'Paikkatietokanta.net - ' +
                                  location.title +
                                  '\n \n' +
                                  location.description
                              }
                              hashtag="#paikkatietokanta"
                            >
                              <WhatsappIcon size={32} round />
                            </WhatsappShareButton>

                            <TumblrShareButton
                              url={
                                process.env.REACT_APP_BASE_URL +
                                  '/view/' +
                                  location.id
                              }
                              subject={location.title}
                              quote={
                                'Paikkatietokanta.net - ' +
                                  location.title +
                                  '\n \n' +
                                  location.description
                              }
                              hashtag="#paikkatietokanta"
                            >
                              <TumblrIcon size={32} round />
                            </TumblrShareButton>

                            <LinkedinShareButton
                              url={
                                process.env.REACT_APP_BASE_URL +
                                  '/view/' +
                                  location.id
                              }
                              subject={location.title}
                              quote={
                                'Paikkatietokanta.net - ' +
                                  location.title +
                                  '\n \n' +
                                  location.description
                              }
                              hashtag="#paikkatietokanta"
                            >
                              <LinkedinIcon size={32} round />
                            </LinkedinShareButton>

                            <RedditShareButton
                              url={
                                process.env.REACT_APP_BASE_URL +
                                  '/view/' +
                                  location.id
                              }
                              subject={location.title}
                              quote={
                                'Paikkatietokanta.net - ' +
                                  location.title +
                                  '\n \n' +
                                  location.description
                              }
                              hashtag="#paikkatietokanta"
                            >
                              <RedditIcon size={32} round />
                            </RedditShareButton>

                            <EmailShareButton
                              url={
                                process.env.REACT_APP_BASE_URL +
                                  '/view/' +
                                  location.id
                              }
                              subject={location.title}
                              quote={
                                'Paikkatietokanta.net - ' +
                                  location.title +
                                  '\n \n' +
                                  location.description
                              }
                              hashtag="#paikkatietokanta"
                            >
                              <EmailIcon size={32} round />
                            </EmailShareButton>
                          </Modal.Body>
                        </Modal>
                      </Tab>
                      <Tab eventKey="Kuvat" title="Kuvat">
                        {location.flickrTag
                          ? <div className="flickr-lightbox-container">
                              <div className="flickr-lightbox">
                                <FlickrLightbox
                                  api_key={process.env.REACT_APP_FLICKR_API}
                                  searchTerm={location.flickrTag}
                                  user_id={
                                    process.env.REACT_APP_FLICKR_USERNAME
                                  }
                                />
                              </div>
                            </div>
                          : ''}
                      </Tab>
                    </Tabs>
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
