import { useMemo, useCallback } from 'react';
import { Card, ListGroup, Alert } from 'react-bootstrap';
import { ContentLoader } from '@/shared/ui/ContentLoader';
import { MIN_LOADER_MS } from '@/shared/config/constants';
import { useMinLoaderDelay } from '@/shared/lib/hooks/useMinLoaderDelay';
import { getErrorMessage } from '@/shared/lib/errors';
import { useDeviceQuery, useUpdateBalanceMutation } from '@/entities/device';
import { BalanceForm } from '@/features/balance-form';

interface PlayerListProps {
  deviceId: string | null;
}

export function PlayerList({ deviceId }: PlayerListProps) {
  const { data: device, isLoading, error } = useDeviceQuery(deviceId);
  const mutation = useUpdateBalanceMutation(deviceId);
  const showContent = useMinLoaderDelay(isLoading, MIN_LOADER_MS);

  const places = useMemo(() => device?.places ?? [], [device?.places]);

  const handleBalanceMutation = useCallback(
    (placeId: number, delta: number) =>
      mutation.mutateAsync({ placeId, delta }),
    [mutation]
  );

  if (!deviceId) {
    return (
      <Card className="h-100 player-list-placeholder">
        <Card.Body className="text-muted text-center d-flex justify-content-center align-items-center">
          Выберите устройство в списке слева
        </Card.Body>
      </Card>
    );
  }

  if (isLoading || !showContent) {
    return (
      <Card className="h-100 player-list-loader">
        <Card.Body className="p-0 h-100 d-flex justify-content-center align-items-center">
          <ContentLoader />
        </Card.Body>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="danger">
        Ошибка загрузки:{' '}
        {getErrorMessage(error, 'Неизвестная ошибка')}
      </Alert>
    );
  }

  return (
    <Card className="h-100 player-list-entrance">
      <Card.Header>
        <strong>Игроки</strong> — {device?.name ?? ''}
      </Card.Header>
      <ListGroup variant="flush" className="list-group list-group-flush">
        {places.length === 0 ? (
          <ListGroup.Item className="text-muted">
            Нет мест (игроков)
          </ListGroup.Item>
        ) : (
          places.map((place) => (
            <ListGroup.Item key={place.place} className="player-item">
              <div className="player-item__content">
                <BalanceForm
                  place={place}
                  onDeposit={handleBalanceMutation}
                  onWithdraw={handleBalanceMutation}
                />
              </div>
            </ListGroup.Item>
          ))
        )}
      </ListGroup>
    </Card>
  );
}
