import React from 'react';
import { storiesOf } from '@storybook/react';
import { text } from '@storybook/addon-knobs/react';
import Ribbon from './Ribbon';
import ExampleContainer from '../../../../.storybook/storybook-example';

storiesOf('Miscellaneous', module).add('Ribbon', () => {
  return (
    <ExampleContainer>
      <div style={{ position: 'relative', height: '200px', width: '200px', boxShadow: '1px 1px 5px -1px black' }}>
        <Ribbon text={text('Text: ', 'Ribbon')} />
      </div>
    </ExampleContainer>
  );
});
