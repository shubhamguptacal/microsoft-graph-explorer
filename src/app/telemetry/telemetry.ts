import { ApplicationAnalytics, ApplicationInsights, SeverityLevel } from '@microsoft/applicationinsights-web';
import ITelemetry from './types';

class Telemetry implements ITelemetry {
  private appInsights: ApplicationInsights;
  private config: any;
  private reactPlugin: any;

  constructor() {
    this.config = {
      instrumentationKey: (window as any).instrumentationKey,
      disableExceptionTracking: true,
    };

    this.appInsights = new ApplicationInsights({
      config: this.config,
    });
  }

  public initialize() {
    this.appInsights.loadAppInsights();

    this.appInsights.trackPageView();
  }

  public trackEvent(eventName: string, payload: any) {
    if (!this.valid(eventName)) {
      throw new Error('Invalid telemetry event name');
    }

    this.appInsights.trackEvent({ name: eventName }, payload);
  }

  public trackException(error: Error, severityLevel: SeverityLevel) {
    this.appInsights.trackException({ error, severityLevel });
  }

  // A valid event name ends with the word EVENT
  private valid(eventName: string): boolean {
    const listOfWords = eventName.split('_');
    const lastIndex = listOfWords.length - 1;
    const lastWord = listOfWords[lastIndex];
    return lastWord === 'EVENT';
  }
}

export const telemetry = new Telemetry();
