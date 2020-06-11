import React, {Component} from 'react';
import TextScramble from 'react-textscramble';
import '../App.scss';

export default class MainScreen extends Component {
  constructor () {
    super ();

    this.state = {
      scrambleProgess: 0,
    };
  }
  render () {
    let phrases = [
      'Hello, friend!',
      "My name is Mr. Happy Robot <br /> and I'm one happy coder :)",
      "I've build this site using newest and coolest technologies like React and Node 👍",
      'My skills are still under development...',
      '...You could say my download progress of the internet is still going on',
      'Nevertheless I hope you enjoy your stay... So...',
      'Welcome to my site and stay happy! <br /> *End of transmission*',
      '<h1>Paikkatietokanta</h1>',
    ];
    let freezeDuration = 4000;
    return (
      <div className="scramble-container">
        <TextScramble
          phrases={phrases}
          freezeDuration={freezeDuration}
          reportProgress={progress => {
            this.setState ({scrambleProgess: progress});
          }}
        />
      </div>
    );
  }
}
