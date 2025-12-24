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

export class OneInchFusion implements ICredentialType {
  name = 'oneInchFusion';
  displayName = '1inch Fusion';
  documentationUrl = 'https://docs.1inch.io/docs/fusion-swap/introduction';
  properties: INodeProperties[] = [
    {
      displayName: 'API Key',
      name: 'apiKey',
      type: 'string',
      typeOptions: {
        password: true,
      },
      default: '',
      required: true,
      description: 'Your 1inch Developer Portal API key for Fusion',
    },
    {
      displayName: 'Wallet Private Key',
      name: 'privateKey',
      type: 'string',
      typeOptions: {
        password: true,
      },
      default: '',
      required: true,
      placeholder: '0x...',
      description: 'Private key for signing Fusion orders',
    },
    {
      displayName: 'Default Chain ID',
      name: 'defaultChainId',
      type: 'options',
      default: 1,
      options: [
        { name: 'Ethereum (1)', value: 1 },
        { name: 'Polygon (137)', value: 137 },
        { name: 'BNB Chain (56)', value: 56 },
        { name: 'Arbitrum (42161)', value: 42161 },
        { name: 'Optimism (10)', value: 10 },
        { name: 'Avalanche (43114)', value: 43114 },
        { name: 'Gnosis (100)', value: 100 },
        { name: 'Base (8453)', value: 8453 },
      ],
      description: 'Default chain for Fusion operations (Fusion is not available on all chains)',
    },
    {
      displayName: 'Resolver Mode',
      name: 'resolverMode',
      type: 'options',
      default: 'user',
      options: [
        {
          name: 'User (Create Orders)',
          value: 'user',
        },
        {
          name: 'Resolver (Fill Orders)',
          value: 'resolver',
        },
      ],
      description: 'Whether you are creating orders as a user or filling them as a resolver',
    },
    {
      displayName: 'Resolver Private Key',
      name: 'resolverPrivateKey',
      type: 'string',
      typeOptions: {
        password: true,
      },
      default: '',
      placeholder: '0x...',
      description: 'Private key for resolver operations (only for resolvers)',
      displayOptions: {
        show: {
          resolverMode: ['resolver'],
        },
      },
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
      url: '/fusion/resolver/v1.0/1/resolvers',
      method: 'GET',
    },
  };
}
