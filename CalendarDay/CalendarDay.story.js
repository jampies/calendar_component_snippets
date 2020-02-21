import React from 'react';
import { storiesOf } from '@storybook/react';
import { text, number, boolean } from '@storybook/addon-knobs/react';
import CalendarDay from './CalendarDay';
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
    }
  }
};

storiesOf('Calendar', module)
  .add('CalendarDay', withInfo(`A single day on a calendar (Weekly Schedule or Weekly Template or Shift Selector).`)(() => {
    const dayWidth = number('Width', 1000);
    return (
      <ExampleContainer store={store}>
        <div style={{ height: '250px' }}>
          <CalendarDay dayOfWeek={text('Day of Week', 'Wed')} dayOfMonth={text('Day of Month', '')} month={text('Month', '')} width={dayWidth} alt={boolean('Alt', false)}>
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
        </div>
      </ExampleContainer>
    );
  }));
