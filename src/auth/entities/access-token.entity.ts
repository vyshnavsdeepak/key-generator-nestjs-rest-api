import { decode, encode, TAlgorithm } from 'jwt-simple';

import config from 'src/config/configuration';

interface Session {
  dateCreated: number;
  userName: string;
  /**
   * Timestamp indicating when the session was created, in Unix milliseconds.
   */
  issued: number;
  /**
   * Timestamp indicating when the session should expire, in Unix milliseconds.
   */
  expires: number;
}

type PartialSession = Omit<Session, 'issued' | 'expires'>;

interface EncodeResult {
  token: string;
  expires: number;
  issued: number;
}

type DecodeResult =
  | {
      type: 'valid';
      session: Session;
    }
  | {
      type: 'integrity-error';
    }
  | {
      type: 'invalid-token';
    };

type ExpirationStatus = 'expired' | 'active';

export class AccessToken {
  payload: PartialSession;
  private secretKey: string = config.jwt.secret;
  // Always use HS512 to decode the token
  private algorithm: TAlgorithm = 'HS512';

  encodeSession(): EncodeResult {
    console.log({ secretKey: this.secretKey });
    // Always use HS512 to sign the token
    // Determine when the token should expire
    const issued = Date.now();
    const fifteenMinutesInMs = 15 * 60 * 1000;
    const expires = issued + fifteenMinutesInMs;
    const session: Session = {
      ...this.payload,
      issued: issued,
      expires: expires,
    };

    return {
      token: encode(session, this.secretKey, this.algorithm),
      issued: issued,
      expires: expires,
    };
  }

  decodeSession(tokenString: string): DecodeResult {
    let result: Session;

    try {
      result = decode(tokenString, this.secretKey, false, this.algorithm);
    } catch (_e) {
      const e: Error = _e;

      // These error strings can be found here:
      // https://github.com/hokaccha/node-jwt-simple/blob/c58bfe5e5bb049015fcd55be5fc1b2d5c652dbcd/lib/jwt.js
      if (
        e.message === 'No token supplied' ||
        e.message === 'Not enough or too many segments'
      ) {
        return {
          type: 'invalid-token',
        };
      }

      if (
        e.message === 'Signature verification failed' ||
        e.message === 'Algorithm not supported'
      ) {
        return {
          type: 'integrity-error',
        };
      }

      throw e;
    }

    return {
      type: 'valid',
      session: result,
    };
  }
  checkExpirationStatus(token: Session): ExpirationStatus {
    const now = Date.now();

    if (token.expires > now) return 'active';

    return 'expired';
  }
}
