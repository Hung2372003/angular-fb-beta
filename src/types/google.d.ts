// src/types/google.d.ts

declare namespace google {
  namespace accounts.id {
    interface CredentialResponse {
      credential: string;
      select_by: string;
      clientId: string;
    }
    interface IdConfiguration {
    client_id: string;
    callback: (response: CredentialResponse) => void;
    auto_select?: boolean;
    ux_mode?: 'popup' | 'redirect';
    login_uri?: string;
    native_callback?: Function;
    context?: string;
    nonce?: string;
    state_cookie_domain?: string;
    itp_support?: boolean;
  }

    function initialize(config: {
      client_id: string;
      callback: (response: CredentialResponse) => void;
    }): void;

    function renderButton(
      parent: HTMLElement,
      options: {
        theme: 'outline' | 'filled_blue' | 'filled_black';
        size: 'small' | 'medium' | 'large';
        text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
        shape?: 'rectangular' | 'pill' | 'circle' | 'square';
        logo_alignment?: 'left' | 'center';
      }
    ): void;

    function prompt(callback?: (notification: PromptMomentNotification) => void): void;

    function disableAutoSelect(): void;

    interface PromptMomentNotification {
      isDisplayMoment: () => boolean;
      isDisplayed: () => boolean;
      isNotDisplayed: () => boolean;
      getNotDisplayedReason: () => string;
      isSkippedMoment: () => boolean;
      getSkippedReason: () => string;
      isDismissedMoment: () => boolean;
      getDismissedReason: () => string;
    }
  }
}
