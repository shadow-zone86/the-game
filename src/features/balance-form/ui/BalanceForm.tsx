import { useState, useCallback, memo } from 'react';
import { Form, InputGroup, Button } from 'react-bootstrap';
import styles from './BalanceForm.module.css';
import { BALANCE_INPUT_PATTERN } from '@/shared/config/constants';
import { normalizeString } from '@/shared/lib/normalization';
import { getBalanceValidationError } from '@/shared/lib/validation/balanceValidation';
import { submitBalanceOperation } from '../lib';
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
    if (v === '' || BALANCE_INPUT_PATTERN.test(v)) setAmount(v);
    setTouched(true);
  }, []);

  const resetForm = useCallback(() => {
    setAmount('');
    setTouched(false);
  }, []);

  const handleDeposit = useCallback(async (): Promise<void> => {
    await submitBalanceOperation({
      amount,
      validationError,
      placeId: place.place,
      submit: onDeposit,
      deltaSign: 1,
      messages: { success: 'Баланс пополнен', error: 'Ошибка пополнения' },
      onSuccess: resetForm,
    });
  }, [amount, validationError, place.place, onDeposit, resetForm]);

  const handleWithdraw = useCallback(async (): Promise<void> => {
    await submitBalanceOperation({
      amount,
      validationError,
      placeId: place.place,
      currentBalance: place.balances,
      submit: onWithdraw,
      deltaSign: -1,
      messages: { success: 'Средства сняты', error: 'Ошибка снятия' },
      onSuccess: resetForm,
    });
  }, [amount, validationError, place.place, place.balances, onWithdraw, resetForm]);

  return (
    <div className={`${styles.balanceForm} rounded p-3 mb-3`}>
      <div className="mb-2">
        <strong>Место {place.place}</strong>
        <span className="text-muted ms-2">
          Баланс: {place.formattedBalance} {place.currency}
        </span>
      </div>
      <InputGroup size="sm" className="mb-2">
        <Form.Control
          className={styles.formControl}
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
