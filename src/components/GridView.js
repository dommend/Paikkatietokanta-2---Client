import React from 'react';
import {Link} from 'react-router-dom';
import {Map as LeafletMap, TileLayer, Marker, Popup} from 'react-leaflet';
import ReactPlayer from 'react-player';
import FlickrLightbox from 'react-flickr-lightbox';
import Icon from '@material-ui/core/Icon';
import {icon as leafletIcon} from 'leaflet';
import ShowMoreText from 'react-show-more-text';
import SEO from '@americanexpress/react-seo';

document.onkeydown = function (evt) {
  evt = evt || window.event;
  if (evt.keyCode === 220) {
    window.open (process.env.REACT_APP_ADMIN_BASE_URL + '/add', '_self');
  }
};

class GridView extends React.Component {
  constructor (props) {
    super (props);

    this.state = {
      pager: {},
      pageOfItems: [],
    };
  }

  componentDidMount () {
    this.loadPage ();
  }

  componentDidUpdate () {
    this.loadPage ();
  }

  loadPage () {
    // get page of items from api
    const params = new URLSearchParams (window.location.search);
    const page = parseInt (params.get ('page')) || 1;
    if (page !== this.state.pager.currentPage) {
      fetch (
        process.env.REACT_APP_BASE_URL + `/api/locations/paged?page=${page}`,
        {
          method: 'GET',
        }
      )
        .then (response => response.json ())
        .then (({pager, pageOfItems}) => {
          this.setState ({pager, pageOfItems});
        });
    }
  }
  render () {
    const {pager, pageOfItems} = this.state;

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

    return (
      <div id="page" className="locationGrid-page">
        <SEO
          title="Ruudukkonäkymä - Paikkatietokanta"
          description="Paikkatietokanta yhdistää valokuvaharrastus, historiallinen dokumentointi ja ammatillinen focus kehittyä paremmaksi koodariksi. Sivuston on tarkoitettu henkilökohtaiseen käyttöön."
          locale="fi_FI"
          siteUrl={process.env.REACT_APP_BASE_URL + '/grid/'}
          image={{
            src: process.env.REACT_APP_BASE_URL + '/logo512.png',
          }}
          openGraph={{
            title: 'Ruudukkonäkymä - Paikkatietokanta',
            description: 'Paikkatietokanta yhdistää valokuvaharrastus, historiallinen dokumentointi ja ammatillinen focus kehittyä paremmaksi koodariksi. Sivuston on tarkoitettu henkilökohtaiseen käyttöön.',
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
        {pager.pages &&
          pager.pages.length &&
          <div className="page-navigation">
            <ul className="pagination">
              <li
                className={`page-item first-item ${pager.currentPage === 1 ? 'disabled' : ''}`}
              >
                <Link to={{search: `?page=1`}} className="page-link">
                  <span class="material-icons">first_page</span>
                </Link>
              </li>
              <li
                className={`page-item previous-item ${pager.currentPage === 1 ? 'disabled' : ''}`}
              >
                <Link
                  to={{search: `?page=${pager.currentPage - 1}`}}
                  className="page-link"
                >
                  <span class="material-icons">chevron_left</span>
                </Link>
              </li>
              {pager.pages.map (page => (
                <li
                  key={page}
                  className={`page-item number-item ${pager.currentPage === page ? 'active' : ''}`}
                >
                  <Link to={{search: `?page=${page}`}} className="page-link">
                    {page}
                  </Link>
                </li>
              ))}
              <li
                className={`page-item next-item ${pager.currentPage === pager.totalPages ? 'disabled' : ''}`}
              >
                <Link
                  to={{search: `?page=${pager.currentPage + 1}`}}
                  className="page-link"
                >
                  <span class="material-icons">chevron_right</span>
                </Link>
              </li>
              <li
                className={`page-item last-item ${pager.currentPage === pager.totalPages ? 'disabled' : ''}`}
              >
                <Link
                  to={{search: `?page=${pager.totalPages}`}}
                  className="page-link"
                >
                  <span class="material-icons">last_page</span>
                </Link>
              </li>
            </ul>
          </div>}
        <div id="pagination" className="flex-left innerwidth">
          {pageOfItems.map (location => (
            <div className="location" key={location}>
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
                    doubleClickZoom={true}
                    scrollWheelZoom={true}
                    dragging={true}
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
              </div>
            </div>
          ))}{' '}
        </div>
        {pager.pages &&
          pager.pages.length &&
          <div className="page-navigation">
            <ul className="pagination">
              <li
                className={`page-item first-item ${pager.currentPage === 1 ? 'disabled' : ''}`}
              >
                <Link to={{search: `?page=1`}} className="page-link">
                  <span class="material-icons">first_page</span>
                </Link>
              </li>
              <li
                className={`page-item previous-item ${pager.currentPage === 1 ? 'disabled' : ''}`}
              >
                <Link
                  to={{search: `?page=${pager.currentPage - 1}`}}
                  className="page-link"
                >
                  <span class="material-icons">chevron_left</span>
                </Link>
              </li>
              {pager.pages.map (page => (
                <li
                  key={page}
                  className={`page-item number-item ${pager.currentPage === page ? 'active' : ''}`}
                >
                  <Link to={{search: `?page=${page}`}} className="page-link">
                    {page}
                  </Link>
                </li>
              ))}
              <li
                className={`page-item next-item ${pager.currentPage === pager.totalPages ? 'disabled' : ''}`}
              >
                <Link
                  to={{search: `?page=${pager.currentPage + 1}`}}
                  className="page-link"
                >
                  <span class="material-icons">chevron_right</span>
                </Link>
              </li>
              <li
                className={`page-item last-item ${pager.currentPage === pager.totalPages ? 'disabled' : ''}`}
              >
                <Link
                  to={{search: `?page=${pager.totalPages}`}}
                  className="page-link"
                >
                  <span class="material-icons">last_page</span>
                </Link>
              </li>
            </ul>
          </div>}
      </div>
    );
  }
}
export default GridView;