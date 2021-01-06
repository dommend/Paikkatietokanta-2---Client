import React from "react";
import { BrowserRouter as Router, Switch, Route, NavLink, Redirect } from "react-router-dom";
import { Navbar, Nav } from 'react-bootstrap';
import { Preloader, Placeholder } from 'react-preloading-screen';
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.scss";
import LocationsView from "./components/LocationsView";
import ModuleView from "./components/ModuleView";
import MapView from "./components/MapView";
import TagView from "./components/tagView";
import Archive from "./components/ArchivePage";
import GridAndListView from "./components/GridAndListView";
import InfoPage from "./components/InfoPage";
import LocationView from "./components/LocationView";
import NotFoundPage from './components/NotFoundPage';
import Spinner from 'react-bootstrap/Spinner';

function App() {
  return (
    <Router>
      <Navbar expand="md" variant="dark">
        <Navbar.Brand href="/">
          Paikkatietokanta
        </Navbar.Brand>
  
           <Nav> 
            <ul>
              <li className="nav-item">
                <NavLink to={"/locations"} className="nav-link frontpage" activeClassName="active">
                <span className="material-icons">home</span> <span className="nav-title">Etusivu</span>
              </NavLink >
              </li>
              <li className="nav-item module">
                <NavLink to={"/module"} className="nav-link module" activeClassName="active">
                <span className="material-icons">dashboard</span> <span className="nav-title">Moduuli</span>
              </NavLink >
              </li>
              <li className="nav-item">
                <NavLink to={"/map"} className="nav-link map" activeClassName="active">
                <span className="material-icons">map</span> <span className="nav-title">Map</span>
              </NavLink >
              </li>
              <li className="nav-item">
                <NavLink to={"/grid"} className="nav-link grid" activeClassName="active">
                <span className="material-icons">grid_on</span> <span className="nav-title">Grid / List</span>
              </NavLink >
              </li>
               <li className="nav-item">
                <NavLink to={"/archive"} className="nav-link archive" activeClassName="active">
                <span className="material-icons">today</span> <span className="nav-title">Arkisto</span>
              </NavLink >
              </li> 
              <li className="nav-item">
                <NavLink to={"/info"} className="nav-link info" activeClassName="active">
                <span className="material-icons">info</span> <span className="nav-title">Info</span>
              </NavLink >
              </li>
            </ul>
          </Nav>
      </Navbar> 

      <main>
        { /* Switch / Route */}
        <Switch>
          <Redirect exact from="/" to="/locations" />
          <Route exact path={["/", "/locations"]} component={LocationsView} />
          <Route exact path="/module" component={ModuleView} />
          <Route exact path="/map" component={MapView} />
          <Route exact path="/grid" component={GridAndListView} />
          <Route exact path="/archive" component={Archive} />
          <Route exact path="/info" component={InfoPage} />
          <Route exact path="/view/:id" component={LocationView} />
          <Route exact path="/tag/:id" component={TagView} />
          { /* 404-page */}
          <Route path="*" component={NotFoundPage} />
        </Switch>
      </main>
      <Preloader>
        <Placeholder>
        <Spinner animation="border" variant="primary" /> 
        </Placeholder>
      </Preloader>

    </Router>
  );
}
export default App;
