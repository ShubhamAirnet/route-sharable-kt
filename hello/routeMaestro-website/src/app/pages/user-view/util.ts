import { load, Cashfree } from '@cashfreepayments/cashfree-js';

const initializeCashfree = async (): Promise<Cashfree> => {
  const cashfree = await load({
    mode: "sandbox", // or production
  });

  return cashfree;
};

export const cashfree: Promise<Cashfree> = initializeCashfree();
