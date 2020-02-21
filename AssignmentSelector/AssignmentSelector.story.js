import React from 'react';
import { storiesOf } from '@storybook/react';
import { boolean } from '@storybook/addon-knobs/react';
import AssignmentSelector from './AssignmentSelector';
import { withInfo } from '@storybook/addon-info';
import ExampleContainer from '../../../../.storybook/storybook-example';
import CalendarItem from '../CalendarItem/CalendarItem';
import { noop } from 'lodash';

const store = {
  teamStore: {
    roles: {
      5: {
        id: 5,
        name: 'Waiter'
      }
    },
    teamMembers: {
      '1': { id: 1, name: 'Sarah' },
      '2': { id: 2, name: 'Steven', clashingAssignment: true },
      '5': { id: 5, name: 'Peppa Pig' },
      '8': { id: 8, name: 'Joe', clashingAssignment: true }
    }
  }
};

storiesOf('Calendar', module)
  .add('AssignmentSelector', withInfo(`Team member to shift assignment dropdown`)(() => {
    const clashingAssignment = boolean('Clashes', true);
    return (
      <ExampleContainer store={store}>
        <div style={{ height: '250px', position: 'relative' }}>
          <CalendarItem
            roleId={5}
            row={0}
            startTime={200}
            duration={350}
            onChangeStartTime={noop}
            onChangeEndTime={noop}
            onDragStart={noop}
            onDragEnd={noop}
            editable={false}
            dayWidth={1000}
            onSelectChange={noop}
            onEdit={noop}>
            <AssignmentSelector
              availableTeamMembers={[
                { id: 1, name: 'Sarah' },
                { id: 2, name: 'Steven', clashingAssignment },
                { id: 5, name: 'Peppa Pig' },
                { id: 8, name: 'Joe', clashingAssignment }
              ]}
              assignedTeamMemberId={boolean('Has Selection', true) ? 5 : undefined}
              updateShiftAssignment={noop}
              shiftId={23}
            />
          </CalendarItem>
        </div>
      </ExampleContainer>
    );
  }));
