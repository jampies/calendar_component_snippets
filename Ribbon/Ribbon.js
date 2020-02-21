import React from 'react';
import styles from './Ribbon.scss';

const Ribbon = ({ text }) => {
  return (
    <div className={styles.ribbon}><span>{text}</span></div>
  );
};

export default Ribbon;
