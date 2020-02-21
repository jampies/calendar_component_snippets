import React, { Component } from 'react';
import { throttle } from 'lodash';
import styles from './CalendarItem.scss';
import classnames from 'classnames';

class DragHandle extends Component {
  constructor (props) {
    super(props);

    this.state = {
      position: 0,
      startPositionX: 0
    };

    this.startDrag = this.startDrag.bind(this);
    this.drag = this.drag.bind(this);
    this.endDrag = this.endDrag.bind(this);
    this.onClick = this.onClick.bind(this);

    this.throttledDrag = throttle(this.drag, 0);
  }

  componentWillUnmount () {
    document.body.removeEventListener('mouseup', this.endDrag);
    document.body.removeEventListener('mousemove', this.throttledDrag);
    document.body.removeEventListener('touchend', this.endDrag);
    document.body.removeEventListener('touchmove', this.throttledDrag);
  }

  startDrag (e) {
    if (e.button && e.button !== 0) {
      return;
    }

    if (e.cancelable === false) {
      return;
    }

    const coords = e.touches ? e.touches[0] : e;

    const { onDragStart } = this.props;

    this.setState({
      startPositionX: coords.clientX
    });

    document.body.addEventListener('mouseup', this.endDrag);
    document.body.addEventListener('mousemove', this.throttledDrag);
    document.body.addEventListener('touchend', this.endDrag);
    document.body.addEventListener('touchmove', this.throttledDrag);
    e.preventDefault();
    onDragStart && onDragStart();
  }

  drag (e) {
    const coords = e.touches ? e.touches[0] : e;
    const { onDrag } = this.props;
    let offsetX = coords.clientX - this.state.startPositionX;
    onDrag && onDrag(offsetX);
    e.preventDefault();
    e.stopPropagation();
    return false;
  }

  endDrag (e) {
    const { onDragEnd } = this.props;
    document.body.removeEventListener('mouseup', this.endDrag);
    document.body.removeEventListener('mousemove', this.throttledDrag);
    document.body.removeEventListener('touchend', this.endDrag);
    document.body.removeEventListener('touchmove', this.throttledDrag);
    this.throttledDrag.flush();
    let offsetX = e.clientX - this.state.startPositionX;
    onDragEnd && onDragEnd(offsetX);
    e.stopPropagation();
    return false;
  }

  onClick (e) {
    e.stopPropagation();
    return false;
  }

  render () {
    const { className } = this.props;

    const classNames = classnames(styles.DragHandle, {
      [styles.dragging]: this.props.dragging,
      [styles.notDragging]: !this.props.dragging,
      [className]: !!className
    });
    return (
      <div onMouseDown={this.startDrag} onTouchStart={this.startDrag} onClick={this.onClick} className={classNames}>
        <div className={styles.Line}>
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default DragHandle;
