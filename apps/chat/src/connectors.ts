import { InjectedConnector } from '@web3-react/injected-connector';

const Injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42],
});

export const connectors = { Injected };
