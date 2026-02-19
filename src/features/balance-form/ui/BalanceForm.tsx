import { useState, useCallback, memo } from 'react';
import { Form, InputGroup, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { MINOR_UNITS } from '@/shared/config/constants';
import { normalizeString } from '@/shared/lib/normalization';
import {
  isValidBalanceInput,
  parseAmountToMinor,
  getBalanceValidationError,
} from '@/shared/lib/validation/balanceValidation';
import type { DevicePlaceDto } from '@/entities/device';

interface BalanceFormProps {
  place: DevicePlaceDto;
  onDeposit: (placeId: number, delta: number) => Promise<unknown>;
  onWithdraw: (placeId: number, delta: number) => Promise<unknown>;
}

export const BalanceForm = memo(function BalanceForm({
  place,
  onDeposit,
  onWithdraw,
}: BalanceFormProps) {
  const [amount, setAmount] = useState('');
  const [touched, setTouched] = useState(false);

  const validationError = getBalanceValidationError(amount);
  const showError = touched && validationError;

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>): void => {
    const v = normalizeString(e.target.value) ?? e.target.value;
    if (v === '' || /^\d*\.?\d*$/.test(v)) setAmount(v);
    setTouched(true);
  }, []);

  const handleDeposit = useCallback(async (): Promise<void> => {
    if (!isValidBalanceInput(amount)) {
      toast.error(validationError ?? 'Введите корректную сумму');
      return;
    }
    const minor = parseAmountToMinor(amount, MINOR_UNITS);
    if (minor === null || minor <= 0) {
      toast.error('Введите положительную сумму');
      return;
    }
    try {
      await onDeposit(place.place, minor);
      setAmount('');
      setTouched(false);
      toast.success('Баланс пополнен');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Ошибка пополнения');
    }
  }, [amount, validationError, place.place, onDeposit]);

  const handleWithdraw = useCallback(async (): Promise<void> => {
    if (!isValidBalanceInput(amount)) {
      toast.error(validationError ?? 'Введите корректную сумму');
      return;
    }
    const minor = parseAmountToMinor(amount, MINOR_UNITS);
    if (minor === null || minor <= 0) {
      toast.error('Введите положительную сумму');
      return;
    }
    const currentMinor = place.balances;
    if (minor > currentMinor) {
      toast.error('Недостаточно средств на балансе');
      return;
    }
    try {
      await onWithdraw(place.place, -minor);
      setAmount('');
      setTouched(false);
      toast.success('Средства сняты');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Ошибка снятия');
    }
  }, [amount, validationError, place.place, place.balances, onWithdraw]);

  return (
    <div className="balance-form rounded p-3 mb-3">
      <div className="mb-2">
        <strong>Баланс:</strong> {place.formattedBalance} {place.currency}
      </div>
      <InputGroup size="sm" className="mb-2">
        <Form.Control
          type="text"
          inputMode="decimal"
          placeholder="Сумма (например 100.50)"
          value={amount}
          onChange={handleChange}
          onBlur={() => setTouched(true)}
          isInvalid={!!showError}
          aria-label="Сумма операции"
        />
      </InputGroup>
      {showError && (
        <Form.Text className="text-danger d-block mb-2">
          {validationError}
        </Form.Text>
      )}
      <div className="d-flex gap-2 flex-wrap">
        <Button variant="success" onClick={handleDeposit} size="sm">
          Deposit
        </Button>
        <Button variant="outline-danger" onClick={handleWithdraw} size="sm">
          Withdraw
        </Button>
      </div>
    </div>
  );
});
