import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { ExpandMore as ExpandMoreIcon } from '@material-ui/icons';
import { LoopForm } from './loop-form';
import { RobotDeliveryForm } from './delivery-form';
import { v4 as uuidv4 } from 'uuid';
import * as RomiCore from '@osrf/romi-js-core-interfaces';
import Debug from 'debug';
import React from 'react';
import { ResourcesContext } from './app-contexts';

const debug = Debug('OmniPanel:CommandsPanel');

export type TDeliveryRequest = (
  pickupPlaceName: string,
  pickupDispenser: string,
  dropOffPlaceName: string,
  dropOffDispenser: string,
  pickupBehaviour?: RomiCore.Behavior,
  dropOffBehavior?: RomiCore.Behavior,
) => void;

export type TLoopRequest = (
  fleetName: string,
  numLoops: number,
  startLocationPoint: string,
  endLocationPoint: string,
) => void;

/**
  * task_id: Is intended to be a pseudo-random string generated by the caller which can be used to
  * identify this task as it moves between the queues to completion (or failure).

  * robot_type: Can be used to specify a particular robot fleet for this request.
  * num_loops: The number of times the robot should loop between the specified points.
  * start_name: The name of the waypoint where the robot should begin its loop. If the robot is
  * not already at this point, it will begin the task by moving there.
  * finish_name: The name of the waypoint where the robot should end its looping. The robot will
  * visit this waypoint num_loops times and then stop here on the last visit.
  */
export function requestLoop(
  loopRequestPub: RomiCore.Publisher<RomiCore.Loop> | null,
  fleetName: string,
  numLoops: number,
  startLocationPoint: string,
  endLocationPoint: string,
) {
  loopRequestPub?.publish({
    finish_name: endLocationPoint,
    num_loops: numLoops,
    robot_type: fleetName,
    start_name: startLocationPoint,
    task_id: uuidv4(),
  });
}

/**
* The Delivery task is one where a robot is assigned to pick up an item at one location (pickup_place_name) and deliver it to another (dropoff_place_name). At each of these locations, there is an automation system called workcell/dispenser that loads and unload the item off the robot.

 Currently only these fields are being used in Delivery msg.
* task_id: Unique id for the request.
* pickup_place_name: This is the named waypoint where the robot picks up the item. A "pickup_dispenser" workcell is located at this waypoint.
* pickup_dispenser: Name of the workcell loading the item on the robot at pickup_place_name.
* dropoff_place_name: Named waypoint where the robot drops off the item. A "dropoff_dispenser" workcell is located here.
* dropoff_dispenser: Name of the workcell unloading item from the robot at dropoff_place_name.
*/

export function requestDelivery(
  deliveryRequestPub: RomiCore.Publisher<RomiCore.Delivery> | null,
  pickupPlaceName: string,
  pickupDispenser: string,
  dropOffPlaceName: string,
  dropOffDispenser: string,
  pickupBehaviour?: RomiCore.Behavior,
  dropOffBehavior?: RomiCore.Behavior,
) {
  deliveryRequestPub?.publish({
    items: [{ type_guid: '1', quantity: 1, compartment_name: '1' }],
    pickup_behavior: {
      name: 'pickup_behavior',
      parameters: [{ name: 'pickup_behavior', value: '1' }],
    },
    dropoff_behavior: {
      name: 'dropoff_behavior',
      parameters: [{ name: 'dropoff_behavior', value: '1' }],
    },
    pickup_place_name: pickupPlaceName,
    dropoff_place_name: dropOffPlaceName,
    pickup_dispenser: pickupDispenser,
    dropoff_dispenser: dropOffDispenser,
    task_id: uuidv4(),
  });
}

export interface CommandsPanelProps {
  allFleets: string[];
  transport?: Readonly<RomiCore.Transport>;
}

export const CommandsPanel = React.memo((props: CommandsPanelProps) => {
  debug('render');

  const { allFleets, transport } = props;
  const classes = useStyles();
  const loopRequestPub = React.useMemo(
    () => (transport ? transport.createPublisher(RomiCore.loopRequests) : null),
    [transport],
  );
  const deliveryRequestPub = React.useMemo(
    () => (transport ? transport.createPublisher(RomiCore.deliveryRequest) : null),
    [transport],
  );

  const resourcesContext = React.useContext(ResourcesContext);

  const handleRequestLoop = (
    fleetName: string,
    numLoops: number,
    startLocationPoint: string,
    endLocationPoint: string,
  ) => {
    requestLoop(loopRequestPub, fleetName, numLoops, startLocationPoint, endLocationPoint);
  };

  const handleDeliveryRequest = (
    pickupPlaceName: string,
    pickupDispenser: string,
    dropOffPlaceName: string,
    dropOffDispenser: string,
    pickupBehaviour?: RomiCore.Behavior,
    dropOffBehavior?: RomiCore.Behavior,
  ) => {
    requestDelivery(
      deliveryRequestPub,
      pickupPlaceName,
      pickupDispenser,
      dropOffPlaceName,
      dropOffDispenser,
      pickupBehaviour,
      dropOffBehavior,
    );
  };
  // If we don't have a configuration file with robots and places we should not render the commands forms because we will not be able to execute those commands.
  return (
    <React.Fragment>
      {!!resourcesContext.robots ? (
        <>
          <ExpansionPanel data-component="LoopForm">
            <ExpansionPanelSummary
              classes={{ content: classes.expansionSummaryContent }}
              expandIcon={<ExpandMoreIcon />}
            >
              <Typography variant="h5">Loop Request</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails className={classes.expansionDetail}>
              <LoopForm
                requestLoop={handleRequestLoop}
                fleetNames={allFleets}
                robotHandler={resourcesContext.robots}
              />
            </ExpansionPanelDetails>
          </ExpansionPanel>
          <ExpansionPanel data-component="DeliveryForm">
            <ExpansionPanelSummary
              classes={{ content: classes.expansionSummaryContent }}
              expandIcon={<ExpandMoreIcon />}
            >
              <Typography variant="h5">Delivery Request</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails className={classes.expansionDetail}>
              <RobotDeliveryForm
                requestDelivery={handleDeliveryRequest}
                fleetNames={allFleets}
                robotHandler={resourcesContext.robots}
              />
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </>
      ) : (
        <Typography className={classes.errorText}>
          You do not have a configuration file loaded, therefore the commands cannot be executed. To
          run the commands please add a configuration file.
        </Typography>
      )}
    </React.Fragment>
  );
});

export default CommandsPanel;

export const useStyles = makeStyles(theme => ({
  accordionSummaryContent: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  accordionDetail: {
    flexFlow: 'column',
    paddingLeft: '0.1rem',
  },
  errorText: {
    padding: '1rem',
    color: theme.palette.error.main,
  },
}));
