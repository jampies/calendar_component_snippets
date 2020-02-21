import assert from 'assert';
import React from 'react';
import CalendarDay, { HourHeadings, HourHeading } from './CalendarDay';
import { shallow } from 'enzyme';

describe('CalendarDay', () => {
  let component;

  beforeEach(() => {
    component = shallow(
      <CalendarDay
        dayOfWeek='Thu'
        dayOfMonth='23'
        month='Jun'
        width={1290}>
          foo
        </CalendarDay>
      );
  });

  it('should render all the text fields', () => {
    assert(component.text().includes('foo'));
    assert(component.text().includes('Thu'));
    assert(component.text().includes('23'));
    assert(component.text().includes('Jun'));
  });

  it('should only render the day of the week when only supplying the day of week', () => {
    let component = shallow(
      <CalendarDay
        dayOfWeek='Thu'
        width={1290}>
          foo
        </CalendarDay>
      );
    assert(component.text().includes('foo'));
    assert(component.text().includes('Thu'));
  });

  describe('<HourHeadings />', () => {
    it('should render the hours', () => {
      component = shallow(<HourHeadings width={1290} />);
      const headings = component.find('HourHeading');
      assert.strictEqual(headings.at(1).prop('visible'), true);
      assert.strictEqual(headings.at(2).prop('visible'), true);
      assert.strictEqual(headings.at(12).prop('visible'), true);
      assert.strictEqual(headings.at(3).prop('visible'), true);
      assert.strictEqual(headings.at(6).prop('visible'), true);
    });

    it('should render only the even hours on small screens', () => {
      component = shallow(<HourHeadings width={500} />);
      const headings = component.find('HourHeading');
      assert.strictEqual(headings.at(1).prop('visible'), false);
      assert.strictEqual(headings.at(2).prop('visible'), true);
      assert.strictEqual(headings.at(12).prop('visible'), true);
      assert.strictEqual(headings.at(15).prop('visible'), false);
      assert.strictEqual(headings.at(18).prop('visible'), true);
    });
  });

  describe('<HourHeading />', () => {
    it('should render 12am instead of 0am', () => {
      component = shallow(<HourHeading hour={0} visible />);
      assert.strictEqual(component.text(), '12am');
    });

    it('should render an AM hour with one digit', () => {
      component = shallow(<HourHeading hour={1} visible />);
      assert.strictEqual(component.text(), '1am');
    });

    it('should render an AM hour with two digit', () => {
      component = shallow(<HourHeading hour={11} visible />);
      assert.strictEqual(component.text(), '11am');
    });

    it('should render a PM hour with one digit', () => {
      component = shallow(<HourHeading hour={14} visible />);
      assert.strictEqual(component.text(), '2pm');
    });

    it('should render an PM hour with two digit', () => {
      component = shallow(<HourHeading hour={23} visible />);
      assert.strictEqual(component.text(), '11pm');
    });
  });
});
