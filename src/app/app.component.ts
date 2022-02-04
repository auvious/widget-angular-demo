import { Component, ChangeDetectionStrategy, OnInit, ViewChild, TemplateRef, ViewContainerRef, EmbeddedViewRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { RegistrationTypeEnum, IWidgetOptions } from '@auvious/genesys-widget/dist';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {

  options = {
    pcEnvironment: 'mypurecloud.de',
    locale: 'en-GR',
    pcQueue: 'mike queue',
    pcOrganizationId: 'abc-123-abc-123',
    pcDeploymentId: 'abc-123-abc-123',
    registrationType: 'name',
    customerAvatarUrl: 'https://auvious.com/logo.svg',
    applicationId: 'abc-123-abc-123',
    darkMode: true,
    queueExtraSeconds: 30,
    waitForGreetingSeconds: 3,
    colorPrimary: null,
    colorAccent: null,
    colorWarn: null,
    pcCallbackQueue: 'my test queue',
    auviousEnvironment: 'auvious.video',
    chatMode: 'genesys-cloud',
    activeWidgets: 'video'
  };

  widgetOptionsHidden = true;

  @ViewChild('widgetContainer', { static: true, read: ViewContainerRef }) container: ViewContainerRef;
  @ViewChild('widgetTemplate', { static: true }) auviousWidget: TemplateRef<IWidgetOptions>;

  private widgetView: EmbeddedViewRef<IWidgetOptions>;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get('../config.json')
      .subscribe((config: any) => {
        this.options = {
          pcEnvironment: config.pcEnvironment,
          locale: config.language,
          pcQueue: config.pcQueue,
          pcOrganizationId: config.pcOrganizationId,
          pcDeploymentId: config.pcDeploymentId,
          registrationType: config.registrationType,
          customerAvatarUrl: config.customerAvatarUrl,
          darkMode: config.darkMode === 'true' || config.darkMode === true,
          queueExtraSeconds: Number(config.queueExtraSeconds),
          waitForGreetingSeconds: Number(config.waitForGreetingSeconds),
          colorPrimary: config.colorPrimary,
          colorAccent: config.colorAccent,
          colorWarn: config.colorWarn,
          pcCallbackQueue: config.pcCallbackQueueId,
          auviousEnvironment: config.auviousBaseUrl,
          chatMode: config.chatMode,
          activeWidgets: config.activeWidgets,
          applicationId: config.applicationId
        };
        console.log('widget options updated', this.options);
      },
        (error) => console.log('widget options not updated'));

    this.createWidget();
    this.updateWidgetOptions();

  }

  toggleWidgetOptions() {
    this.widgetOptionsHidden = !this.widgetOptionsHidden;
  }

  createWidget() {
    this.widgetView = this.container.createEmbeddedView(this.auviousWidget);
  }

  updateWidgetOptions() {
    this.widgetView.destroy();
    this.createWidget();

    const widget: IWidgetOptions = this.widgetView.rootNodes[0];

    widget.pcEnvironment = this.options.pcEnvironment;
    widget.locale = this.options.locale;
    widget.pcQueue = this.options.pcQueue;
    widget.pcOrganizationId = this.options.pcOrganizationId;
    widget.pcDeploymentId = this.options.pcDeploymentId;
    widget.registrationType = this.options.registrationType;
    widget.customerAvatarUrl = this.options.customerAvatarUrl;
    widget.darkMode = this.options.darkMode;
    widget.queueExtraSeconds = this.options.queueExtraSeconds;
    widget.waitForGreetingSeconds = this.options.waitForGreetingSeconds;
    widget.colorPrimary = this.options.colorPrimary;
    widget.colorAccent = this.options.colorAccent;
    widget.colorWarn = this.options.colorWarn;
    // new stuff
    widget.pcCallbackQueueId = this.options.pcCallbackQueue;
    widget.auviousBaseUrl = this.options.auviousEnvironment;
    widget.chatMode = this.options.chatMode;
    widget.activeWidgets = this.options.activeWidgets;
    widget.applicationId = this.options.applicationId;

    widget.setTranslations({ 'type your name': 'type your name...' });

    widget.addEventListener('callStarting', () => {
      console.log('event : starting')
    });
    widget.addEventListener('callStarted', () => {
      console.log('event: started')
    });
    widget.addEventListener('callEnded', () => {
      console.log('event: call ended')
    });
    widget.addEventListener('conversationEnded', () => {
      console.log('event: conversation ended');
    });
    widget.addEventListener('ready', () => {
      console.log('event: ready')
      // call('video')
    })
    widget.addEventListener('queueTimeChanged', (e) => {
      console.log('event: queue time changed', e.detail)
    })
    widget.addEventListener('agentConnected', () => {
      console.log('event: agent connected')
    })
    widget.addEventListener('agentDisconnected', () => {
      console.log('event: agent disconnected')
    })
    widget.addEventListener('errorHandled', (error) => {
      console.log('error');
    })
    widget.addEventListener('conversationReady', (e) => {
      console.log('event: conversation Ready')
    })

  }
}
