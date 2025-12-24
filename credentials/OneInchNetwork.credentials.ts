/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import {
  IAuthenticateGeneric,
  ICredentialTestRequest,
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

export class OneInchNetwork implements ICredentialType {
  name = 'oneInchNetwork';
  displayName = '1inch Network';
  documentationUrl = 'https://docs.1inch.io/docs/aggregation-protocol/introduction';
  properties: INodeProperties[] = [
    {
      displayName: 'Network',
      name: 'network',
      type: 'options',
      default: 'ethereum',
      options: [
        { name: 'Ethereum Mainnet', value: 'ethereum' },
        { name: 'Polygon', value: 'polygon' },
        { name: 'BNB Chain', value: 'bsc' },
        { name: 'Arbitrum One', value: 'arbitrum' },
        { name: 'Optimism', value: 'optimism' },
        { name: 'Avalanche C-Chain', value: 'avalanche' },
        { name: 'Gnosis Chain', value: 'gnosis' },
        { name: 'Fantom Opera', value: 'fantom' },
        { name: 'Base', value: 'base' },
        { name: 'zkSync Era', value: 'zksync' },
        { name: 'Aurora', value: 'aurora' },
        { name: 'Klaytn', value: 'klaytn' },
        { name: 'Custom', value: 'custom' },
      ],
      description: 'The blockchain network to connect to',
    },
    {
      displayName: 'Custom RPC URL',
      name: 'customRpcUrl',
      type: 'string',
      default: '',
      placeholder: 'https://your-rpc-endpoint.com',
      description: 'Custom RPC endpoint URL',
      displayOptions: {
        show: {
          network: ['custom'],
        },
      },
    },
    {
      displayName: 'Custom Chain ID',
      name: 'customChainId',
      type: 'number',
      default: 1,
      description: 'Chain ID for custom network',
      displayOptions: {
        show: {
          network: ['custom'],
        },
      },
    },
    {
      displayName: 'Private Key',
      name: 'privateKey',
      type: 'string',
      typeOptions: {
        password: true,
      },
      default: '',
      placeholder: '0x...',
      description: 'Private key for signing transactions (optional, required for executing swaps)',
    },
    {
      displayName: '1inch API Key',
      name: 'apiKey',
      type: 'string',
      typeOptions: {
        password: true,
      },
      default: '',
      description: 'Optional API key for higher rate limits',
    },
  ];

  authenticate: IAuthenticateGeneric = {
    type: 'generic',
    properties: {
      headers: {
        Authorization: '=Bearer {{$credentials.apiKey}}',
      },
    },
  };

  test: ICredentialTestRequest = {
    request: {
      baseURL: 'https://api.1inch.dev',
      url: '/swap/v6.0/1/tokens',
      method: 'GET',
    },
  };
}
