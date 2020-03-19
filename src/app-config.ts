import * as RomiCore from '@osrf/romi-js-core-interfaces';
import { SossTransport } from '@osrf/romi-js-soss-transport';
import { AuthService } from './auth-service';
import { FakeAuthService } from './mock/fake-auth-service';
import FakeTrajectoryManager from './mock/fake-traj-manager';
import { FakeTransport } from './mock/fake-transport';
import { DefaultTrajectoryManager, RobotTrajectoryManager } from './robot-trajectory-manager';

export interface AppConfig {
  transportFactory: () => Promise<RomiCore.Transport>;
  trajectoryManagerFactory?: () => Promise<RobotTrajectoryManager>;
}

let auth: AuthService;
export let appConfig: AppConfig;

if (!process.env.REACT_APP_MOCK) {
  auth = new FakeAuthService(); // TODO
  appConfig = {
    transportFactory: () =>
      SossTransport.connect('romi-dashboard', 'wss://localhost:50001', auth.token()),
    trajectoryManagerFactory: () => DefaultTrajectoryManager.create('ws://localhost:8006'),
  };
} else {
  auth = new FakeAuthService();
  appConfig = {
    transportFactory: async () => new FakeTransport(),
    trajectoryManagerFactory: async () => new FakeTrajectoryManager(),
  };
}

export default appConfig;