import React from 'react';
import {Link} from 'react-router-dom';
import Diver from '../resources/diver.png';
import SEO from '@americanexpress/react-seo';

document.onkeydown = function (evt) {
  evt = evt || window.event;
  if (evt.keyCode === 220) {
    window.open (process.env.REACT_APP_ADMIN_BASE_URL + '/add', '_self');
  }
};

class NotFoundPage extends React.Component {
  render () {
    return (
      <div id="page">
              <SEO
      title={"Paikkatietokanta - 404"}
      description="Sivua ei löydy."
      siteUrl={process.env.REACT_APP_BASE_URL + '/404/'}
      image={{
        src: process.env.REACT_APP_BASE_URL + '/logo512.png'
      }}
    />
        <div style={{marginTop: '40px', textAlign: 'center'}}>
          <p><img src={Diver} style={{width: '200px'}} alt="Diver" /></p>
          <h2>Sivua ei löydy</h2>
          <p><Link to="/" className="btn">Palaa takaisin etusivulle</Link></p>
        </div>
      </div>
    );
  }
}
export default NotFoundPage;
