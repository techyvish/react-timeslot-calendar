import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import '../../styles/demo/main.scss';
import ReactTimeslotCalendar from './../react-timeslot-calendar.jsx';


export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.initialDate = moment();
    this.state = {
      bookedDates: [ ],
    };
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
            ['21', '22'],
            ['22', '23'],
            ['24', '1'],
          ] }
          maxTimeslots = { 3 }
          onSelectTimeslot = { (timeslots, lastSelected) => {
            console.log('All Timeslots:');
            console.log(timeslots);

            console.log('Last selected timeslot:');
            console.log(lastSelected);
          } }
          renderWeeks = { 4 }
          bookedTimeslots = { this.state.bookedDates }
          onPressPreviousWeek = { (startOfTheWeek) => {
            console.log(startOfTheWeek);
          } }
          onPressNextWeek = { (startOfTheWeek) => {
            console.log(startOfTheWeek);
          } }
        />
      </div>
    );
  }


}

ReactDOM.render(<App />, document.getElementById('react-timeslot-calendar'));

// [
//   {
//     startDate: 'October 5th 2020, 9:00:00 PM',
//     format: 'MMMM Do YYYY, h:mm:ss A',
//   },
//   {
//     startDate: 'October 8th 2020, 10:00:00 PM',
//     format: 'MMMM Do YYYY, h:mm:ss A',
//   },
// ]