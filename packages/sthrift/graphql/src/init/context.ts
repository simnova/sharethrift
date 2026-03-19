import type { BaseContext } from '@apollo/server';
import type { ApplicationServices } from '@sthrift/application-services';

export interface GraphContext extends BaseContext {
	applicationServices: ApplicationServices;
}
