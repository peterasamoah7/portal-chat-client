import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { HubConnection, IHttpConnectionOptions } from '@microsoft/signalr';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SignalRConnectionInfo } from 'src/models/SignalRConnectionInfo';
import * as signalR from '@microsoft/signalr';
import { ChatMessage } from 'src/models/ChatMessage';


@Injectable({
  providedIn: 'root'
})
export class SignalrService {
  hubConnection: HubConnection;
  messageReceived: EventEmitter<ChatMessage> = new EventEmitter();

  constructor(private http: HttpClient) { }

  private getConnectionInfo(): Observable<SignalRConnectionInfo> {
    const requestUrl = `${environment.apiUrl}/api/negotiate`;
    return this.http.post<SignalRConnectionInfo>(requestUrl, null);
  }

  init() {
      this.getConnectionInfo().subscribe((info: SignalRConnectionInfo) => {
          const options = {
              accessTokenFactory: () => info.accessToken
          };
          console.log(info);
          this.createConnection(info.url, options);
          this.startConnection();
      },
      error => {
          console.error(`An error occurred during init: ${error}`);
          console.log('Retrying connection to Azure Function - SignalR Hub ...');
          setTimeout(() => {
              this.init();
          }, 10000);
      });
  }

  private createConnection(url: string, options: IHttpConnectionOptions) {
    this.hubConnection = new signalR.HubConnectionBuilder()
        .withUrl(url, options)
        .configureLogging(signalR.LogLevel.Information)
        .withAutomaticReconnect()
        .build();

    this.hubConnection.onclose(err => {
        console.log('Azure Function - SignalR Hub connection closed.');
        this.stopHubAndunSubscribeToServerEvents();
    });
  }

  private startConnection(): void {
    this.hubConnection
      .start()
      .then(() => {
          console.log('Azure Function - SignalR Hub connection started.');
          this.subscribeToServerEvents();
      })
      .catch(err => {
        console.log('Connection failed');
    });
  }

  send(message: ChatMessage) {
    const requestUrl = `${environment.apiUrl}/api/messages`;
    this.http.post(requestUrl, message).subscribe(
        (data: any) => console.log('Message sent'),
        error => console.error(`An error occurred in sendMessage: ${error}`)
    );
  }

  private subscribeToServerEvents(): void {
    this.hubConnection.on('newMessage', (data: any) => {
        this.messageReceived.emit(data);
    });
  }

  private stopHubAndunSubscribeToServerEvents(): void {
    this.hubConnection.off('newMessage');
    this.hubConnection.stop().then(() => console.log('Hub connection stopped'));
  }
}
