import azureOtel from '@azure/functions-opentelemetry-instrumentation';
import { AzureMonitorLogExporter, AzureMonitorMetricExporter, AzureMonitorTraceExporter } from '@azure/monitor-opentelemetry-exporter';
import { DataloaderInstrumentation } from '@opentelemetry/instrumentation-dataloader';
import { GraphQLInstrumentation } from '@opentelemetry/instrumentation-graphql';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { MongooseInstrumentation } from '@opentelemetry/instrumentation-mongoose';
import { BatchLogRecordProcessor, ConsoleLogRecordExporter, type LogRecordExporter, SimpleLogRecordProcessor } from '@opentelemetry/sdk-logs';
import { ConsoleMetricExporter, PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import type { NodeSDKConfiguration } from '@opentelemetry/sdk-node';
import { BatchSpanProcessor, ConsoleSpanExporter, SimpleSpanProcessor } from '@opentelemetry/sdk-trace-node';

import { httpInstrumentationConfig } from './http-config.js';

const { AzureFunctionsInstrumentation } = azureOtel; //Need to use destructuring to access AzureFunctionsInstrumentation (CommonJS module)

interface Exporters {
	traceExporter: AzureMonitorTraceExporter | ConsoleSpanExporter;
	metricExporter: AzureMonitorMetricExporter | ConsoleMetricExporter;
	logExporter: LogRecordExporter;
}

/**
 * AzureMonitorLogExporter targets an older @opentelemetry/sdk-logs whose exporters have no
 * forceFlush, but newer log record processors call it unconditionally when flushing.
 * Its export() resolves once a batch is sent, so there is nothing extra to flush.
 */
function withForceFlush(exporter: Omit<LogRecordExporter, 'forceFlush'>): LogRecordExporter {
	return Object.assign(exporter, { forceFlush: () => Promise.resolve() });
}

export class OtelBuilder {
	public buildExporters(exportToConsole: boolean = false): Exporters {
		if (exportToConsole) {
			return {
				traceExporter: new ConsoleSpanExporter(),
				metricExporter: new ConsoleMetricExporter(),
				logExporter: new ConsoleLogRecordExporter(),
			};
		} else {
			//biome-ignore lint:useLiteralKeys
			if (!process.env['APPLICATIONINSIGHTS_CONNECTION_STRING']) {
				throw new Error('Missing required environment variable: APPLICATIONINSIGHTS_CONNECTION_STRING');
			}
			return {
				traceExporter: new AzureMonitorTraceExporter({
					connectionString:
						//biome-ignore lint:useLiteralKeys
						process.env['APPLICATIONINSIGHTS_CONNECTION_STRING'],
				}),
				metricExporter: new AzureMonitorMetricExporter({
					connectionString:
						//biome-ignore lint:useLiteralKeys
						process.env['APPLICATIONINSIGHTS_CONNECTION_STRING'],
				}),
				logExporter: withForceFlush(
					new AzureMonitorLogExporter({
						connectionString:
							//biome-ignore lint:useLiteralKeys
							process.env['APPLICATIONINSIGHTS_CONNECTION_STRING'],
					}),
				),
			};
		}
	}

	public buildProcessors(useSimpleProcessors: boolean = false, exporters: Exporters): Partial<NodeSDKConfiguration> {
		if (useSimpleProcessors) {
			return {
				spanProcessors: [new SimpleSpanProcessor(exporters.traceExporter)],
				logRecordProcessors: [new SimpleLogRecordProcessor({ exporter: exporters.logExporter })],
			};
		} else {
			const EXPORT_TIMEOUT_MILLIS = 15000;
			const MAX_QUEUE_SIZE = 1000;
			return {
				spanProcessors: [
					new BatchSpanProcessor(exporters.traceExporter, {
						exportTimeoutMillis: EXPORT_TIMEOUT_MILLIS,
						maxQueueSize: MAX_QUEUE_SIZE,
					}),
				],
				logRecordProcessors: [
					new BatchLogRecordProcessor({
						exporter: exporters.logExporter,
						exportTimeoutMillis: EXPORT_TIMEOUT_MILLIS,
						maxQueueSize: MAX_QUEUE_SIZE,
					}),
				],
			};
		}
	}

	public buildMetricReader(exporters: Exporters) {
		const EXPORT_INTERVAL_MILLIS = 60000;
		return new PeriodicExportingMetricReader({
			exporter: exporters.metricExporter,
			exportIntervalMillis: EXPORT_INTERVAL_MILLIS,
		});
	}

	public buildInstrumentations() {
		return [
			new HttpInstrumentation(httpInstrumentationConfig), //required by AzureFunctionsInstrumentation
			new AzureFunctionsInstrumentation({ enabled: true }),
			new GraphQLInstrumentation({ allowValues: true }),
			new DataloaderInstrumentation(),
			new MongooseInstrumentation(),
		];
	}
}
