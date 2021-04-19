import { render, waitFor, screen } from '@testing-library/react';
import React from 'react';
import { DispenserStateReport } from '../../../lib';
import { getDispenserLogs } from '../utils';

const getLogsPromise = async () => await getDispenserLogs();

it('smoke test', async () => {
  // Added the waitFor because this component is updating a state inside a useEffect.
  await waitFor(() => {
    render(<DispenserStateReport getLogs={getLogsPromise} />);
  });
});

it('doesn`t shows the table when logs list is empty', async () => {
  // Added the waitFor because this component is updating a state inside a useEffect.
  await waitFor(() => {
    render(<DispenserStateReport getLogs={async () => await []} />);
  });

  expect(screen.queryByText('Dispensers State')).toBeFalsy();
});