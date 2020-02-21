import React from 'react';
import { storiesOf } from '@storybook/react';
import { text, boolean, number } from '@storybook/addon-knobs/react';
import CalendarItem from './CalendarItem';
import { withInfo } from '@storybook/addon-info';
import ExampleContainer from '../../../../.storybook/storybook-example';
import { action } from '@storybook/addon-actions';

const store = {
  teamStore: {
    roles: {
      1: {
        id: 1,
        name: 'Waiter'
      },
      2: {
        id: 2,
        name: 'Chef'
      },
      3: {
        id: 3,
        name: 'Bartender'
      },
      4: {
        id: 4,
        name: 'Cleaner'
      }
    }
  }
};

const shifts = [
  {
    startTime: 400,
    duration: 400
  },
  {
    startTime: 900,
    duration: 350
  },
  {
    startTime: 380,
    duration: 500
  }
];

class ExampleCalendar extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      shifts: shifts.map((shift, index) => {
        const id = 1 + index;
        const shiftProps = {
          id,
          roleId: props.roleId + index,
          row: index,
          onChangeStartTime: this.onChangeStartTime.bind(this, id),
          onChangeEndTime: this.onChangeEndTime.bind(this, id),
          onDragStart: this.onDragStart.bind(this, id),
          onDragEnd: this.onDragEnd.bind(this, id)
        };
        return {
          ...shift,
          ...shiftProps
        };
      })
    };
  }

  onDragStart (shiftId) {
    const shift = this.state.shifts.find(shift => shift.id === shiftId);
    this.setState({
      draftShift: shift
    });
  }

  onChangeStartTime (shiftId, delta) {
    const shift = this.state.shifts.find(shift => shift.id === shiftId);
    if (shift.duration - delta < 60) {
      return;
    }
    this.setState({
      draftShift: {
        ...shift,
        startTime: shift.startTime + delta,
        duration: shift.duration - delta
      }
    });
  }

  onChangeEndTime (shiftId, delta) {
    const shift = this.state.shifts.find(shift => shift.id === shiftId);
    this.setState({
      draftShift: {
        ...shift,
        duration: shift.duration + delta
      }
    });
  }

  onDragEnd (shiftId) {
    const shifts = this.state.shifts.map(shift => {
      if (shift.id === shiftId) {
        return {
          ...this.state.draftShift
        };
      } else {
        return shift;
      }
    });
    this.setState({
      shifts,
      draftShift: null
    });
  }

  render () {
    const dayWidth = number('Day Width (px)', 900);
    const dayStyles = {
      width: dayWidth,
      boxShadow: '1px 1px 10px -3px #333',
      position: 'relative',
      height: '150px',
      boxSizing: 'border-box'
    };
    return (
      <div style={dayStyles}>
        { this.state.shifts.map(shift => {
          if (this.state.draftShift && shift.id === this.state.draftShift.id) {
            shift = this.state.draftShift;
          }

          const { roleId, ...fixedProps } = this.props;

          return (
            <CalendarItem key={shift.id} {...shift} {...fixedProps}>
              {text('Children', '')}
            </CalendarItem>
          );
        }) }
      </div>
    );
  }
}

storiesOf('Calendar', module)
  .add('CalendarItem', withInfo(`A generic item on a calendar (Template Entry or Shift - Editable/Selectable/Warnable).`)(() => {
    return (
      <ExampleContainer store={store}>
        <ExampleCalendar
          roleId={number('Role ID', 2)}
          editable={boolean('Editable', true)}
          dayWidth={number('Day Width (px)', 900)}
          warn={boolean('Warn', false)}
          selectable={boolean('Selectable', false)}
          selected={boolean('Selected', false)}
          onSelectChange={action('onSelectChange')}
          onEdit={action('onEdit')} />
      </ExampleContainer>
    );
  }));
