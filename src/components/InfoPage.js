import React from 'react';
import Diver from '../resources/diver.png';
import SEO from '@americanexpress/react-seo';

document.onkeydown = function (evt) {
  evt = evt || window.event;
  if (evt.keyCode === 220) {
    window.open (process.env.REACT_APP_ADMIN_BASE_URL + '/add', '_self');
  }
};
class Info extends React.Component {
  render () {
    return (
      <div id="page" className="content-page">
        <SEO
          title="Info - Paikkatietokanta"
          description="Paikkatietokanta yhdistää valokuvaharrastus, historiallinen dokumentointi ja ammatillinen päämäärä kehittyä paremmaksi koodariksi. Sivuston on tarkoitettu henkilökohtaiseen käyttöön."
          locale="fi_FI"
          siteUrl={process.env.REACT_APP_BASE_URL + '/info/'}
          image={{
            src: process.env.REACT_APP_BASE_URL + '/logo512.png',
          }}
          openGraph={{
            title: 'Info - Paikkatietokanta',
            description: 'Paikkatietokanta yhdistää valokuvaharrastus, historiallinen dokumentointi ja ammatillinen päämäärä kehittyä paremmaksi koodariksi. Sivuston on tarkoitettu henkilökohtaiseen käyttöön.',
            type: 'article',
            siteName: 'Paikkatietokanta',
            url: process.env.REACT_APP_BASE_URL + '/info/',
            locale: 'fi_FI',
            image: {
              src: process.env.REACT_APP_BASE_URL + '/logo512.png',
              alt: 'Info - Paikkatietokanta',
            },
          }}
        />
        <div className="innerwidth">
          <div className="innercontainer">

            <div className="row">
              <div className="col-sm">
                <h2>Tietoa paikkatietokannasta</h2>
                <p>
                  Paikkatietokanta on <a href="http://penttinen.fi/">Jani Penttisen</a> päättöprojektina syntynyt sivusto. Paikkatietokannan tarkoitus on yhdistää valokuvaharrastus, historiallinen dokumentointi ja ammatillinen päämäärä kehittyä paremmaksi koodariksi. Sivuston on tarkoitettu henkilökohtaiseen käyttöön.
                </p>

                <p>
                  Sivusto on rakennettu käyttämällä: <br />
                  <code>HTML5, SASS, MySQL, React, Node</code> ja palju <code>kohvi.</code>
                </p>

                <p>Sivuston lähdekoodi on ladattavissa GitHubissa.</p>

                <a
                  href="https://github.com/dommend/paikkatietokanta"
                  style={{margin: '40px 0px 20px 0px', padding: '25px'}}
                  className="btn btn-outline-info btn-block"
                >

                  <span style={{fontSize: '50px'}} className="material-icons">
                    save
                  </span>
                  <br />
                  <strong>Paikkatietokanta 1.4.9 (Client with Admin)</strong>
                  <br />
                  <small>
                    Huom. Versiossa ei olla eroteltu ylläpitoa ja käyttäjärajapintaa.
                  </small>
                </a>
              </div>
              <div className="col-sm">
                <div class="text-center">
                  <img src={Diver} style={{width: '280px'}} alt="Diver" />
                </div>
              </div>
            </div>
            <div class="row space">

              <div className="col-sm">

                <a
                  href="https://github.com/dommend/Paikkatietokanta-2---Client"
                  style={{marginBottom: '20px', padding: '25px'}}
                  className="btn btn-outline-info btn-block"
                >

                  <span style={{fontSize: '50px'}} className="material-icons">
                    save
                  </span>
                  <br />
                  <strong>Paikkatietokanta 2.x (Client)</strong> <br />
                  <small>Käyttäjärajapinta</small>
                </a>
              </div>

              <div className="col-sm">
                <a
                  href="https://github.com/dommend/Paikkatietokanta-2----Admin"
                  style={{marginBottom: '20px', padding: '25px'}}
                  className="btn btn-outline-info btn-block"
                >

                  <span style={{fontSize: '50px'}} className="material-icons">
                    save
                  </span>
                  <br />
                  <strong>Paikkatietokanta 2.x (Admin)</strong> <br />
                  <small>Ylläpito</small>
                </a>
              </div>

            </div>

            <div className="row space">
              <div className="col-sm">

                <hr style={{margin: '10px 0px 50px 0px'}} />

                <h4>
                  Ohjeet sivuston ajamiseen (Paikkatietokanta 2.0 - Client)
                </h4>

                <p>
                  Ajaekseen sivua, sinulla tulee olla <a href="https://nodejs.org/en/">node.js</a> ja mysql-tietokanta.
                </p>

                <blockquote>
                  <ol>
                    <li>Aja <code>npm install</code></li>
                    <li>
                      Muuta tietokanta-asetukset tiedostosta <code>db.config.</code>                      Tiedosto löytyy @ <code>app/config/db.config.js</code>
                    </li>
                    <li>
                      Luo esimerkin mukainen <code>.env.local</code> -tiedosto kansion juureen:
                      <blockquote>
                        <code>
                          PORT=8080 <br />
                          REACT_APP_BASE_URL=https://paikkatietokanta.net <br />
                          REACT_APP_ADMIN_BASE_URL=https://admin.paikkatietokanta.net<br />
                          REACT_APP_API_URL=https://paikkatietokanta.net/api/ <br />
                          REACT_APP_FLICKR_API="12345" <br />
                          REACT_APP_FLICKR_USERNAME="12345@N00" <br />
                          REACT_APP_OW_API="12345" <br />
                          REACT_APP_MAPTILER_API="12345"
                        </code>
                      </blockquote>
                      <small>
                        <code>REACT_APP_FLICKR_API</code> on Flickr:n api (
                        <a href="https://www.flickr.com/services/apps/create/apply">
                          https://www.flickr.com/services/apps/create/apply
                        </a>
                        )
                        <br />
                        <code>REACT_APP_FLICKR_USERNAME</code> on Flickr:n käyttäjänimi (
                        <a href="https://help.flickr.com/find-your-flickr-login-id-HytypXj1Q">
                          https://help.flickr.com/find-your-flickr-login-id-HytypXj1Q
                        </a>
                        )
                        <br />
                        <code>REACT_APP_OW_API</code> on OpenWeather api (
                        <a href="https://openweathermap.org/">
                          https://openweathermap.org/
                        </a>
                        )
                        <br />
                        <code>REACT_APP_MAPTILER_API</code> on MapTiler api (
                          <a href="https://www.maptiler.com/">
                          https://www.maptiler.com/
                        </a>)   
                        <br />  <br />
                        Huom! Sivusto käyttää karttoina
                        <a href="https://stadiamaps.com/">Stadiamaps.com</a>
                        :n kartta layeriä. Jotta kartat näkyisivät verkossa oikein, tulee sinun tehdä tunnus palveluun.
                      </small>  <br /> <br />
                    </li>
                    <li>
                      Aja <code>node.server</code> tai <code>npm run-script dev</code> -- Jos tietokantoja ei ole, ne luodaan. <code>Server.js</code> pyörii portissa 8080.
                    </li>
                    <li>
                      Aja <code>npm start</code> -- Käynnistää sivuston portissa 8081.
                    </li>
                  </ol>
                </blockquote>

                <h5>Porteista</h5>
                <p>
                  Portien asetukset määritetään <code>.env.local</code> -tiedososta. Varsinaiset asetukset löytyvät tiedostoista <code>server.js</code> ja <code>src/http-commons.</code>
                </p>

                <p>
                  <code>Node server.js</code> pyörii portissa 8080. <br />
                  Paikkatitokanta (<code>npm start</code>) pyörii portissa 8081
                </p>

                <h5>Ennen kuin ajat build-scriptin</h5>
                <p>
                  Ennen kuin ajat build-scriptin, käy muuttamassa <code>REACT_APP_API_URL</code> oikeaksi <code>.env.local</code> -tiedostosta. Tarkista myös <code>'homepage address'</code> tiedostosta <code>package.json.</code> Ajattaessa lokaalisti <code>homepage address</code> voi olla<code>"./"</code>.  Mikäli osoite on väärin, sivusto avautuu pelkkänä valkoisena näkymänä. Verkkoa varten tämän voi muuttaa vastaamaan verkkotunnusta.
                </p>

                <h5>Sivuston ajaminen verkossa ja htaccess</h5>
                <p>
                  Jotta sivusto päivittyisi oikein, täytyy alla oleva <code>.htaccess</code>
                  -tiedosto olla olemassa sivuston juuressa. Ilman htaccess-tiedostoa sivuston päivitys saattaa aiheuttaa valkoisen ruudun.
                </p>
                <blockquote>
                  <code>
                    &lt;IfModule mod_rewrite.c&gt; <br />
                    RewriteEngine On<br />
                    RewriteBase /<br />
                    RewriteRule ^index.html$ - [L]<br />
                    RewriteCond % &#x0007B;REQUEST_FILENAME&#x0007D; !-f<br />
                    RewriteCond % &#x0007B;REQUEST_FILENAME&#x0007D; !-d<br />
                    RewriteCond % &#x0007B;REQUEST_FILENAME&#x0007D; !-l<br />
                    RewriteRule . /index.html [L]<br />
                    &lt;/IfModule&gt;
                  </code>
                </blockquote>

                <h6>Lisää vielä tämä /api -kansion juureen</h6>
                <p>
                  Tämä kytkee aikaisemmin määrittämät rewrite-arvot pois api-kansiosta.
                </p>

                <blockquote>
                <code>RewriteEngine Off</code>
                </blockquote>

                <hr style={{margin: '50px 0px 50px 0px'}} />

                <h4>
                  Ohjeet sivuston ajamiseen (Paikkatietokanta 2.0 - Admin)
                </h4>

                <p>
                  Ohjeet ovat muuten samat, mutta <code>.env.local</code> -tiedoston sisältö on seuraava:
                </p>

                <blockquote>
                  <code>
                    PORT=8080 <br />
                    REACT_APP_BASE_URL=https://paikkatietokanta.net <br />
                    REACT_APP_ADMIN_BASE_URL=https://admin.paikkatietokanta.net
                  </code>
                </blockquote>

                <p>Huom. Ylläpito ei sisällä kirjautumista tai käyttäjärooleja.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default Info;