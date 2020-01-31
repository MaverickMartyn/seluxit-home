export class Network {
    name: string;
    meta: Meta;
    device?: (Device)[] | null;
  }
  export class Meta {
    type: string;
    version: string;
    id: string;
  }
  export class Device {
    name: string;
    manufacturer: string;
    version: string;
    description?: string | null;
    included: string;
    meta: Meta;
    status?: (null)[] | null;
    value?: (ValueEntity)[] | null;
    product?: string | null;
    serial?: string | null;
    protocol?: string | null;
  }
  export class ValueEntity {
    name?: string | null;
    type?: string | null;
    permission?: string | null;
    status?: string | null;
    number?: NumberEntity | null;
    meta?: Meta | null;
    state?: (StateEntity)[] | null;
    string?: String | null;
  }
  export class NumberEntity {
    unit: string;
    step: number;
    min: number;
    max: number;
  }
  export class StateEntity {
    timestamp: string;
    data: string;
    status_payment: string;
    type: string;
    status: string;
    meta: Meta;
  }
  export class String {
    max: number;
    encoding: string;
  }
  