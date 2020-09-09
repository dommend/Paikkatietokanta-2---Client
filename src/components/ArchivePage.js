import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import SEO from '@americanexpress/react-seo';
import LocationDataService from '../services/LocationService';
import Spinner from 'react-bootstrap/Spinner';

document.onkeydown = function (evt) {
  evt = evt || window.event;
  if (evt.keyCode === 220) {
    window.open (process.env.REACT_APP_ADMIN_BASE_URL + '/add', '_self');
  }
};

const TagView = props => {
  const [locations, setLocations] = useState ([]);
  const [locationTags, setLocationTags] = useState (null);
  const [isLoading, setLoading] = useState (true);

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

  const retrieveLocationTags = () => {
    LocationDataService.getAllTags ()
      .then (response => {
        setLocationTags (response.data.reverse ());
      })
      .catch (e => {
        console.log (e);
      });
  };

  useEffect (() => {
    retrieveLocations ();
    retrieveLocationTags ();
  }, []);

  return (
    <div id="page" className="content-page archive">
      <SEO
        title="Arkisto - Paikkatietokanta"
        description="Paikkatietokanta yhdistää valokuvaharrastus, historiallinen dokumentointi ja ammatillinen päämäärä kehittyä paremmaksi koodariksi. Sivuston on tarkoitettu henkilökohtaiseen käyttöön."
        locale="fi_FI"
        siteUrl={process.env.REACT_APP_BASE_URL + '/info/'}
        image={{
          src: process.env.REACT_APP_BASE_URL + '/logo512.png',
        }}
        openGraph={{
          title: 'Arkisto - Paikkatietokanta',
          description: 'Paikkatietokanta yhdistää valokuvaharrastus, historiallinen dokumentointi ja ammatillinen päämäärä kehittyä paremmaksi koodariksi. Sivuston on tarkoitettu henkilökohtaiseen käyttöön.',
          type: 'article',
          siteName: 'Paikkatietokanta',
          url: process.env.REACT_APP_BASE_URL + '/info/',
          locale: 'fi_FI',
          image: {
            src: process.env.REACT_APP_BASE_URL + '/logo512.png',
            alt: 'Arkisto - Paikkatietokanta',
          },
        }}
      />

      {isLoading
        ? <div className="loader">
            <Spinner animation="border" variant="primary" />
          </div>
        : <div className="innerwidth">
            <div className="innercontainer">

              <h4>Avainsanat</h4>
              <hr />
              <div className="tags">
                {locationTags &&
                  locationTags
                    .sort ((a, b) => a.tagName.localeCompare (b.tagName))
                    .map ((locationTags, index) => (
                      <span className="tag" key={index}>
                        <Link to={'/tag/' + locationTags.id}>
                          <span className="material-icons">local_offer</span>
                          <span className="tag-name">
                            {locationTags.tagName}
                          </span>
                        </Link>
                      </span>
                    ))}
              </div>

              <h4>Paikat</h4>
              <hr />
              <ul className="archive-content">
                {locations &&
                  locations
                    .sort ((a, b) => a.title.localeCompare (b.title))
                    .map ((location, index) => (
                      <li key={index}>
                        <Link to={'/view/' + location.id}>
                          {location.title}
                        </Link>
                      </li>
                    ))}
              </ul>

            </div>
          </div>}

    </div>
  );
};
export default TagView;
