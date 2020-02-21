import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import styles from './CalendarItem.scss';
import Icon from '../../Icon/Icon';
import IconButton from '../../FormControls/Button/IconButton';
import CheckBox from '../../FormControls/CheckBox/CheckBox';
import RoleName from '../../../views/RoleName/RoleName';
import DragHandle from './DragHandle';
import classnames from 'classnames';
import { COLOURS_AMOUNT } from '../../../config/constants';
import Time from '../../Time/Time';
import Tooltip from '../../Tooltip/Tooltip';
import ReactTooltip from 'react-tooltip';
import { throttle } from 'lodash';

const HEIGHT = 26;
const MARGIN = 4;
const CALENDAR_PADDING = 46;
const MINUTES_IN_DAY = 60 * 24;
const STEP_SIZE = 5;
const MIN_ITEM_SIZE = 60;

export const roundToNearestFactor = (n, factor) => Math.round(n / factor) * factor;
export const getShiftTopPosition = index => (index * HEIGHT) + ((index + 1) * MARGIN) + CALENDAR_PADDING;
export const percentageSizeFromTime = startTime => startTime / MINUTES_IN_DAY * 100;
export const timeFromPixelSize = (size, dayWidth) => size / dayWidth * MINUTES_IN_DAY;

class CalendarItem extends Component {
  constructor (props) {
    super(props);

    this.onDragStart = this.onDragStart.bind(this);
    this.onResizeLeft = this.onResizeLeft.bind(this);
    this.onResizeRight = this.onResizeRight.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
    this.showTooltips = throttle(this.showTooltips.bind(this), 50, { leading: true });
    this.hideTooltips = throttle(this.hideTooltips.bind(this), 200, { trailing: true });
    this.handleClick = this.handleClick.bind(this);
    this.toggleSelected = this.toggleSelected.bind(this);
    this.setTooltipStatus = this.setTooltipStatus.bind(this);
    this.setRootRef = this.setRootRef.bind(this);
    this.handleMouseOver = this.handleMouseOver.bind(this);
    this.handleMouseOut = this.handleMouseOut.bind(this);

    this.tooltipStartRef = React.createRef();
    this.tooltipEndRef = React.createRef();

    this.state = {
      dragging: false
    };
  }

  componentWillUnmount () {
    if (this.tooltipTimeout) {
      clearTimeout(this.tooltipTimeout);
    }

    if (this.timeoutRef) {
      clearTimeout(this.timeoutRef);
    }
  }

  setRootRef (r) {
    this.rootRef = r;
  }

  setTooltipStatus () {
    if (!this.rootRef) return;

    let mouseOver = window.getComputedStyle(this.rootRef).getPropertyValue('max-height') === '1000px';

    if (mouseOver) {
      this.showTooltips();
    } else {
      this.hideTooltips();
    }
  }

  onDragStart () {
    this.setState({
      dragging: true,
      originalDuration: this.props.duration
    });
    this.props.onDragStart(this.props.id);
  }

  onResizeLeft (offsetX) {
    if (this.props.editable) {
      let delta = timeFromPixelSize(offsetX, this.props.dayWidth);
      delta = roundToNearestFactor(delta, STEP_SIZE);

      const newDuration = this.state.originalDuration - delta;
      if (newDuration >= MIN_ITEM_SIZE) {
        this.props.onChangeStartTime(delta);
        this.showTooltips();
      }
    }
  }

  onResizeRight (offsetX) {
    if (this.props.editable) {
      let delta = timeFromPixelSize(offsetX, this.props.dayWidth);
      delta = roundToNearestFactor(delta, STEP_SIZE);

      const newDuration = this.state.originalDuration + delta;
      if (newDuration >= MIN_ITEM_SIZE) {
        this.props.onChangeEndTime(delta);
        this.showTooltips();
      }
    }
  }

  onDragEnd () {
    setTimeout(() => {
      this.setState({
        dragging: false
      });
    }, 50);
    this.props.onDragEnd();
  }

  showTooltips () {
    if (!this.props.isActive) {
      ReactTooltip.show(findDOMNode(this.tooltipStartRef.current));
      ReactTooltip.show(findDOMNode(this.tooltipEndRef.current));
      this.tooltipTimeout = setTimeout(this.setTooltipStatus, 500);
    }
  }

  hideTooltips () {
    if (!this.state.dragging) {
      ReactTooltip.hide(findDOMNode(this.tooltipStartRef.current));
      ReactTooltip.hide(findDOMNode(this.tooltipEndRef.current));
    }
  }

  handleClick () {
    const { selectable, editable, selectMode, onEdit, id } = this.props;
    const { dragging } = this.state;

    if (selectable && !dragging && (!editable || selectMode)) {
      this.toggleSelected();
    } else if (editable && !dragging) {
      onEdit(id);
    }
  }

  handleMouseOver () {
    this.timeoutRef = setTimeout(this.showTooltips, 1000);
  }

  handleMouseOut () {
    if (this.timeoutRef) {
      clearTimeout(this.timeoutRef);
    }
    this.hideTooltips();
  }

  toggleSelected () {
    const { onSelectChange, id, selected, selectWholeSequences } = this.props;

    onSelectChange(id, !selected, selectWholeSequences);
  }

  render () {
    let { id, roleId, editable, warn, selectable, selected, selectMode, startTime, duration, row, onEdit, children, setRef, isActive, isSmall, ...rest } = this.props;
    let colourNumber = (roleId % COLOURS_AMOUNT) + 1;

    const calculatedStyles = {
      height: `${HEIGHT}px`,
      width: `${percentageSizeFromTime(duration)}%`,
      left: `${percentageSizeFromTime(startTime)}%`,
      top: `${getShiftTopPosition(row)}px`
    };

    const classNames = classnames({
      [styles.CalendarItemContainer]: true,
      [`colour-${colourNumber}-background`]: true,
      [styles.Editable]: editable,
      [styles.active]: isActive,
      [styles.SelectMode]: selectMode,
      [styles.isSmall]: isSmall
    });

    const tooltipStartName = `shift-tooltip-${id}-start`;
    const tooltipEndName = `shift-tooltip-${id}-end`;

    return (
      <div className={classNames}
        style={calculatedStyles}
        ref={(r) => {
          if (setRef) setRef(r);
          this.setRootRef(r);
        }}
        onMouseOver={this.handleMouseOver}
        onMouseOut={this.handleMouseOut}
        onFocus={this.showTooltips}
        onBlur={this.hideTooltips}
        onClick={this.handleClick}
        tabIndex={1}
        {...rest}>
        <DragHandle
          dragging={this.state.dragging}
          onDragStart={this.onDragStart}
          onDrag={this.onResizeLeft}
          onDragEnd={this.onDragEnd}>
          <span data-tip data-for={tooltipStartName} ref={this.tooltipStartRef} className={styles.TooltipContainer}>
            <Tooltip
              id={tooltipStartName}
              place='top'
              type='dark'
              effect='solid'>
              <Time>{startTime}</Time>
            </Tooltip>
          </span>
        </DragHandle>
        <div className={styles.CalendarItem} tabIndex={1}>
          {selectable ? <CheckBox checked={selected} onChange={this.toggleSelected} tabIndex={1} /> : null}
          <span className={styles.Text}><RoleName roleId={roleId} /></span>
          {<span className={styles.Body}>{children}</span>}
          {!isSmall && <span className={styles.Controls}>
            {warn ? <Icon.Warning /> : null}
            {editable ? <IconButton context='clear' onClick={(e) => {
              e.stopPropagation();
              onEdit(id);
            }} title='Edit' tabIndex={1}><Icon.Pencil /></IconButton> : null}
          </span>}
        </div>
        <DragHandle
          dragging={this.state.dragging}
          onDragStart={this.onDragStart}
          onDrag={this.onResizeRight}
          onDragEnd={this.onDragEnd}>
          <span data-tip data-for={tooltipEndName} ref={this.tooltipEndRef} className={styles.TooltipContainer}>
            <Tooltip
              id={tooltipEndName}
              place='top'
              type='dark'
              effect='solid'>
              <Time>{startTime + duration}</Time>
            </Tooltip>
          </span>
        </DragHandle>
      </div>
    );
  }
}

export default CalendarItem;
