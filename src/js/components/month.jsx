import React from 'react';
import PropTypes from 'prop-types';
import helpers from './../util/helpers';
import Week from './week.jsx';

export default class Month extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentWeekIndex: this._getStartingWeek(props.currentDate, props.weeks),
      weeksToRenderCount: 0,
    };

    this._renderNextButton = this._renderNextButton.bind(this);
    this._renderPreviousButton = this._renderPreviousButton.bind(this);
    this._onNextWeekClicked = this._onNextWeekClicked.bind(this);
    this._onPrevWeekClicked = this._onPrevWeekClicked.bind(this);
  }

  _getStartingWeek(currentDate, weeks) {
    // find out staring week:
    const currentDateWithoutTime = currentDate.startOf('day');
    let startingWeek  = 0;
    weeks.some((week, index) => {
      let weekContainsDate = week.some((day) => {
        const momentDay = helpers.getMomentFromCalendarJSDateElement(day);
        return momentDay.format() === currentDateWithoutTime.format();
      });

      if (weekContainsDate) {
        startingWeek = index;
        return weekContainsDate;
      }
    });

    return startingWeek;
  }

  render() {

    return (
      <div className = "tsc-month">
        { this._renderActions() }
        { this._renderWeek() }
      </div>
    );
  }

  _renderNextButton(renderWeeks) {
    if ( !renderWeeks || renderWeeks == 0 ) {
      return (<div className = "tsc-month__action tsc-month__action-element tsc-month__action-element--right" onClick = { () => this._onNextWeekClicked() }>
                &#8250;
              </div>);
    }

    return (this.state.weeksToRenderCount <= renderWeeks) ? (
      <div className = "tsc-month__action tsc-month__action-element tsc-month__action-element--right" onClick = { () => this._onNextWeekClicked() }>
        &#8250;
      </div>): <div></div>;
  }

  _renderPreviousButton(renderWeeks) {
    if ( !renderWeeks || renderWeeks == 0 ) {
      return (<div className = "tsc-month__action tsc-month__action-element tsc-month__action-element--left" onClick = { () => this._onPrevWeekClicked() }>
                &#8249;
              </div>);
    }

    return this.state.weeksToRenderCount >= -renderWeeks ? (
      <div className = "tsc-month__action tsc-month__action-element tsc-month__action-element--left" onClick = { () => this._onPrevWeekClicked() }>
        &#8249;
      </div>) : <div></div>;
  }

  _renderActions() {
    const {
      weeks,
      renderWeeks,
    } = this.props;

    const {
      currentWeekIndex,
    } = this.state;

    const currentWeek = weeks[currentWeekIndex];
    const startDate = helpers.getMomentFromCalendarJSDateElement(currentWeek[0]);
    const endDate = helpers.getMomentFromCalendarJSDateElement(currentWeek[currentWeek.length - 1]);
    const actionTitle = `${startDate.format('MMM Do')} - ${endDate.format('MMM Do')}`;


    return (
      <div className = "tsc-month__actions">
        {this._renderPreviousButton(renderWeeks)}
        <div className = "tsc-month__action tsc-month__action-title">
          { actionTitle }
        </div>
        {this._renderNextButton(renderWeeks)}
      </div>
    );
  }

  _renderWeek() {
    const {
      currentWeekIndex,
    } = this.state;

    const {
      weeks,
      initialDate,
      timeslots,
      timeslotProps,
      selectedTimeslots,
      disabledTimeslots,
      renderDays,
      bookedTimeslots,
    } = this.props;

    console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
    console.log(currentWeekIndex);
    console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
    return (
      <Week
        weekToRender = { weeks[currentWeekIndex] }
        onTimeslotClick = { this._onTimeslotClick.bind(this) }
        initialDate = { initialDate }
        timeslots = { timeslots }
        timeslotProps = { timeslotProps }
        selectedTimeslots = { selectedTimeslots }
        disabledTimeslots = { disabledTimeslots }
        bookedTimeslots = { bookedTimeslots }
        renderDays = { renderDays }
      />
    );
  }

  _onTimeslotClick(timeslot) {
    const {
      onTimeslotClick,
    } = this.props;

    onTimeslotClick(timeslot);
  }

  /**
   * Handles prev week button click.
   */
  // eslint-disable
  _onPrevWeekClicked() {
    const {
      currentWeekIndex,
    } = this.state;

    const {
      onWeekOutOfMonth,
      weeks,
      onPressPreviousWeek,
    } = this.props;

    if (currentWeekIndex - 1 >= 0) {
      this.setState({
        currentWeekIndex: currentWeekIndex - 1,
      });
    }
    else if (onWeekOutOfMonth) {
      const firstDayOfPrevWeek = helpers.getMomentFromCalendarJSDateElement(weeks[0][0]).clone().subtract(1, 'days');
      onWeekOutOfMonth(firstDayOfPrevWeek);
    }
    this.setState({weeksToRenderCount: this.state.weeksToRenderCount - 1 });

    if (onPressPreviousWeek) {
      onPressPreviousWeek();
    }
  }

  /**
   * Handles next week button click.
   */
  _onNextWeekClicked() {
    const {
      currentWeekIndex,
    } = this.state;

    const {
      weeks,
      onWeekOutOfMonth,
      onPressNextWeek,
    } = this.props;

    if (currentWeekIndex + 1 < weeks.length) {
      this.setState({
        currentWeekIndex: currentWeekIndex + 1,
      });
    }
    else if (onWeekOutOfMonth) {
      const lastDay = weeks[currentWeekIndex].length - 1;
      const firstDayOfNextWeek = helpers.getMomentFromCalendarJSDateElement(weeks[currentWeekIndex][lastDay]).clone().add(1, 'days');
      console.log(firstDayOfNextWeek);
      onWeekOutOfMonth(firstDayOfNextWeek);
    }
    this.setState({weeksToRenderCount: this.state.weeksToRenderCount + 1 });
    if (onPressNextWeek){
      onPressNextWeek();
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) { //eslint-disable-line camelcase
    this.setState({
      currentWeekIndex: this._getStartingWeek(nextProps.currentDate, nextProps.weeks),
    });
  }
}

/**
* @type {Object} currentDate: Base currentDate to get the month from - Usually first day of the month
* @type {Array} weeks: A list of weeks based on calendarJS
* @type {Function} onWeekOutOfMonth: A callback to call when user goes out of the month
* @type {Function} onTimeslotClick: Function to be excecuted when clicked.
* @type {Object} initialDate: Moment JS Date used to initialize the Calendar and which progresses further into the tree.
* @type {Array} timeslots: An array of timeslots to be displayed in each day.
* @type {Object} timeslotProps: An object with keys and values for timeslot props (format, viewFormat)
* @type {Array} selectedTimeslots: Selected Timeslots Set used further into the tree to add the classes needed to when renderizing timeslots.
* @type {Array} DisabledTimeslots: Disabled Timeslots Set used further into the tree to add the classes needed to when renderizing timeslots.
* @type {Object} renderDays: An array of days which states which days of the week to render. By default renders all days.
 */
Month.propTypes = {
  currentDate: PropTypes.object.isRequired,
  weeks: PropTypes.array.isRequired,
  onWeekOutOfMonth: PropTypes.func,
  onTimeslotClick: PropTypes.func,
  initialDate: PropTypes.object.isRequired,
  timeslots: PropTypes.array.isRequired,
  timeslotProps: PropTypes.object,
  selectedTimeslots: PropTypes.array,
  disabledTimeslots: PropTypes.array,
  bookedTimeslots: PropTypes.array,
  renderDays: PropTypes.object,
  onPressNextWeek: PropTypes.func,
  onPressPreviousWeek: PropTypes.func,
  renderWeeks: PropTypes.func,
};
