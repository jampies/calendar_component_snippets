import assert from 'assert';
import React from 'react';
import { shallow } from 'enzyme';
import td from 'testdouble';
import DragHandle from './DragHandle';

const onDragStart = td.function('onDragStart()');
const onDrag = td.function('onDrag()');
const onDragEnd = td.function('onDragEnd()');

describe('DragHandle', () => {
  let defaultProps = {
    onDragStart,
    onDrag,
    onDragEnd
  };
  let component;
  let bodyRemoveEventListener;
  let bodyAddEventListener;

  const getComponent = ({ children = 'foo', ...props } = {}) => {
    return shallow(
      <DragHandle {...defaultProps} {...props}>
        {children}
      </DragHandle>
    );
  };

  beforeEach(() => {
    component = getComponent();
    global.window.document.body.removeEventListener = bodyRemoveEventListener = td.function('bodyRemoveEventListener');
    global.window.document.body.addEventListener = bodyAddEventListener = td.function('bodyAddEventListener');
  });

  afterEach(() => {
    td.reset();
  });

  it('should add the mouseup event listener when dragging', () => {
    component.simulate('mouseDown', {
      preventDefault: td.func('preventDefault()'),
      clientX: 'foo'
    });
    td.verify(bodyAddEventListener(), { times: 4, ignoreExtraArgs: true });
    assert.strictEqual(component.state('startPositionX'), 'foo');
  });

  it('should not add the mouseup event listener when dragging with the incorrect button', () => {
    component.simulate('mouseDown', {
      preventDefault: td.func('preventDefault()'),
      button: 1
    });
    td.verify(bodyAddEventListener(), { times: 0, ignoreExtraArgs: true });
  });

  it('should use touch events if available', () => {
    component.simulate('mouseDown', {
      preventDefault: td.func('preventDefault()'),
      touches: [{
        clientX: 'foo'
      }],
      clientX: 'bar'
    });
    assert.strictEqual(component.state('startPositionX'), 'foo');
  });

  it('should ignore events that are not cancelable when dragging', () => {
    component.simulate('mouseDown', {
      preventDefault: td.func('preventDefault()'),
      cancelable: false
    });
    td.verify(bodyAddEventListener(), { times: 0, ignoreExtraArgs: true });
  });

  it('should remove the mouseup event listener when finished dragging', () => {
    component.instance().endDrag({
      clientX: 10,
      stopPropagation: td.func('stopPropagation()')
    });
    td.verify(bodyRemoveEventListener(), { times: 4, ignoreExtraArgs: true });
  });

  it('should remove the global event listener on unmount', () => {
    component.unmount();
    td.verify(bodyRemoveEventListener(), { times: 4, ignoreExtraArgs: true });
  });

  it('should call onDrag when dragging', () => {
    component.setState({
      startPositionX: 30
    });
    component.instance().drag({
      preventDefault: td.func('preventDefault()'),
      stopPropagation: td.func('stopPropagation()'),
      clientX: 50
    });
    td.verify(onDrag(20));
  });

  it('should call onDrag when dragging on a touch screen', () => {
    component.setState({
      startPositionX: 30
    });
    component.instance().drag({
      preventDefault: td.func('preventDefault()'),
      stopPropagation: td.func('stopPropagation()'),
      touches: [{
        clientX: 100
      }],
      clientX: 50
    });
    td.verify(onDrag(70));
  });

  it('should not handle clicks', () => {
    let stopPropagation = td.func('stopPropagation()');
    component.simulate('click', {
      stopPropagation
    });
    td.verify(stopPropagation());
  });
});
