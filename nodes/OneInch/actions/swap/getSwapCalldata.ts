/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { IExecuteFunctions, INodeExecutionData, INodeProperties } from 'n8n-workflow';
import { AggregationClient } from '../../transport/aggregationClient';
import { getChainId } from '../../constants/networks';
import { validateSwapParams, fromWei, calculateMinReturn } from '../../utils/swapUtils';

export const description: INodeProperties[] = [
  {
    displayName: 'Source Token',
    name: 'srcToken',
    type: 'string',
    required: true,
    default: '',
    placeholder: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    description: 'Address of the token to swap from',
    displayOptions: {
      show: {
        resource: ['swap'],
        operation: ['getSwapCalldata'],
      },
    },
  },
  {
    displayName: 'Destination Token',
    name: 'dstToken',
    type: 'string',
    required: true,
    default: '',
    placeholder: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    description: 'Address of the token to swap to',
    displayOptions: {
      show: {
        resource: ['swap'],
        operation: ['getSwapCalldata'],
      },
    },
  },
  {
    displayName: 'Amount',
    name: 'amount',
    type: 'string',
    required: true,
    default: '',
    placeholder: '1000000000000000000',
    description: 'Amount of source token to swap (in wei)',
    displayOptions: {
      show: {
        resource: ['swap'],
        operation: ['getSwapCalldata'],
      },
    },
  },
  {
    displayName: 'From Address',
    name: 'fromAddress',
    type: 'string',
    required: true,
    default: '',
    placeholder: '0x...',
    description: 'Address that will execute the swap',
    displayOptions: {
      show: {
        resource: ['swap'],
        operation: ['getSwapCalldata'],
      },
    },
  },
  {
    displayName: 'Slippage',
    name: 'slippage',
    type: 'number',
    required: true,
    default: 1,
    description: 'Maximum acceptable slippage percentage (0.01-50)',
    displayOptions: {
      show: {
        resource: ['swap'],
        operation: ['getSwapCalldata'],
      },
    },
  },
  {
    displayName: 'Additional Options',
    name: 'additionalOptions',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: {
      show: {
        resource: ['swap'],
        operation: ['getSwapCalldata'],
      },
    },
    options: [
      {
        displayName: 'Receiver Address',
        name: 'receiver',
        type: 'string',
        default: '',
        description: 'Address to receive swapped tokens (defaults to from address)',
      },
      {
        displayName: 'Fee Percent',
        name: 'fee',
        type: 'number',
        default: 0,
        description: 'Fee percentage (0-3)',
      },
      {
        displayName: 'Referrer Address',
        name: 'referrer',
        type: 'string',
        default: '',
        description: 'Referrer address for fee sharing',
      },
      {
        displayName: 'Protocols',
        name: 'protocols',
        type: 'string',
        default: '',
        placeholder: 'UNISWAP_V3,CURVE',
        description: 'Comma-separated list of protocols to use',
      },
      {
        displayName: 'Gas Price',
        name: 'gasPrice',
        type: 'string',
        default: '',
        description: 'Custom gas price in wei',
      },
      {
        displayName: 'Gas Limit',
        name: 'gasLimit',
        type: 'number',
        default: 0,
        description: 'Maximum gas limit (0 for auto)',
      },
      {
        displayName: 'Disable Estimate',
        name: 'disableEstimate',
        type: 'boolean',
        default: false,
        description: 'Disable gas estimation (faster but less accurate)',
      },
      {
        displayName: 'Permit',
        name: 'permit',
        type: 'string',
        default: '',
        description: 'EIP-2612 permit signature for gasless approval',
      },
      {
        displayName: 'Complexity Level',
        name: 'complexityLevel',
        type: 'options',
        options: [
          { name: 'Simple (0)', value: 0 },
          { name: 'Medium (1)', value: 1 },
          { name: 'Complex (2)', value: 2 },
          { name: 'Very Complex (3)', value: 3 },
        ],
        default: 2,
        description: 'Maximum number of splits per path',
      },
    ],
  },
];

export async function execute(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
  network: string,
  apiKey?: string
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const chainId = getChainId(network);

  if (!chainId) {
    throw new Error(`Unsupported network: ${network}`);
  }

  const client = new AggregationClient(chainId, apiKey);

  for (let i = 0; i < items.length; i++) {
    try {
      const srcToken = this.getNodeParameter('srcToken', i) as string;
      const dstToken = this.getNodeParameter('dstToken', i) as string;
      const amount = this.getNodeParameter('amount', i) as string;
      const fromAddress = this.getNodeParameter('fromAddress', i) as string;
      const slippage = this.getNodeParameter('slippage', i) as number;
      const additionalOptions = this.getNodeParameter('additionalOptions', i) as {
        receiver?: string;
        fee?: number;
        referrer?: string;
        protocols?: string;
        gasPrice?: string;
        gasLimit?: number;
        disableEstimate?: boolean;
        permit?: string;
        complexityLevel?: number;
      };

      // Validate parameters
      const validation = validateSwapParams({
        srcToken,
        dstToken,
        amount,
        slippage,
        fromAddress,
      });

      if (!validation.valid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }

      const swap = await client.getSwap({
        src: srcToken,
        dst: dstToken,
        amount,
        from: fromAddress,
        slippage,
        receiver: additionalOptions.receiver,
        fee: additionalOptions.fee,
        referrer: additionalOptions.referrer,
        protocols: additionalOptions.protocols,
        gasPrice: additionalOptions.gasPrice,
        gasLimit: additionalOptions.gasLimit,
        disableEstimate: additionalOptions.disableEstimate,
        permit: additionalOptions.permit,
        complexityLevel: additionalOptions.complexityLevel,
        includeTokensInfo: true,
        includeProtocols: true,
        includeGas: true,
      });

      const srcDecimals = swap.srcToken?.decimals || 18;
      const dstDecimals = swap.dstToken?.decimals || 18;
      const minReturn = calculateMinReturn(swap.dstAmount, slippage);

      returnData.push({
        json: {
          chainId,
          network,
          srcToken: swap.srcToken,
          dstToken: swap.dstToken,
          srcAmount: amount,
          srcAmountFormatted: fromWei(amount, srcDecimals),
          dstAmount: swap.dstAmount,
          dstAmountFormatted: fromWei(swap.dstAmount, dstDecimals),
          minReturnAmount: minReturn,
          minReturnFormatted: fromWei(minReturn, dstDecimals),
          slippage,
          protocols: swap.protocols,
          tx: {
            from: swap.tx.from,
            to: swap.tx.to,
            data: swap.tx.data,
            value: swap.tx.value,
            gas: swap.tx.gas,
            gasPrice: swap.tx.gasPrice,
          },
        },
        pairedItem: { item: i },
      });
    } catch (error) {
      if (this.continueOnFail()) {
        returnData.push({
          json: {
            error: error instanceof Error ? error.message : String(error),
          },
          pairedItem: { item: i },
        });
        continue;
      }
      throw error;
    }
  }

  return returnData;
}
