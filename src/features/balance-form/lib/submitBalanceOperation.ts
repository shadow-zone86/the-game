import { toast } from 'react-toastify';
import { MINOR_UNITS } from '@/shared/config/constants';
import {
  isValidBalanceInput,
  parseAmountToMinor,
} from '@/shared/lib/validation/balanceValidation';

interface SubmitBalanceOperationParams {
  amount: string;
  validationError: string | null;
  placeId: number;
  currentBalance?: number;
  submit: (placeId: number, delta: number) => Promise<unknown>;
  deltaSign: 1 | -1;
  successMessage: string;
  errorMessage: string;
  onSuccess: () => void;
}

export async function submitBalanceOperation({
  amount,
  validationError,
  placeId,
  currentBalance,
  submit,
  deltaSign,
  successMessage,
  errorMessage,
  onSuccess,
}: SubmitBalanceOperationParams): Promise<void> {
  if (!isValidBalanceInput(amount)) {
    toast.error(validationError ?? 'Введите корректную сумму');
    return;
  }
  const minor = parseAmountToMinor(amount, MINOR_UNITS);
  if (minor === null || minor <= 0) {
    toast.error('Введите положительную сумму');
    return;
  }
  if (deltaSign === -1 && currentBalance !== undefined && minor > currentBalance) {
    toast.error('Недостаточно средств на балансе');
    return;
  }
  try {
    await submit(placeId, minor * deltaSign);
    onSuccess();
    toast.success(successMessage);
  } catch (e) {
    toast.error(e instanceof Error ? e.message : errorMessage);
  }
}
