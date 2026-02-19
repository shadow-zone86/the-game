import { memo } from 'react';
import { ListGroup, Alert } from 'react-bootstrap';
import { ContentLoader } from '@/shared/ui/ContentLoader';
import { MESSAGES } from '@/shared/config/messages';
import { getErrorMessage } from '@/shared/lib/errors';
import { useDevicesQuery, DeviceItem } from '@/entities/device';
import type { DeviceDto } from '@/entities/device';

interface DeviceListProps {
  selectedId: string | null;
  onSelect: (device: DeviceDto) => void;
}

export const DeviceList = memo(function DeviceList({ selectedId, onSelect }: DeviceListProps) {
  const { data: devices, isLoading, error } = useDevicesQuery();

  if (isLoading) {
    return <ContentLoader />;
  }

  if (error) {
    return (
      <Alert variant="danger">
        {MESSAGES.devicesLoadFailed}:{' '}
        {getErrorMessage(error, MESSAGES.error)}
      </Alert>
    );
  }

  const list = devices ?? [];

  return (
    <ListGroup as="ul">
      {list.length === 0 ? (
        <ListGroup.Item as="li" className="text-muted">
          {MESSAGES.noDevices}
        </ListGroup.Item>
      ) : (
        list.map((device: DeviceDto) => (
          <DeviceItem
            key={device.id}
            device={device}
            isActive={selectedId === String(device.id)}
            onSelect={onSelect}
          />
        ))
      )}
    </ListGroup>
  );
});
