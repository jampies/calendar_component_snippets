import React from 'react';
import styles from './CalendarDay.scss';
import { times } from 'lodash';
import { SCREEN_SIZES } from '../../../config/constants';
import classnames from 'classnames';

export const HourHeading = ({ hour, visible }) => {
  let period = hour < 12 ? 'am' : 'pm';
  let hourIn12 = hour < 12 ? hour : hour - 12;
  if (hourIn12 === 0) {
    hourIn12 += 12;
  }

  return (
    <div className={styles.CalendarHourHeading} data-selector={`calendarHour-${hour}`} key={hour}>
      {visible && <span>{hourIn12}{period}</span>}
    </div>
  );
};

export const HourHeadings = ({ width }) => (
  <div className={styles.CalendarHourHeadings}>
    {times(24, hour => <HourHeading hour={hour} key={hour} visible={(width > SCREEN_SIZES.MD || hour % 2 === 0) && hour > 0} />)}
  </div>
);

const CalendarDay = ({ dayOfWeek, month, dayOfMonth, width, alt = false, children }) => {
  const className = classnames(styles.CalendarDay, {
    'calendar-xs': width < 650,
    'calendar-sm': width >= 650 && width < 980,
    'calendar-md': width >= 980 && width < 1200
  });

  return (
    <div className={className} style={{ width: `${width}px` }} data-selector={`calendar-day-${dayOfWeek}`} >
      <div className={classnames({ [styles.CalendarDayBody]: true, alt })}>
        { children }
      </div>
      <HourHeadings width={width} />
      <div className={styles.DayLabel}>
        <div className={classnames(styles.DayOfWeek, { [styles.StandAlone]: !(dayOfMonth || month) })}>{ dayOfWeek }</div>
        <div className={styles.DayOfMonth}>{ dayOfMonth }</div>
        <div className={styles.Month}>{ month }</div>
      </div>
    </div>
  );
};

export default CalendarDay;
