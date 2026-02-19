import { useMemo, useState, useEffect, useRef, useCallback } from 'react';
import { Card, ListGroup, Spinner, Alert } from 'react-bootstrap';
import { MIN_LOADER_MS } from '@/shared/config/constants';
import { useDeviceQuery, useUpdateBalanceMutation } from '@/entities/device';
import { BalanceForm } from '@/features/balance-form';

interface PlayerListProps {
  deviceId: string | null;
}

export function PlayerList({ deviceId }: PlayerListProps) {
  const { data: device, isLoading, error } = useDeviceQuery(deviceId);
  const mutation = useUpdateBalanceMutation(deviceId);
  const [showContent, setShowContent] = useState(false);
  const loadStartRef = useRef<number | null>(null);

  const places = useMemo(() => device?.places ?? [], [device?.places]);

  const handleDeposit = useCallback(
    (placeId: number, delta: number) =>
      mutation.mutateAsync({ placeId, delta }),
    [mutation]
  );
  const handleWithdraw = useCallback(
    (placeId: number, delta: number) =>
      mutation.mutateAsync({ placeId, delta }),
    [mutation]
  );

  // Минимальное время показа лоадера — избегаем мигания при быстрой загрузке
  useEffect(() => {
    if (isLoading) {
      loadStartRef.current = Date.now();
      queueMicrotask(() => setShowContent(false));
    } else if (!isLoading && device && !error) {
      const elapsed = loadStartRef.current
        ? Date.now() - loadStartRef.current
        : 0;
      const delay = Math.max(0, MIN_LOADER_MS - elapsed);
      const t = setTimeout(() => setShowContent(true), delay);
      return () => clearTimeout(t);
    } else {
      queueMicrotask(() => setShowContent(false));
    }
  }, [isLoading, device, error]);

  if (!deviceId) {
    return (
      <Card className="h-100 player-list-placeholder">
        <Card.Body className="text-muted text-center">
          Выберите устройство в списке слева
        </Card.Body>
      </Card>
    );
  }

  if (isLoading || !showContent) {
    return (
      <Card className="h-100 player-list-loader">
        <Card.Body className="d-flex justify-content-center align-items-center">
          <Spinner animation="border" />
        </Card.Body>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="danger">
        Ошибка загрузки:{' '}
        {error instanceof Error ? error.message : 'Неизвестная ошибка'}
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
                  onDeposit={handleDeposit}
                  onWithdraw={handleWithdraw}
                />
              </div>
            </ListGroup.Item>
          ))
        )}
      </ListGroup>
    </Card>
  );
}
