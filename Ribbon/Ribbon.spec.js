import assert from 'assert';
import Ribbon from './Ribbon';
import React from 'react';
import { shallow } from 'enzyme';

describe('Ribbon', () => {
  let component;

  beforeEach(() => {
    component = shallow(<Ribbon text='Preview' />);
  });

  it('should render with text', () => {
    assert(component.text().includes('Preview'));
  });
});
