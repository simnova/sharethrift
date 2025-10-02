import React from 'react';
import styles from './ThemeDemo.module.css';
import { Button, Input, Select, Tabs, Checkbox, Tag, Form, DatePicker } from 'antd';
import { MessageOutlined, AppstoreAddOutlined, SwapOutlined, UserOutlined } from '@ant-design/icons';
import '../styles/theme.css';

const items = [
  {
    key: '1',
    label: 'Tab 1',
    children: 'Content of Tab Pane 1',
  },
  {
    key: '2',
    label: 'Tab 2',
    children: 'Content of Tab Pane 2',
  },
  {
    key: '3',
    label: 'Tab 3',
    children: 'Content of Tab Pane 3',
  },
];

export const ThemeDemo: React.FC = () => {
  return (
    <div className={styles['demoRoot'] ?? ""}>
      <h2>Theme Color Samples</h2>
      <div className={styles['row'] ?? ""}><div className={styles['swatch'] ?? ""} style={{ background: 'var(--color-primary)' }} /> <span>Primary: <code>--color-primary</code></span></div>
      <div className={styles['row'] ?? ""}><div className={styles['swatch'] ?? ""} style={{ background: 'var(--color-primary-disabled)' }} /> <span>Primary Disabled: <code>--color-primary-disabled</code></span></div>
      <div className={styles['row'] ?? ""}><div className={styles['swatch'] ?? ""} style={{ background: 'var(--color-secondary)' }} /> <span>Secondary: <code>--color-secondary</code></span></div>
      <div className={styles['row'] ?? ""}><div className={styles['swatch'] ?? ""} style={{ background: 'var(--color-secondary-disabled)' }} /> <span>Secondary Disabled: <code>--color-secondary-disabled</code></span></div>
      <div className={styles['row'] ?? ""}><div className={styles['swatch'] ?? ""} style={{ background: 'var(--color-tertiary)' }} /> <span>Tertiary: <code>--color-tertiary</code></span></div>
      <div className={styles['row'] ?? ""}><div className={styles['swatch'] ?? ""} style={{ background: 'var(--color-tertiary-disabled)' }} /> <span>Tertiary Disabled: <code>--color-tertiary-disabled</code></span></div>
      <div className={styles['row'] ?? ""}><div className={styles['swatch'] ?? ""} style={{ background: 'var(--color-background)' }} /> <span>Background: <code>--color-background</code></span></div>
      <div className={styles['row'] ?? ""}><div className={styles['swatch'] ?? ""} style={{ background: 'var(--color-background-2)' }} /> <span>Background 2: <code>--color-background-2</code></span></div>
      <div className={styles['row'] ?? ""}><div className={styles['swatch'] ?? ""} style={{ background: 'var(--color-foreground-1)' }} /> <span>Foreground 1: <code>--color-foreground-1</code></span></div>
      <div className={styles['row'] ?? ""}><div className={styles['swatch'] ?? ""} style={{ background: 'var(--color-foreground-2)' }} /> <span>Foreground 2: <code>--color-foreground-2</code></span></div>
      <div className={styles['row'] ?? ""}><div className={styles['swatch'] ?? ""} style={{ background: 'var(--color-highlight)' }} /> <span>Highlight: <code>--color-highlight</code></span></div>
      <div className={styles['row'] ?? ""}><div className={styles['swatch'] ?? ""} style={{ background: 'var(--color-red-error)' }} /> <span>Red Error: <code>--color-red-error</code></span></div>
      <div className={styles['row'] ?? ""}><div className={styles['swatch'] ?? ""} style={{ background: 'var(--color-message-text)' }} /> <span>Message Text: <code>--color-message-text</code></span></div>
      <div className={styles['row'] ?? ""}><div className={styles['swatch'] ?? ""} style={{ background: 'var(--color-message-transparent)' }} /> <span>Message Transparent: <code>--color-message-transparent</code></span></div>
      <h3>Font Families</h3>
      <div className={styles["fontSample"] ?? ""} style={{ fontFamily: 'var(--Urbanist)' }}>
        Urbanist: The quick brown fox jumps over the lazy dog.
      </div>
      <div className={styles["fontSample"] ?? ""} style={{ fontFamily: 'var(--Instrument-Serif)' }}>
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
      <h3>Ant Design Component Samples</h3>
      <div className={styles["row"] ?? ""}>
        <Button className={styles["primaryButton"] ?? ""} type="primary">Primary Button</Button>
        <Button className={styles["secondaryButton"] ?? ""} type="default">Secondary Button</Button>
        <Button className={styles["primaryButton"] ?? ""} type="primary"><MessageOutlined />Icon Button</Button>
      </div>
      <div className={styles["column"] ?? ""}>
        <Form layout="vertical" style={{ maxWidth: 300 }}>
          <Form.Item
            label="Input"
            name="input"
          >
            <Input placeholder="Input" />
          </Form.Item>
          <Form.Item
            label="Select"
            name="select"
          >
            <Select defaultValue="option1">
              <Select.Option value="option1">Option 1</Select.Option>
              <Select.Option value="option2">Option 2</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="DatePicker"
            name="datepicker"
          >
            <DatePicker />
          </Form.Item>
          <Form.Item>
            <Checkbox>Checkbox</Checkbox>
          </Form.Item>
        </Form>
      </div>
      <h3>Tabs Example</h3>
      <Tabs items={items} />
      <h3>Tags</h3>
      <Tag color="blue">Blue Tag</Tag>
      <Tag color="green">Green Tag</Tag>
      <Tag icon={<AppstoreAddOutlined />} color="magenta">Icon Tag</Tag>
      <Tag icon={<SwapOutlined />} color="orange">Swap Tag</Tag>
      <Tag icon={<UserOutlined />} color="purple">User Tag</Tag>
    </div>
  );
};
