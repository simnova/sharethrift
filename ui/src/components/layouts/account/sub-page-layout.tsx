import React from 'react';
import { Layout, PageHeader } from 'antd';
import PropTypes from 'prop-types';

const { Header, Content,Footer } = Layout;

const ComponentPropTypes = {
  header: PropTypes.object.isRequired,
  fixedHeader: PropTypes.bool,
}

interface ComponentPropInterface {
  header: JSX.Element
  fixedHeader?: boolean
}

export type SubPageLayoutPropTypes = PropTypes.InferProps<typeof ComponentPropTypes> & ComponentPropInterface;

export const SubPageLayout: React.FC<SubPageLayoutPropTypes> = (props) => {
  const overFlow =  props.fixedHeader ? 'scroll' : 'unset';
  return (
    
    <>
      
      <Header className="site-layout-background" style={{ padding: 0 }}>
        {props.header}
      </Header>
      <div style={{ display:'flex', flexDirection:'column', flex:'1 auto', overflowY:overFlow}}>
      <Content style={{ margin: '24px 16px 0', minHeight:'inherit' }}>
        <div className="site-layout-background" style={{ padding: 24, minHeight:'100%' }}>
          {props.children}
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>Open Source</Footer>
      </div>

    </>

  )
}