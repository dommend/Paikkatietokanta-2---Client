import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import LocationDataService from '../services/LocationService';
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
import Moment from 'react-moment';
import ModalImage from 'react-modal-image';
import Weather from 'simple-react-weather';
import SEO from '@americanexpress/react-seo';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Spinner from 'react-bootstrap/Spinner'
import {Modal, Button} from 'react-bootstrap'

import {
  EmailShareButton,
  FacebookShareButton,
  LinkedinShareButton,
  RedditShareButton,
  TumblrShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from "react-share";

import {
  EmailIcon,
  FacebookIcon,
  LinkedinIcon,
  RedditIcon,
  TumblrIcon,
  TwitterIcon,
  WhatsappIcon,
} from "react-share";


toast.configure ({
  position: 'top-center',
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
});

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
  const [locationTags, setLocationTags] = useState(null);
  const [isLoading, setLoading] = useState (true);
  const [show, setShow] = useState(false);
  
  const getLocation = id => {
    LocationDataService.get(id)
      .then (response => {
        setCurrentLocation (response.data);
        setLocationTags(response.data.tags);
        setLoading(false);
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
    <div>
      <SEO
        title={currentLocation.title + ' - Paikkatietokanta'}
        description={currentLocation.description}
        locale="fi_FI"
        siteUrl={process.env.REACT_APP_BASE_URL + '/view/' + currentLocation.id}
        image={{
          src: currentLocation.featuredImage,
        }}
        openGraph={{
          title: currentLocation.title + ' - Paikkatietokanta',
          description: currentLocation.description,
          type: 'article',
          siteName: 'Paikkatietokanta',
          url: process.env.REACT_APP_BASE_URL + '/view/' + currentLocation.id,
          locale: 'fi_FI',
          image: {
            src: currentLocation.featuredImage,
            alt: currentLocation.title,
          },
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
                {isLoading ? <Spinner animation="border" variant="primary" />  :
                  <div className="innercontainer">
                    <button
                      type="button"
                      className="go-back"
                      onClick={() => props.history.goBack ()}
                    >
                      <span className="material-icons">arrow_back_ios</span>
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

                    <div className="tags">
                        {locationTags &&
                            locationTags.map((locationTags, index) => (        
                              <span className="tag" key={index}>
                                <Link to={"/tag/" + locationTags.id}>
                                <span className="material-icons">local_offer</span>
                                <span className="tag-name">{locationTags.tagName}</span>
                                </Link>
                              </span>
                            ))}
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
                          <Button className="shareButton" variant="primary" onClick={() => setShow(true)}>Jaa</Button>
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
                              url={process.env.REACT_APP_BASE_URL + '/view/' + currentLocation.id}
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
                              url={process.env.REACT_APP_BASE_URL + '/view/' + currentLocation.id}
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
                              url={process.env.REACT_APP_BASE_URL + '/view/' + currentLocation.id}
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
                              url={process.env.REACT_APP_BASE_URL + '/view/' + currentLocation.id}
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
                              url={process.env.REACT_APP_BASE_URL + '/view/' + currentLocation.id}
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
                              url={process.env.REACT_APP_BASE_URL + '/view/' + currentLocation.id}
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
                              url={process.env.REACT_APP_BASE_URL + '/view/' + currentLocation.id}
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
                        
                        <div className="time-and-place">
                      <div className="coordinates">
                        <span className="material-icons">place</span>
                        {currentLocation.coordinateN},  {currentLocation.coordinateE}
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

                          {currentLocation.flickrTag
                            ? <div className="flickr-lightbox-container">
                                <Spinner animation="border" variant="primary" /> 
                                <div className="flickr-lightbox">
                                  <FlickrLightbox
                                    api_key={process.env.REACT_APP_FLICKR_API}
                                    searchTerm={currentLocation.flickrTag}
                                    user_id={
                                      process.env.REACT_APP_FLICKR_USERNAME
                                    }
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
                }
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