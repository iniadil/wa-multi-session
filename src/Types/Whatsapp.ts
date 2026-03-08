import { LevelWithSilentOrString } from "pino";
import { MessageReceived, MessageUpdated } from ".";
import { Adapter } from "../Adapter";

export type WhatsappConstructorProps = {
  adapter: Adapter;
  autoLoad?: boolean;
  debugLevel?: LevelWithSilentOrString;

  /**
   * event callbacks
   */
  onConnecting?: (sessionId: string) => any;
  onConnected?: (sessionId: string) => any;
  onDisconnected?: (sessionId: string) => any;
  onMessageUpdated?: (data: MessageUpdated) => any;
  onMessageReceived?: (msg: MessageReceived) => any;
  onQRUpdated?: (qr: string) => any;
  /** Fired when a pairing code is generated for any session. Receives the sessionId and the 8-character code to display to the user. */
  onPairingCode?: (sessionId: string, code: string) => any;
};
