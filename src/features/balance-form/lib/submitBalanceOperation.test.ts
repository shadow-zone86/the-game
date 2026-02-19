import { describe, it, expect, vi, beforeEach } from 'vitest';
import { submitBalanceOperation } from './submitBalanceOperation';

const mockToastError = vi.fn();
const mockToastSuccess = vi.fn();

vi.mock('react-toastify', () => ({
  toast: {
    error: (...args: unknown[]) => mockToastError(...args),
    success: (...args: unknown[]) => mockToastSuccess(...args),
  },
}));

function createParams(overrides: Partial<Parameters<typeof submitBalanceOperation>[0]> = {}) {
  return {
    amount: '100.50',
    validationError: null,
    placeId: 1,
    submit: vi.fn().mockResolvedValue(undefined),
    deltaSign: 1 as const,
    successMessage: 'Баланс пополнен',
    errorMessage: 'Ошибка пополнения',
    onSuccess: vi.fn(),
    ...overrides,
  };
}

describe('submitBalanceOperation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('при невалидном вводе вызывает toast.error и не вызывает submit', async () => {
    const params = createParams({ amount: '', validationError: 'Введите число' });

    await submitBalanceOperation(params);

    expect(mockToastError).toHaveBeenCalledWith('Введите число');
    expect(params.submit).not.toHaveBeenCalled();
    expect(params.onSuccess).not.toHaveBeenCalled();
    expect(mockToastSuccess).not.toHaveBeenCalled();
  });

  it('при невалидном вводе использует дефолтное сообщение, если validationError null', async () => {
    const params = createParams({ amount: 'abc', validationError: null });

    await submitBalanceOperation(params);

    expect(mockToastError).toHaveBeenCalledWith('Введите корректную сумму');
  });

  it('при нулевой или отрицательной сумме вызывает toast.error', async () => {
    await submitBalanceOperation(createParams({ amount: '0' }));
    expect(mockToastError).toHaveBeenCalledWith('Введите положительную сумму');

    vi.clearAllMocks();
    await submitBalanceOperation(createParams({ amount: '0.00' }));
    expect(mockToastError).toHaveBeenCalledWith('Введите положительную сумму');
  });

  it('при withdraw и недостатке средств вызывает toast.error', async () => {
    const params = createParams({
      amount: '100',
      placeId: 1,
      currentBalance: 5000,
      submit: vi.fn(),
      deltaSign: -1,
    });

    await submitBalanceOperation(params);

    expect(mockToastError).toHaveBeenCalledWith('Недостаточно средств на балансе');
    expect(params.submit).not.toHaveBeenCalled();
  });

  it('при deposit вызывает submit с положительной дельтой, onSuccess и toast.success', async () => {
    const params = createParams({
      amount: '100.50',
      placeId: 1,
      deltaSign: 1,
      successMessage: 'Баланс пополнен',
    });

    await submitBalanceOperation(params);

    expect(params.submit).toHaveBeenCalledWith(1, 10050);
    expect(params.onSuccess).toHaveBeenCalled();
    expect(mockToastSuccess).toHaveBeenCalledWith('Баланс пополнен');
  });

  it('при withdraw вызывает submit с отрицательной дельтой', async () => {
    const params = createParams({
      amount: '50.25',
      placeId: 2,
      currentBalance: 10000,
      deltaSign: -1,
      successMessage: 'Средства сняты',
    });

    await submitBalanceOperation(params);

    expect(params.submit).toHaveBeenCalledWith(2, -5025);
    expect(params.onSuccess).toHaveBeenCalled();
    expect(mockToastSuccess).toHaveBeenCalledWith('Средства сняты');
  });

  it('при withdraw с достаточным балансом пропускает проверку currentBalance если она undefined', async () => {
    const params = createParams({
      amount: '10',
      placeId: 1,
      currentBalance: undefined,
      deltaSign: -1,
    });

    await submitBalanceOperation(params);

    expect(params.submit).toHaveBeenCalledWith(1, -1000);
  });

  it('при ошибке submit вызывает toast.error с сообщением из Error', async () => {
    const params = createParams({
      submit: vi.fn().mockRejectedValue(new Error('Сервер недоступен')),
    });

    await submitBalanceOperation(params);

    expect(mockToastError).toHaveBeenCalledWith('Сервер недоступен');
    expect(params.onSuccess).not.toHaveBeenCalled();
    expect(mockToastSuccess).not.toHaveBeenCalled();
  });

  it('при ошибке submit (не Error) использует errorMessage', async () => {
    const params = createParams({
      submit: vi.fn().mockRejectedValue('unknown error'),
      errorMessage: 'Ошибка пополнения',
    });

    await submitBalanceOperation(params);

    expect(mockToastError).toHaveBeenCalledWith('Ошибка пополнения');
  });
});
