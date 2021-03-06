import { Divider, Typography } from '@material-ui/core';
import { Story } from '@storybook/react';
import React from 'react';
import { DispenserAccordion, StatusLabel } from '../lib';
import { makeDispenserState } from '../tests/dispensers/test-utils';

export default {
  title: 'Design Decisions',
};

const statelessDispenserGuid = 'stateless dispenser';
const styles: Record<string, React.CSSProperties> = {
  root: {
    margin: '0 auto',
  },
  spacing: {
    margin: '1rem 0',
  },
};

export const handleLongName: Story = (args) => (
  <div style={styles.root}>
    <Typography variant="body1">
      Since the names of the items have the potential to be longer than the container they are in,
      we truncate it with an ellipsis if it exceeds and also included a <b>Name</b> field in the
      detail panel. Shown below is an example on the dispenser panel.
    </Typography>
    <Divider style={{ margin: '1rem 0' }} />
    <div style={{ ...styles.spacing, width: 400 }}>
      <DispenserAccordion
        dispenserState={makeDispenserState({
          guid: 'dispenser with a really long name',
        })}
        dispenser={'dispenser'}
        {...args}
      />
    </div>
  </div>
);

export const handleUnknown: Story = () => (
  <div>
    <Typography style={styles.spacing} variant="body1">
      Sometimes, device states might be returned as <b>Unknown</b> for various reasons. As{' '}
      <b>Unknown </b>
      is too long for the width of the status label, we display it as <b>N/A </b>
      with a greyed out border instead.
    </Typography>
    <Divider style={{ margin: '1rem 0' }} />
    <StatusLabel variant="unknown" />
  </div>
);

export const ItemsWithUnknownState: Story = (args) => (
  <div>
    <Typography variant="body1">
      There are situations where the state of a component (for example, dispenser or robots) is not
      known due to them being disconnected from RMF or other reasons. We would display a message to
      show users that the current state of the item is unknown.
    </Typography>
    <Divider style={{ margin: '1rem 0' }} />
    <div style={{ ...styles.spacing, width: 400 }}>
      <DispenserAccordion dispenser={statelessDispenserGuid} dispenserState={null} {...args} />
    </div>
  </div>
);
