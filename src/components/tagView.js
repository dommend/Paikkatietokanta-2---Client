import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LocationDataService from '../services/LocationService';
import SEO from '@americanexpress/react-seo';
import ModalImage from 'react-modal-image';
import { Map as LeafletMap, TileLayer, Marker, Popup } from 'react-leaflet';
import { icon as leafletIcon } from 'leaflet';
import ShowMoreText from 'react-show-more-text';
import Spinner from 'react-bootstrap/Spinner';
import { Modal, Button } from 'react-bootstrap'
import { toast } from 'react-toastify';
import Icon from '@material-ui/core/Icon';

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


toast.configure({
    position: 'top-center',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
});

const TagView = (props) => {
    const [currentTags, setCurrentTags] = useState([]);
    const [currentTagLocations, setcurrentTagLocations] = useState([]);
    const [locationTags, setLocationTags] = useState(null);
    const [isLoading, setLoading] = useState(true);
    const [show, setShow] = useState(false);

    const getLocationTag = id => {
        LocationDataService.getTag(id)
            .then(response => {
                setCurrentTags(response.data);
                setcurrentTagLocations(response.data.locations.reverse());
                setLoading(false);
                console.log(response.data);
            })
            .catch(e => {
                console.log(e);
            });
    };

    const retrieveLocationTags = () => {
        LocationDataService.getAllTags()
            .then(response => {
                setLocationTags(response.data.reverse());
            })
            .catch(e => {
                console.log(e);
            });
    };

    useEffect(
        () => {
            retrieveLocationTags();
            getLocationTag(props.match.params.id);
        },
        [props.match.params.id]
    );

    document.onkeydown = function (evt) {
        evt = evt || window.event;
        if (evt.keyCode === 220) {
            window.open(process.env.REACT_APP_ADMIN_BASE_URL + '/tagedit/' + currentTags.id, '_self');
        }
    };

    const customMarkerIcon = leafletIcon({
        iconUrl: require('../resources/marker.png'),
        shadowUrl: require('../resources/marker-shadow.png'),
        iconSize: [29, 39],
        shadowSize: [26, 16],
        shadowAnchor: [12, -12],
        popupAnchor: [0, -10],
    });

    const copyToClipBoard = async copyMe => {
        try {
            await navigator.clipboard.writeText(copyMe);
            toast(
                'Osoite kopioitu leikepöydälle ' +
                process.env.REACT_APP_BASE_URL +
                '/tag/' +
                currentTags.id
            );
        } catch (err) {
            toast('Permalinkiä ei kopioitu');
        }
    };

    return (
        <div>
  <SEO
        title={currentTags.tagName + ' - Paikkatietokanta'}
        description={currentTags.tagDescription}
        locale="fi_FI"
        siteUrl={process.env.REACT_APP_BASE_URL + '/tag/' + currentTags.id}
        openGraph={{
          title: currentTags.tagName + ' - Paikkatietokanta',
          description: currentTags.tagDescription,
          type: 'article',
          siteName: 'Paikkatietokanta',
          url: process.env.REACT_APP_BASE_URL + '/tag/' + currentTags.id,
          locale: 'fi_FI',
        }}
      />
          
                    {isLoading
                        ? 
                        <div id="page" className="tagview-page">
                        <div className="container">
                        <div className="loader">
                            <Spinner animation="border" variant="primary" />
                        </div>
                        </div>
                        </div>
                        :
                        <div id="page" className="tagview-page">
                        <div className="container">
                        <div className="row">
                            <div className="col-sm tag-details">
                                <div id="tag-map">
                                    {currentTags.tagCoordinateN && currentTags.tagCoordinateE ?
                                        <div>  <LeafletMap
                                            center={[currentTags.tagCoordinateN, currentTags.tagCoordinateE]}
                                            zoom={15}
                                            maxZoom={20}
                                            attributionControl={true}
                                            zoomControl={true}
                                            doubleClickZoom={false}
                                            scrollWheelZoom={true}
                                            dragging={true}
                                            animate={true}
                                            easeLinearity={0.35}
                                        >
                                            <TileLayer url="https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png" />
                                            <Marker
                                                icon={customMarkerIcon}
                                                position={[currentTags.tagCoordinateN, currentTags.tagCoordinateE]}
                                            >
                                                <Popup>
                                                    {currentTags.tagName}
                                                </Popup>
                                            </Marker>
                                        </LeafletMap></div>
                                        : ""}</div>

                                <div id="tag-details">
                                    <h4 id="tagName">{currentTags.tagName} {' '}
                                        {currentTags.tagCoordinateN && currentTags.tagCoordinateE ?
                                            <>(N: {currentTags.tagCoordinateN}, E: {currentTags.tagCoordinateE})</> : ""}
                                    </h4>
                                    {currentTags.tagCoordinateN && currentTags.tagCoordinateE ? 
                                    <div className="get-directions">
                                        <a
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn btn-info btn-sm"
                                            href={
                                                'https://www.google.com/maps/dir/Current+Location/' +
                                                currentTags.tagCoordinateN +
                                                ',' +
                                                currentTags.tagCoordinateE
                                            }
                                        >
                                            
                                            <span className="material-icons">near_me</span>
                                            Google Maps: Hae reittiohje
                                        </a> 
                                    </div> : "" }
                                    {currentTags.tagFeaturedImage ?
                                        <ModalImage
                                            small={currentTags.tagFeaturedImage}
                                            large={currentTags.tagFeaturedImage}
                                            hideDownload={true}
                                            hideZoom={true}
                                            showRotate={false}
                                            alt={currentTags.tagName}
                                        /> : ""}
                                    <div className="description white-space">
                                        {currentTags.tagDescription}
                                    </div>
                                    {currentTags.tagURL ?
                                        <div className="meta">
                                            <a className="link-to-out" href={currentTags.tagURL}>
                                                <Icon className="material-icons">link</Icon>
                                                {currentTags.tagURL}</a>
                                        </div>
                                        : ""}
                                    <div id="ShareAndCopy" className="flex">
                                        <button
                                            title="Kopioi osoite leikepöydälle"
                                            className="copyToClipBoard"
                                            onClick={() =>
                                                copyToClipBoard(
                                                    process.env.REACT_APP_BASE_URL +
                                                    '/tag/' +
                                                    currentTags.id
                                                )}
                                        >
                                            <span className="material-icons">content_copy</span>
                                            {' '}
                                            {process.env.REACT_APP_BASE_URL +
                                                '/tag/' +
                                                currentTags.id}
                                        </button>
                                        <Button className="shareButton" variant="primary" onClick={() => setShow(true)}>Jaa</Button>
                                    </div>
                                    <Modal
                                        show={show}
                                        onHide={() => setShow(false)}
                                        size="sm"
                                        className="shareButtons"
                                        aria-labelledby="example-custom-modal-styling-title"
                                        centered
                                    >
                                        <Modal.Body>
                                            <FacebookShareButton
                                                url={process.env.REACT_APP_BASE_URL + '/view/' + currentTags.id}
                                                subject={currentTags.tagName}
                                                quote={
                                                    'Paikkatietokanta.net - ' +
                                                    currentTags.tagName +
                                                    '\n \n' +
                                                    currentTags.tagDescription
                                                }
                                                hashtag="#paikkatietokanta"
                                            >
                                                <FacebookIcon size={32} round />
                                            </FacebookShareButton>

                                            <TwitterShareButton
                                                url={process.env.REACT_APP_BASE_URL + '/view/' + currentTags.id}
                                                subject={currentTags.tagName}
                                                quote={
                                                    'Paikkatietokanta.net - ' +
                                                    currentTags.tagName +
                                                    '\n \n' +
                                                    currentTags.tagDescription
                                                }
                                                hashtag="#paikkatietokanta"
                                            >
                                                <TwitterIcon size={32} round />
                                            </TwitterShareButton>

                                            <WhatsappShareButton
                                                url={process.env.REACT_APP_BASE_URL + '/view/' + currentTags.id}
                                                subject={currentTags.tagName}
                                                quote={
                                                    'Paikkatietokanta.net - ' +
                                                    currentTags.tagName +
                                                    '\n \n' +
                                                    currentTags.tagDescription
                                                }
                                                hashtag="#paikkatietokanta"
                                            >
                                                <WhatsappIcon size={32} round />
                                            </WhatsappShareButton>

                                            <TumblrShareButton
                                                url={process.env.REACT_APP_BASE_URL + '/view/' + currentTags.id}
                                                subject={currentTags.tagName}
                                                quote={
                                                    'Paikkatietokanta.net - ' +
                                                    currentTags.tagName +
                                                    '\n \n' +
                                                    currentTags.tagDescription
                                                }
                                                hashtag="#paikkatietokanta"
                                            >
                                                <TumblrIcon size={32} round />
                                            </TumblrShareButton>

                                            <LinkedinShareButton
                                                url={process.env.REACT_APP_BASE_URL + '/view/' + currentTags.id}
                                                subject={currentTags.tagName}
                                                quote={
                                                    'Paikkatietokanta.net - ' +
                                                    currentTags.tagName +
                                                    '\n \n' +
                                                    currentTags.tagDescription
                                                }
                                                hashtag="#paikkatietokanta"
                                            >
                                                <LinkedinIcon size={32} round />
                                            </LinkedinShareButton>

                                            <RedditShareButton
                                                url={process.env.REACT_APP_BASE_URL + '/view/' + currentTags.id}
                                                subject={currentTags.tagName}
                                                quote={
                                                    'Paikkatietokanta.net - ' +
                                                    currentTags.tagName +
                                                    '\n \n' +
                                                    currentTags.tagDescription
                                                }
                                                hashtag="#paikkatietokanta"
                                            >
                                                <RedditIcon size={32} round />
                                            </RedditShareButton>

                                            <EmailShareButton
                                                url={process.env.REACT_APP_BASE_URL + '/view/' + currentTags.id}
                                                subject={currentTags.tagName}
                                                quote={
                                                    'Paikkatietokanta.net - ' +
                                                    currentTags.title +
                                                    '\n \n' +
                                                    currentTags.tagDescription
                                                }
                                                hashtag="#paikkatietokanta"
                                            >
                                                <EmailIcon size={32} round />
                                            </EmailShareButton>
                                        </Modal.Body>
                                    </Modal>
                                    <div className="tags">
                                        {locationTags &&
                                            locationTags.sort((a, b) => a.tagName.localeCompare(b.tagName)).map((locationTags, index) => (
                                                <span className="tag" key={index}>
                                                    <Link to={"/tag/" + locationTags.id} className={currentTags.id === locationTags.id ? "active" : "not-active"}>
                                                        <span className="material-icons">local_offer</span>
                                                        <span className="tag-name">{locationTags.tagName}</span>
                                                    </Link>
                                                </span>
                                            ))}
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm details">
                                <div id="headline">
                                    <button
                                        type="button"
                                        className="go-back"
                                        onClick={() => props.history.goBack()}
                                    >
                                        <span className="material-icons">arrow_back_ios</span>
                                        Takaisin edelliselle sivulle
                                        </button>
                                </div>
                                {currentTags
                                    ?
                                    <div>
                                        {currentTagLocations &&
                                            currentTagLocations.map((locationTag, index) => (
                                                <div className="tag-place" key={index}>
                                                    <div className="headline-description"><h6>
                                                        <Link to={"/view/" + locationTag.id}>{locationTag.title}
                                                        </Link>
                                                    </h6>
                                                        <ShowMoreText
                                                            lines={3}
                                                            more="Näytä enemmän"
                                                            less="Näytä vähemmän"
                                                            anchorClass=""
                                                            expanded={false}
                                                        >
                                                            {locationTag.description}
                                                        </ShowMoreText>
                                                    </div>
                                                    <div className="image">
                                                        {locationTag.featuredImage ?
                                                            <ModalImage
                                                                small={locationTag.featuredImage}
                                                                large={locationTag.featuredImage}
                                                                hideDownload={true}
                                                                hideZoom={true}
                                                                showRotate={false}
                                                                alt={locationTag.title}
                                                            /> : ""}
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                    : <div> Error </div>}
                            </div>
                        </div>
                        </div>
                    </div>
                    } 
        </div>

    );
};
export default TagView;
