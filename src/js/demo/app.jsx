import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import '../../styles/demo/main.scss';
import ReactTimeslotCalendar from './../react-timeslot-calendar.jsx';


export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.initialDate = moment();

  }
  render() {
    return (
      <div className = "app">
        <h1> React Timeslot Calendar </h1>
        { this._customTimeslotSnippetRender() }
      </div>
    );
  }

  _customTimeslotSnippetRender() {
    return (
      <div>
        <ReactTimeslotCalendar
          initialDate = { this.initialDate.format() }
          timeslots = { [
            ['9', '10'],
            ['10', '11'],
            ['18'],
          ] }
          maxTimeslots = { 3 }
          onSelectTimeslot = { (timeslots, lastSelected) => {
            console.log('All Timeslots:');
            console.log(timeslots);

            console.log('Last selected timeslot:');
            console.log(lastSelected);
          } }
          renderWeeks = { 1 }
          onPressPreviousWeek = { () => {
            console.log('p');
          } }
          onPressNextWeek = { () => {
            console.log('n');
          } }
        />
      </div>
    );
  }


}

ReactDOM.render(<App />, document.getElementById('react-timeslot-calendar'));
