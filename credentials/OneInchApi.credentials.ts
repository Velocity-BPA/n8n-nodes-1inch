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

export class OneInchApi implements ICredentialType {
  name = 'oneInchApi';
  displayName = '1inch API';
  documentationUrl = 'https://portal.1inch.dev/';
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
      description: 'Your 1inch Developer Portal API key',
    },
    {
      displayName: 'Rate Limit Tier',
      name: 'rateLimitTier',
      type: 'options',
      default: 'free',
      options: [
        { name: 'Free (1 req/sec)', value: 'free' },
        { name: 'Basic (5 req/sec)', value: 'basic' },
        { name: 'Pro (20 req/sec)', value: 'pro' },
        { name: 'Enterprise (100 req/sec)', value: 'enterprise' },
      ],
      description: 'Your API rate limit tier from the 1inch Developer Portal',
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
        { name: 'Fantom (250)', value: 250 },
        { name: 'Base (8453)', value: 8453 },
        { name: 'zkSync Era (324)', value: 324 },
        { name: 'Aurora (1313161554)', value: 1313161554 },
        { name: 'Klaytn (8217)', value: 8217 },
      ],
      description: 'Default chain to use for API requests',
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
