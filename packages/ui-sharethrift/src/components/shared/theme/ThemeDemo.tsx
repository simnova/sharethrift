import React from 'react';
import styles from './ThemeDemo.module.css';
import '../../../styles/theme.css';

export const ThemeDemo: React.FC = () => (
  <div className={styles.demoRoot}>
    <h2>Theme Color Samples</h2>
    <div className={styles.row}><div className={styles.swatch} style={{ background: 'var(--color-primary)' }} /> <span>Primary: <code>--color-primary</code></span></div>
    <div className={styles.row}><div className={styles.swatch} style={{ background: 'var(--color-primary-disabled)' }} /> <span>Primary Disabled: <code>--color-primary-disabled</code></span></div>
    <div className={styles.row}><div className={styles.swatch} style={{ background: 'var(--color-secondary)' }} /> <span>Secondary: <code>--color-secondary</code></span></div>
    <div className={styles.row}><div className={styles.swatch} style={{ background: 'var(--color-secondary-disabled)' }} /> <span>Secondary Disabled: <code>--color-secondary-disabled</code></span></div>
    <div className={styles.row}><div className={styles.swatch} style={{ background: 'var(--color-tertiary)' }} /> <span>Tertiary: <code>--color-tertiary</code></span></div>
    <div className={styles.row}><div className={styles.swatch} style={{ background: 'var(--color-tertiary-disabled)' }} /> <span>Tertiary Disabled: <code>--color-tertiary-disabled</code></span></div>
    <div className={styles.row}><div className={styles.swatch} style={{ background: 'var(--color-background)' }} /> <span>Background: <code>--color-background</code></span></div>
    <div className={styles.row}><div className={styles.swatch} style={{ background: 'var(--color-background-2)' }} /> <span>Background 2: <code>--color-background-2</code></span></div>
    <div className={styles.row}><div className={styles.swatch} style={{ background: 'var(--color-foreground-1)' }} /> <span>Foreground 1: <code>--color-foreground-1</code></span></div>
    <div className={styles.row}><div className={styles.swatch} style={{ background: 'var(--color-foreground-2)' }} /> <span>Foreground 2: <code>--color-foreground-2</code></span></div>
    <div className={styles.row}><div className={styles.swatch} style={{ background: 'var(--color-highlight)' }} /> <span>Highlight: <code>--color-highlight</code></span></div>
    <div className={styles.row}><div className={styles.swatch} style={{ background: 'var(--color-red-error)' }} /> <span>Red Error: <code>--color-red-error</code></span></div>
    <div className={styles.row}><div className={styles.swatch} style={{ background: 'var(--color-message-text)' }} /> <span>Message Text: <code>--color-message-text</code></span></div>
    <div className={styles.row}><div className={styles.swatch} style={{ background: 'var(--color-message-transparent)' }} /> <span>Message Transparent: <code>--color-message-transparent</code></span></div>
    <h3>Font Families</h3>
    <div className={styles.fontSample} style={{ fontFamily: 'var(--Urbanist)' }}>
      Urbanist: The quick brown fox jumps over the lazy dog.
    </div>
    <div className={styles.fontSample} style={{ fontFamily: 'var(--Instrument-Serif)' }}>
      Instrument Serif: The quick brown fox jumps over the lazy dog.
    </div>
    <h3>Typography Classes</h3>
    <div className="title42">.title42 - 42px Instrument Serif</div>
    <div className="title36">.title36 - 36px Instrument Serif</div>
    <div className="title30">.title30 - 30px Instrument Serif</div>
    <h1>h1 - 24px Urbanist Bold</h1>
    <h2>h2 - 20px Urbanist Semibold</h2>
    <h3>h3 - 18px Urbanist Semibold</h3>
    <h4>h4 - 14px Urbanist Semibold</h4>
    <p>p - 14px Urbanist Regular</p>
  </div>
);
