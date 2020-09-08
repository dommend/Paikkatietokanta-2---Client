import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import LocationDataService from '../services/LocationService';
import { Map as LeafletMap, TileLayer, Marker, Popup } from 'react-leaflet';
import ReactPlayer from 'react-player';
import FlickrLightbox from 'react-flickr-lightbox';
import Icon from '@material-ui/core/Icon';
import { icon as leafletIcon } from 'leaflet';
import ShowMoreText from 'react-show-more-text';
import SEO from '@americanexpress/react-seo';
import Spinner from 'react-bootstrap/Spinner';
import Pagination from "@material-ui/lab/Pagination";
import Moment from 'react-moment';

import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'

const GridAndListView = () => {
    const [locations, setLocations] = useState([]);
    const [searchTitle, setSearchTitle] = useState("");

    const [page, setPage] = useState(1);
    const [count, setCount] = useState(0);
    const [pageSize, setPageSize] = useState(12);
    const [listOrder, setOrder] = useState('DESC');
    const [listTitle, setListTitle] = useState('createdAt');
    const [isLoading, setLoading] = useState(true);

    const pageSizes = [6, 12, 24, 36, 48, 60];

    const onChangeSearchTitle = (e) => {
        const searchTitle = e.target.value;
        setSearchTitle(searchTitle);
    };


    const getRequestParams = (title, page, pageSize, listOrder, listTitle) => {
        let params = {};

        if (listOrder) {
            params["listOrder"] = listOrder;
        }

        if (listTitle) {
            params["listTitle"] = listTitle;
        }


        if (searchTitle) {
            params["title"] = title;
        }

        if (page) {
            params["page"] = page - 1;
        }

        if (pageSize) {
            params["size"] = pageSize;
        }

        return params;
    };

    const retrieveLocations = () => {
        const params = getRequestParams(searchTitle, page, pageSize, listOrder, listTitle);

        LocationDataService.getAllAdvanced(params)
            .then((response) => {
                const { locations, totalPages, listOrder, listTitle } = response.data;
                setLocations(locations);
                setCount(totalPages);
                setOrder(listOrder);
                setListTitle(listTitle);
                setLoading(false);
                console.log(response.data);
            })
            .catch((e) => {
                console.log(e);
            });
    };

    useEffect(retrieveLocations, [page, pageSize, listOrder, listTitle]);

    const backToTop = () => {
        const backToTop = document.getElementById('page');
        backToTop.scrollTo({top: 0, behavior: 'smooth'});
    }

    const handlePageChange = (event, value, listOrder) => {
        setPage(value);
        backToTop();
    };

    const handlePageSizeChange = (event, value, listOrder) => {
        setPageSize(event.target.value);
        setPage(1);
    };

    const handleOrder = (event) => {
        setOrder(event.target.value);
    };

    const handleListTitle = (event) => {
        setListTitle(event.target.value);
    };

    const handleKeyDown = e => {
        if (e.key === 'Enter') {
            retrieveLocations();
        }
    };


    document.onkeydown = function (evt) {
        evt = evt || window.event;
        if (evt.keyCode === 220) {
            window.open(process.env.REACT_APP_ADMIN_BASE_URL + '/add', '_self');
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

    const importantMarkerIcon = leafletIcon({
        iconUrl: require('../resources/marker-important.png'),
        shadowUrl: require('../resources/marker-shadow.png'),
        iconSize: [26, 36],
        shadowSize: [26, 16],
        shadowAnchor: [12, -12],
    });

    return (
        <>
            <SEO
                title="Grid / List - Paikkatietokanta"
                description="Paikkatietokanta yhdistää valokuvaharrastus, historiallinen dokumentointi ja ammatillinen päämäärä kehittyä paremmaksi koodariksi. Sivuston on tarkoitettu henkilökohtaiseen käyttöön."
                locale="fi_FI"
                siteUrl={process.env.REACT_APP_BASE_URL + '/grid/'}
                image={{
                    src: process.env.REACT_APP_BASE_URL + '/logo512.png',
                }}
                openGraph={{
                    title: 'Grid / List - Paikkatietokanta',
                    description: 'Paikkatietokanta yhdistää valokuvaharrastus, historiallinen dokumentointi ja ammatillinen päämäärä kehittyä paremmaksi koodariksi. Sivuston on tarkoitettu henkilökohtaiseen käyttöön.',
                    type: 'article',
                    siteName: 'Paikkatietokanta',
                    url: process.env.REACT_APP_BASE_URL + '/grid/',
                    locale: 'fi_FI',
                    image: {
                        src: process.env.REACT_APP_BASE_URL + '/logo512.png',
                        alt: 'Ruudukkonäkymä  - Paikkatietokanta',
                    },
                }}
            />
            {isLoading
                ? <div id="page"><Spinner animation="border" variant="primary" /></div>
                :
                <div id="page" classname="grid-and-list">
                    <div id="topbar">
                        <div id="gridfilter" className="innerwidth flex-left">
                            <div id="filter-column"> </div>
                            <div id="filter-selections">
                                <select
                                    value={listOrder}
                                    onChange={handleOrder}
                                    className="form-control-sm"
                                    label="Järjestys">
                                    <option value="DESC">Laskeva</option>
                                    <option value="ASC">Nuoseva</option>
                                </select>

                                <select
                                    value={listTitle}
                                    onChange={handleListTitle}
                                    label="Järjestys"
                                    className="form-control-sm"
                                >
                                    <option value="createdAt">Luontijärjestys</option>
                                    <option value="updatedAt">Muokattu</option>
                                    <option value="title">Nimi</option>
                                    <option value="markedImportant">Merkattu tärkeäksi</option>
                                </select>
                                <select className="form-control-sm"
                                    value={pageSize}
                                    onChange={handlePageSizeChange}
                                    label="Määrä">
                                    {pageSizes.map((size, index) => (
                                        <option value={size} key={index}> {size}</option>
                                    ))}
                                </select>
                            </div>
                            <div id="filter-search">
                                <input
                                    value={searchTitle}
                                    onChange={onChangeSearchTitle}
                                    onKeyDown={handleKeyDown}
                                    cass="form-control"
                                    aria-label="Sizing example input"
                                    aria-describedby="inputGroup-sizing-sm"
                                />

                                <button
                                    variant="contained" size="small" color="primary"
                                    onClick={retrieveLocations}
                                    className="btn btn-primary btn-sm"
                                >
                                    Etsi
                              </button>
                            </div>
                        </div>
                    </div>
                    <Pagination
                        className="my-3"
                        count={count}
                        page={page}
                        siblingCount={1}
                        boundaryCount={1}
                        shape="rounded"
                        onChange={handlePageChange}
                        variant="outlined"
                    />
                    <div id="content" className="innerwidth">

                        <Tabs defaultActiveKey="gridView" transition={false} variant="pills">
                            <Tab eventKey="gridView" title="Ruudukkonäkymä">
                                <div id="gird" className="flex-left innerwidth locationGrid-page">
                                    {locations &&
                                        locations.map((location, index) => (

                                            <div className="location" key={index}>
                                                <div className="innercontainer">
                                                    <div className="location-head">
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
                                                    </div>
                                                    <div className="location-body">
                                                        <LeafletMap
                                                            center={[location.coordinateN, location.coordinateE]}
                                                            zoom={15}
                                                            maxZoom={20}
                                                            attributionControl={true}
                                                            zoomControl={false}
                                                            doubleClickZoom={false}
                                                            scrollWheelZoom={false}
                                                            dragging={false}
                                                            animate={true}
                                                            easeLinearity={0.35}
                                                        >
                                                            <TileLayer url="https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png" />
                                                            <Marker
                                                                icon={
                                                                    location.markedImportant
                                                                        ? importantMarkerIcon
                                                                        : customMarkerIcon
                                                                }
                                                                position={[location.coordinateN, location.coordinateE]}
                                                            >
                                                                <Popup>
                                                                    {location.title}
                                                                </Popup>
                                                            </Marker>
                                                        </LeafletMap>

                                                        <div className="metadata flex">
                                                            <Link
                                                                to={'/view/' + location.id}
                                                                className="open-page button"
                                                            >
                                                                Avaa
                                                            </Link>
                                                        </div>
                                                        <div className="location-inner-body">
                                                            <div className="description white-space">
                                                                <ShowMoreText
                                                                    lines={5}
                                                                    more="Näytä enemmän"
                                                                    less="Näytä vähemmän"
                                                                    anchorClass=""
                                                                    expanded={false}
                                                                >
                                                                    {location.description}
                                                                </ShowMoreText>
                                                            </div>
                                                            <div className="meta">
                                                                {location.url
                                                                    ? <a className="link-to-out" href={location.url}>
                                                                        <Icon className="material-icons">link</Icon>
                                                                        {' '}
                                                                        {location.url}
                                                                    </a>
                                                                    : ''}
                                                                {location.flickrMore
                                                                    ? <a
                                                                        className="link-to-flickr"
                                                                        href={location.flickrMore}
                                                                    >
                                                                        <Icon className="material-icons">link</Icon>
                                                                        {' '}
                                                                        {location.flickrMore}
                                                                    </a>
                                                                    : ''}
                                                                {location.flickrTag
                                                                    ? <div className="flickr-lightbox">
                                                                        <FlickrLightbox
                                                                            api_key={process.env.REACT_APP_FLICKR_API}
                                                                            searchTerm={location.flickrTag}
                                                                            limit={10}
                                                                            user_id={process.env.REACT_APP_FLICKR_USERNAME}
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
                                                        </div>
                                                    </div>
                                                </div></div>
                                        ))}
                                </div>
                            </Tab>
                            <Tab eventKey="listView" title="Listanäkymä">
                                <div id="list" className="flex-left innerwidth location-management">
                                {locations &&
                                        locations.map((location, index) => (
                                        <div key={index} className="row">
                                            <div className="col-sm headline">
                                                {location.markedImportant
                                                    ? <div className="float-right">
                                                        <Icon className="favorite">favorite</Icon>
                                                    </div>
                                                    : ''}
                                                <h6>
                                                    <Link to={'/view/' + location.id}>
                                                        {location.title}
                                                    </Link>
                                                </h6>
                                                <div className="time-and-place">
                                                    <div className="coordinates">
                                                        <span className="material-icons">place</span>
                                                        {' '}{' '}
                                                        {location.coordinateN}
                                                     ,
                                                     {location.coordinateE}
                                                    </div>
                                                    <div className="date">

                                                        <div>
                                                            <span className="material-icons" title="Julkaistu">
                                                                schedule
                                                        </span>
                                                            <Moment format="DD.MM.YYYY">
                                                                {location.createdAt}
                                                            </Moment>
                                                        </div>
                                                        <div>
                                                            <span className="material-icons" title="Päivitetty">
                                                                update
                                                        </span>
                                                            <Moment format="DD.MM.YYYY">
                                                                {location.updatedAt}
                                                            </Moment>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                         
                                            <div className="col-lg description">
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
                                            <div className="col-sm control">
                                                <p>
                                                    <Link to={'/view/' + location.id} className="open">
                                                        Avaa
                                                </Link>
                                                </p>
                                            </div>

                                        </div>
                                    ))}{' '}
                                </div>
                            </Tab>
                        </Tabs>
                    </div>
                    <Pagination
                        className="my-3"
                        count={count}
                        page={page}
                        siblingCount={1}
                        boundaryCount={1}
                        shape="rounded"
                        onChange={handlePageChange}
                        variant="outlined"
                    />
                </div>} </>
    );
}
export default GridAndListView;