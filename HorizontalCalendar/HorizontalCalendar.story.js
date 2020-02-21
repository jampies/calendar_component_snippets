import React from 'react';
import { storiesOf } from '@storybook/react';
import { date } from '@storybook/addon-knobs/react';
import HorizontalCalendar from './HorizontalCalendar';
import CalendarDay from '../CalendarDay/CalendarDay';
import { withInfo } from '@storybook/addon-info';
import ExampleContainer from '../../../../.storybook/storybook-example';
import CalendarItem from '../CalendarItem/CalendarItem';
import { noop } from 'lodash';
import dateService from '$helpers/date/date';
const { getDaysSinceEpoch, startOfDay, getCurrentDate, getMinimumDate, getMaximumDate } = dateService;

const store = {
  teamStore: {
    roles: {
      5: {
        id: 5,
        name: 'Waiter'
      }
    }
  }
};

const today = startOfDay(getCurrentDate());
const startDate = getMinimumDate();
const endDate = getMaximumDate();

class DemoCalendar extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      selectedDate: today
    };
    this.setSelectedDate = this.setSelectedDate.bind(this);
  }

  setSelectedDate (selectedDate) {
    this.setState({
      selectedDate
    });
  }

  componentDidUpdate (prevProps) {
    if (!prevProps.selectedDate.isSame(this.props.selectedDate)) {
      this.setSelectedDate(this.props.selectedDate);
    }
  }

  render () {
    return (
      <div style={{ height: '250px' }}>
        <HorizontalCalendar
          earliestDateInView={this.props.earliestDateInView}
          lastDateInView={this.props.lastDateInView}
          selectedDate={this.state.selectedDate}
          setSelectedDate={this.setSelectedDate}
          renderDay={(date, dayWidth) => {
            const daysSinceEpoch = getDaysSinceEpoch(date);
            return (
              <CalendarDay dayOfWeek={date.format('ddd')} dayOfMonth={date.format('DD')} month={date.format('MMM')} width={dayWidth} alt={daysSinceEpoch % 2 > 0}>
                <CalendarItem
                  roleId={5}
                  row={0}
                  startTime={900}
                  duration={350}
                  onChangeStartTime={noop}
                  onChangeEndTime={noop}
                  onDragStart={noop}
                  onDragEnd={noop}
                  editable={false}
                  dayWidth={dayWidth}
                  onSelectChange={noop}
                  onEdit={noop} />
              </CalendarDay>
            );
          }} />
      </div>
    );
  }
}

storiesOf('Calendar', module)
  .add('HorizontalCalendar', withInfo(`Multiple days on a calendar (Weekly Schedule or Weekly Template or Shift Selector).`)(() => {
    return (
      <ExampleContainer store={store}>
        <DemoCalendar
          selectedDate={date('Selected Date', today)}
          earliestDateInView={date('Earliest Date', startDate)}
          lastDateInView={date('Last Date', endDate)} />
      </ExampleContainer>
    );
  }));
