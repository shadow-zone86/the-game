import { useState, useCallback, lazy, Suspense } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { ContentLoader } from '@/shared/ui/ContentLoader';
import { DeviceList } from '@/widgets/device-list';
import type { DeviceDto } from '@/entities/device';

const PlayerList = lazy(() =>
  import('@/widgets/player-list').then((m) => ({ default: m.PlayerList }))
);

export function HomePage() {
  const [selectedDevice, setSelectedDevice] = useState<DeviceDto | null>(null);
  const selectedId = selectedDevice ? String(selectedDevice.id) : null;

  const handleSelectDevice = useCallback((device: DeviceDto): void => {
    setSelectedDevice(device);
  }, []);

  return (
    <Container fluid className="py-3 py-md-4">
      <Row className="mb-3">
        <Col>
          <h1 className="h4 mb-0">Управление балансами игроков</h1>
        </Col>
      </Row>
      <Row>
        <Col xs={12} md={4} lg={3} className="mb-3 mb-md-0">
          <Card className="h-100">
            <Card.Header>Устройства</Card.Header>
            <Card.Body className="p-0">
              <DeviceList selectedId={selectedId} onSelect={handleSelectDevice} />
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} md={8} lg={9}>
          <Suspense
            fallback={
              <Card className="h-100">
                <Card.Body className="p-0">
                  <ContentLoader />
                </Card.Body>
              </Card>
            }
          >
            <PlayerList deviceId={selectedId} />
          </Suspense>
        </Col>
      </Row>
    </Container>
  );
}
