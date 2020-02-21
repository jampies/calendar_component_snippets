import React from 'react';
import ReactDOM from 'react-dom';
import styles from './HorizontalCalendar.scss';
import { debounce, times, keys } from 'lodash';
import dateService from '$helpers/date/date';
const {
  isBefore,
  isSameDay,
  startOfDay,
  addDays,
  dateKey,
  differenceInMilliseconds,
  getNewDate,
  addMilliseconds,
  getStartOfWeek,
  getEndOfWeek
} = dateService;
export const PADDING = 0.1;
const MILISECONDS_IN_DAY = 1000 * 60 * 60 * 24;

class UnanimatedList extends React.Component {
  constructor () {
    super();

    this.state = {
    };
  }

  render () {
    const { width, daysIndex, days, dayWidth, renderDay, scrollHeight } = this.props;

    if (!width) {
      return null;
    }

    return (
    [
      times(7, (index) => {
        const dayKey = daysIndex[index];
        return (
          <div key={index} style={{ left: index * width, height: scrollHeight }}>
            {renderDay(days[dayKey].date, dayWidth)}
          </div>
        );
      })
    ]
    );
  }
}

function initialiseDays (startOfWeek, endOfWeek) {
  let dayTicker = getNewDate(startOfWeek);
  let index = 0;
  let days = {};
  while (isBefore(dayTicker, endOfWeek) || isSameDay(dayTicker, endOfWeek)) {
    days[dateKey(dayTicker)] = {
      index,
      date: new Date(dayTicker)
    };
    index++;
    dayTicker = addDays(dayTicker, 1);
  }
  return days;
}

class HorizontalCalendar extends React.Component {
  constructor (props) {
    super(props);
    this.state = {};
    this.onScroll = this.onScroll.bind(this);
    this.renderList = this.renderList.bind(this);
    this.renderUnanimatedList = this.renderUnanimatedList.bind(this);
    this.throttledScroll = debounce(this.onScroll, 400);
    this.getDateFromScrollOffset = this.getDateFromScrollOffset.bind(this);
    this.setRef = this.setRef.bind(this);

    let days = initialiseDays(getStartOfWeek(props.selectedDate), getEndOfWeek(props.selectedDate));

    this.state = {
      DAYS_INDEX: Object.keys(days),
      DAYS: days
    };
  }

  componentDidMount () {
    this.setState({
      node: ReactDOM.findDOMNode(this)
    });
  }

  setRef (e) {
    this.setState({
      element: e
    });
  }

  static getDerivedStateFromProps (props, state) {
    if (!dateKey(getStartOfWeek(props.selectedDate)) !== keys(state.DAYS)[0]) {
      let days = initialiseDays(getStartOfWeek(props.selectedDate), getEndOfWeek(props.selectedDate));
      return {
        DAYS_INDEX: Object.keys(days),
        DAYS: days
      };
    }
  }

  getOffsetFromDate (date, dayWidth) {
    const { DAYS } = this.state;
    const day = DAYS[dateKey(date)];
    const wholeDays = day.index;
    const miliseconds = differenceInMilliseconds(date, new Date(day.date));
    const partDay = miliseconds / MILISECONDS_IN_DAY;
    const paddingWidth = dayWidth / (1 - PADDING - PADDING) * PADDING;
    return Math.round(((wholeDays + partDay) * dayWidth) - paddingWidth);
  }

  getDateFromScrollOffset (offset, dayWidth) {
    const { DAYS_INDEX, DAYS } = this.state;
    const paddingWidth = dayWidth / (1 - PADDING - PADDING) * PADDING;
    const includingPadding = offset + paddingWidth;
    const mod = includingPadding % dayWidth;
    const wholeDaysScrolled = Math.round((includingPadding - mod) / dayWidth);
    let date = getNewDate(DAYS[DAYS_INDEX[wholeDaysScrolled]].date);
    const partDay = mod / dayWidth;
    const partDayInMiliseconds = partDay * MILISECONDS_IN_DAY;
    date = addMilliseconds(date, partDayInMiliseconds);
    return date;
  }

  onScroll (e) {
    const { setSelectedDate, selectedDate } = this.props;
    let scrolled = Math.round(e.target.scrollLeft);
    const date = this.getDateFromScrollOffset(scrolled, this.dayWidth);

    if (!isSameDay(date, selectedDate)) {
      setSelectedDate(date);
    }
  }

  renderUnanimatedList () {
    const { DAYS_INDEX, DAYS, width, element } = this.state;
    const { renderDay } = this.props;

    return (
      <UnanimatedList
        width={width}
        daysIndex={DAYS_INDEX}
        days={DAYS}
        dayWidth={this.dayWidth}
        renderDay={renderDay}
        scrollHeight={element ? element.scrollHeight : '100%'}
      />
    );
  }

  renderList () {
    const { element } = this.state;

    let scrollOffset = this.getOffsetFromDate(this.props.selectedDate, this.dayWidth);
    if (scrollOffset > this.maxScroll) {
      scrollOffset = this.maxScroll;
    }

    if (element) {
      element.scrollLeft = scrollOffset;
    }

    return this.renderUnanimatedList();
  }

  render () {
    const { DAYS_INDEX } = this.state;
    const { className } = this.props;

    let list = null;
    if (this.state.node) {
      const width = this.state.node.clientWidth;
      /* istanbul ignore else */
      if (this.state.width !== width) {
        /* sometimes the CSS takes a while to load and then the width changes - this resets the width and rerenders the component */
        setTimeout(() => this.setState({
          width
        }), 500);
        this.dayWidth = width * (1 - PADDING - PADDING);
        this.maxScroll = Math.floor((this.dayWidth * DAYS_INDEX.length) - width);
      }
      list = this.renderList();
    }

    return (
      <div
        className={`ScrolledCalendar ${styles.HorizontalCalendar} 
        ${className || ''}`}
        ref={this.setRef}
        onScroll={this.onScroll}
      >
        {list}
      </div>
    );
  }
}

const now = startOfDay(new Date());
HorizontalCalendar.defaultProps = {
  selectedDate: now
};

export default HorizontalCalendar;
