import { memo } from 'react';
import { ListGroup, Alert } from 'react-bootstrap';
import { ContentLoader } from '@/shared/ui/ContentLoader';
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
        Не удалось загрузить устройства:{' '}
        {getErrorMessage(error, 'Ошибка')}
      </Alert>
    );
  }

  const list = devices ?? [];

  return (
    <ListGroup as="ul">
      {list.length === 0 ? (
        <ListGroup.Item as="li" className="text-muted">
          Нет устройств
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
