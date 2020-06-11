import React from 'react';
import {Link} from 'react-router-dom';
import {Map as LeafletMap, TileLayer, Marker, Popup} from 'react-leaflet';
import Icon from '@material-ui/core/Icon';
import {icon as leafletIcon} from 'leaflet';
import 'react-slicer/build/react-slicer.css';
import ShowMoreText from 'react-show-more-text';
import Moment from 'react-moment';

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
      fetch (process.env.REACT_APP_BASE_URL + `/api/locations/paged-long?page=${page}`, {
        method: 'GET',
      })
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
      <div id="page" className="location-management">
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
            <div key={location} className="row">
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
                <div class="time-and-place">
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
              <div className="col-sm map">
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
              </div>
              <div className="col-sm description">
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
