import React from 'react';
import Link from '@docusaurus/Link';

export default function Home() {
  return (
    <main style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Welcome to Sharethrift Decisions</h1>
      <p>This site documents architectural decisions for the Sharethrift project.</p>
      <div style={{ marginTop: '2rem' }}>
        <Link to="/docs/decisions/madr-architecture-decisions" style={{ fontSize: '1.2rem', color: '#3578e5' }}>
          View Architecture Decisions
        </Link>
      </div>
      <div style={{ marginTop: '1rem' }}>
        <Link to="/docs/decisions/adr-template" style={{ fontSize: '1.2rem', color: '#3578e5' }}>
          View ADR Template
        </Link>
      </div>
    </main>
  );
}
