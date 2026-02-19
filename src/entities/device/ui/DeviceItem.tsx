import { memo, useCallback } from 'react';
import { ListGroup } from 'react-bootstrap';
import type { DeviceDto } from '../model/types.dto';

interface DeviceItemProps {
  device: DeviceDto;
  isActive: boolean;
  onSelect: (device: DeviceDto) => void;
}

export const DeviceItem = memo(function DeviceItem({
  device,
  isActive,
  onSelect,
}: DeviceItemProps) {
  const handleClick = useCallback((): void => onSelect(device), [device, onSelect]);
  return (
    <ListGroup.Item
      as="li"
      action
      active={isActive}
      onClick={handleClick}
      className="device-item"
    >
      {device.name}
    </ListGroup.Item>
  );
});
