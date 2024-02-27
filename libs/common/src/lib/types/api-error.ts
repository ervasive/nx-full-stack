export enum ApiErrorCode {
  Unauthorized = 'RLS',
  UserCreds = 'CREDS',
  UserBlocked = 'BLCKD',
  FieldValidation = 'FIELD_VALIDATION',
  Network = 'NETWORK',
  Server = 'SERVER',
  Unknown = 'UNKNOWN',
}

export enum FieldErrorReason {
  InvalidType = 'INVALID_TYPE',
  NonUnique = 'NON_UNIQUE',
  Length = 'LENGTH',
  Range = 'RANGE',
  Format = 'FORMAT',
  Values = 'VALUES',
  Custom = 'CUSTOM',
  Unknown = 'UNKNOWN',
}

export type SupportedError =
  | { code: ApiErrorCode.Network }
  | { code: ApiErrorCode.Unauthorized }
  | { code: ApiErrorCode.UserCreds }
  | { code: ApiErrorCode.UserBlocked }
  | { code: ApiErrorCode.Unknown }
  | { code: ApiErrorCode.Server; message: string }
  | {
      code: ApiErrorCode.FieldValidation;
      reason: FieldErrorReason.InvalidType;
      field: string;
      expected: string;
      received: string;
    }
  | {
      code: ApiErrorCode.FieldValidation;
      reason: FieldErrorReason.NonUnique;
      field: string;
    }
  | {
      code: ApiErrorCode.FieldValidation;
      reason: FieldErrorReason.Length;
      min?: number;
      max?: number;
      field: string;
    }
  | {
      code: ApiErrorCode.FieldValidation;
      reason: FieldErrorReason.Range;
      min?: number;
      max?: number;
      field: string;
    }
  | {
      code: ApiErrorCode.FieldValidation;
      reason: FieldErrorReason.Values;
      list: string[];
      field: string;
    }
  | {
      code: ApiErrorCode.FieldValidation;
      reason: FieldErrorReason.Format;
      format: string;
      field: string;
    }
  | {
      code: ApiErrorCode.FieldValidation;
      reason: FieldErrorReason.Custom;
      value: string;
      field: string;
    }
  | {
      code: ApiErrorCode.FieldValidation;
      reason: FieldErrorReason.Unknown;
      field: string;
    };

export type SupportedErrorsHandler = (
  error: SupportedError
) => undefined | string | Error | never;
