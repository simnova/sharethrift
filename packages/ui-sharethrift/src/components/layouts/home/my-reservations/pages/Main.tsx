import { useState, useMemo } from 'react';
import { Tabs, Empty, Spin } from 'antd';
import type { TabsProps } from 'antd';
import { CalendarOutlined, HistoryOutlined } from '@ant-design/icons';
import { ReservationsView } from '../components/ReservationsView';
import { getActiveReservations, getReservationHistory } from '../mock-data';

export default function MyReservationsMain() {
  const [loading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Get reservations data
  const activeReservations = useMemo(() => getActiveReservations(), [refreshKey]);
  const reservationHistory = useMemo(() => getReservationHistory(), [refreshKey]);

  const handleAction = (action: string, id: string) => {
    console.log(`${action} action for reservation ${id}`);
    // In a real implementation, this would make API calls
    // For now, we'll just refresh the data to simulate changes
    setRefreshKey(prev => prev + 1);
  };

  const tabItems: TabsProps['items'] = [
    {
      key: 'active',
      label: (
        <span>
          <CalendarOutlined />
          Active Reservations ({activeReservations.length})
        </span>
      ),
      children: activeReservations.length > 0 ? (
        <ReservationsView
          reservations={activeReservations}
          loading={loading}
          showActions={true}
          onAccept={(id) => handleAction('accept', id)}
          onReject={(id) => handleAction('reject', id)}
          onCancel={(id) => handleAction('cancel', id)}
          onClose={(id) => handleAction('close', id)}
          onMessage={(id) => handleAction('message', id)}
        />
      ) : (
        <Empty
          description="No active reservations"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      ),
    },
    {
      key: 'history',
      label: (
        <span>
          <HistoryOutlined />
          Reservation History ({reservationHistory.length})
        </span>
      ),
      children: reservationHistory.length > 0 ? (
        <ReservationsView
          reservations={reservationHistory}
          loading={loading}
          showActions={false} // No actions for closed reservations
        />
      ) : (
        <Empty
          description="No reservation history"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      ),
    },
  ];

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '400px' 
      }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 600, margin: '0 0 8px 0' }}>
          My Reservations
        </h1>
        <p style={{ color: '#666', margin: 0 }}>
          Manage your reservation requests and view their status
        </p>
      </div>

      <Tabs
        defaultActiveKey="active"
        items={tabItems}
        size="large"
        style={{ marginTop: '16px' }}
      />
    </div>
  );
}
