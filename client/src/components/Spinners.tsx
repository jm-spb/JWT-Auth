import { SpinnerCircular, SpinnerDiamond } from 'spinners-react';

export const MainSpinner = (): JSX.Element => (
  <SpinnerDiamond size={70} speed={150} color="#ffffff" secondaryColor="#666666" />
);

export const ButtonSpinner = (): JSX.Element => (
  <SpinnerCircular size={16} speed={150} color="#ffffff" secondaryColor="#666666" />
);
