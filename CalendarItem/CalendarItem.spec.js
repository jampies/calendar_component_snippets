import assert from 'assert';
import React from 'react';
import { roundToNearestFactor, getShiftTopPosition, percentageSizeFromTime, timeFromPixelSize } from './CalendarItem';
import DragHandle from './DragHandle';
import RoleName from '../../../views/RoleName/RoleName';
import Icon from '../../Icon/Icon';
import { shallow } from 'enzyme';
import td from 'testdouble';
let CalendarItem;
const onEdit = td.function('onEdit()');
const onSelectChange = td.function('onSelectChange()');
const onDragStart = td.function('onDragStart()');
const onChangeStartTime = td.function('onChangeStartTime()');
const onChangeEndTime = td.function('onChangeEndTime()');
const onDragEnd = td.function('onDragEnd()');

describe('CalendarItem', () => {
  let defaultProps = {
    id: 3,
    roleId: 5,
    editable: false,
    warn: false,
    selectable: false,
    selected: false,
    startTime: 500,
    duration: 300,
    row: 2,
    onEdit,
    onSelectChange,
    onDragStart,
    onChangeStartTime,
    onChangeEndTime,
    onDragEnd
  };

  afterEach(() => {
    td.reset();
  });

  const getComponent = ({ children = 'foo', ...props } = {}) => {
    return shallow(
      <CalendarItem {...defaultProps} {...props}>
        {children}
      </CalendarItem>
    );
  };

  describe('component', () => {
    let component;
    let ReactTooltip;
    beforeEach(() => {
      ReactTooltip = {
        hide: td.func('hide()'),
        show: td.func('show()')
      };
      td.replace('react-tooltip', ReactTooltip);
      CalendarItem = require('./CalendarItem').default;
      component = getComponent();
    });

    it('should render all the text fields', () => {
      const roleName = component.find(RoleName);
      assert.strictEqual(roleName.length, 1);
      assert.strictEqual(roleName.prop('roleId'), defaultProps.roleId);
      assert(component.contains('foo'));
    });

    it('should not render the edit button', () => {
      const editButton = component.find('IconButton');
      assert.strictEqual(editButton.length, 0);
    });

    it('should not render the warning icon', () => {
      const icon = component.find(Icon.Warning);
      assert.strictEqual(icon.length, 0);
    });

    it('dragging the left drag handle should do nothing', () => {
      component.find(DragHandle).at(0).prop('onDrag')(10);
      td.verify(onChangeStartTime(), { times: 0, ignoreExtraArgs: true });
    });

    it('dragging the right drag handle should do nothing', () => {
      component.find(DragHandle).at(1).prop('onDrag')(10);
      td.verify(onChangeEndTime(), { times: 0, ignoreExtraArgs: true });
    });

    it('should show the tooltips on focus', () => {
      component.simulate('focus');
      td.verify(ReactTooltip.show(), { times: 2, ignoreExtraArgs: true });
    });

    it('should hide the tooltips on blur', () => {
      component.simulate('blur');
      td.verify(ReactTooltip.hide(), { times: 2, ignoreExtraArgs: true });
    });

    it('clicking the outer element should not fire onSelectChange or onEdit', () => {
      component.simulate('click');
      td.verify(onSelectChange(), { times: 0, ignoreExtraArgs: true });
      td.verify(onEdit(), { times: 0, ignoreExtraArgs: true });
    });

    describe('when selectable', () => {
      beforeEach(() => {
        component = getComponent({ selectable: true, selectMode: false });
      });

      it('should render the checkbox', () => {
        const checkbox = component.find('CheckBox');
        assert.strictEqual(checkbox.length, 1);
        assert.strictEqual(checkbox.prop('checked'), false);
      });

      it('changing the checkbox should fire onSelectChange', () => {
        const checkbox = component.find('CheckBox');
        checkbox.simulate('change');
        td.verify(onSelectChange(defaultProps.id, true, undefined));
      });

      describe('when selected', () => {
        beforeEach(() => {
          component = getComponent({ selectable: true, selected: true, editable: false });
        });

        it('should render the checkbox checked', () => {
          const checkbox = component.find('CheckBox');
          assert.strictEqual(checkbox.length, 1);
          assert.strictEqual(checkbox.prop('checked'), true);
        });

        it('changing the checkbox should fire onSelectChange', () => {
          const checkbox = component.find('CheckBox');
          checkbox.simulate('change');
          td.verify(onSelectChange(defaultProps.id, false, undefined));
        });

        it('clicking the outer element should fire onSelectChange', () => {
          component.simulate('click');
          td.verify(onSelectChange(defaultProps.id, false, undefined));
        });
      });

      describe('and editable', () => {
        beforeEach(() => {
          component = getComponent({ selectable: true, selectMode: false, editable: true });
        });

        it('clicking the outer element should fire onEdit', () => {
          component.simulate('click');
          td.verify(onEdit(defaultProps.id));
        });
      });
    });

    describe('when warning', () => {
      beforeEach(() => {
        component = getComponent({ warn: true });
      });

      it('should render the warning icon', () => {
        const icon = component.find(Icon.Warning);
        assert.strictEqual(icon.length, 1);
      });
    });
  });

  describe('timeFromPixelSize', () => {
    it('should calculate a quarter day', () => {
      assert.strictEqual(timeFromPixelSize(500, 2000), 360);
    });

    it('should calculate a three quarter day', () => {
      assert.strictEqual(timeFromPixelSize(1500, 2000), 1080);
    });
  });

  describe('percentageSizeFromTime', () => {
    it('should calculate 6am', () => {
      const time = 6 * 60;
      assert.strictEqual(percentageSizeFromTime(time), 25);
    });

    it('should calculate 12pm', () => {
      const time = 12 * 60;
      assert.strictEqual(percentageSizeFromTime(time), 50);
    });

    it('should calculate 6pm', () => {
      const time = 18 * 60;
      assert.strictEqual(percentageSizeFromTime(time), 75);
    });
  });

  describe('getShiftTopPosition', () => {
    it('should be a multiplication of the row (including initial padding and margin)', () => {
      assert.strictEqual(getShiftTopPosition(0), 50);
      assert.strictEqual(getShiftTopPosition(1), 80);
      assert.strictEqual(getShiftTopPosition(2), 110);
      assert.strictEqual(getShiftTopPosition(3), 140);
    });
  });

  describe('roundToNearestFactor', () => {
    it('should round up', () => {
      const result = roundToNearestFactor(123, 5);
      assert.strictEqual(result, 125);
    });

    it('should round down', () => {
      const result = roundToNearestFactor(122, 5);
      assert.strictEqual(result, 120);
    });
  });
});
