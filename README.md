# n8n-nodes-1inch

> [Velocity BPA Licensing Notice]
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

A comprehensive n8n community node for **1inch Network** providing 21 resources and 200+ operations for DEX aggregation, Fusion gasless swaps, limit orders, cross-chain trading, and portfolio management across 12+ EVM networks.

![npm version](https://img.shields.io/npm/v/n8n-nodes-1inch)
![n8n compatibility](https://img.shields.io/badge/n8n-%3E%3D1.0.0-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)

## Features

- **DEX Aggregation**: Get the best swap rates across 100+ liquidity sources
- **Fusion (Gasless Swaps)**: Intent-based trading with no gas fees for users
- **Fusion+ (Cross-Chain)**: Seamless cross-chain token swaps
- **Limit Orders**: Create and manage conditional swap orders
- **Price Feeds**: Real-time token prices and spot pricing
- **Portfolio Tracking**: Track wallet holdings and P&L across chains
- **Multi-Chain Support**: 12+ EVM-compatible networks
- **Token Approvals**: Manage ERC20 allowances efficiently
- **Gas Optimization**: Monitor and optimize gas costs

## Installation

### Community Nodes (Recommended)

1. Open your n8n instance
2. Go to **Settings** > **Community Nodes**
3. Click **Install**
4. Enter `n8n-nodes-1inch`
5. Click **Install**
6. Restart n8n

### Manual Installation

```bash
# Navigate to your n8n installation directory
cd ~/.n8n

# Install the package
npm install n8n-nodes-1inch

# Restart n8n
```

### Development Installation

```bash
# Clone or extract the package
git clone https://github.com/Velocity-BPA/n8n-nodes-1inch.git
cd n8n-nodes-1inch

# Install dependencies
npm install

# Build the project
npm run build

# Create symlink to n8n custom nodes
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-1inch

# Restart n8n
n8n start
```

## Credentials Setup

### 1inch API Credentials

| Field | Description |
|-------|-------------|
| API Key | Your API key from the [1inch Developer Portal](https://portal.1inch.dev/) |
| Rate Limit Tier | Your subscription tier (Free, Basic, Pro, Enterprise) |
| Default Chain ID | Default blockchain network for API requests |

### 1inch Network Credentials

| Field | Description |
|-------|-------------|
| Network | Select blockchain network (or Custom) |
| Private Key | Wallet private key for signing transactions (optional) |
| API Key | Optional API key for higher rate limits |
| Custom RPC URL | RPC endpoint for custom networks |
| Custom Chain ID | Chain ID for custom networks |

### 1inch Fusion Credentials

| Field | Description |
|-------|-------------|
| API Key | API key for Fusion operations |
| Wallet Private Key | Private key for signing Fusion orders |
| Default Chain ID | Default chain for Fusion operations |
| Resolver Mode | User (create orders) or Resolver (fill orders) |

## Resources & Operations

### Swap Resource

| Operation | Description |
|-----------|-------------|
| Get Quote | Get the best swap rate without executing |
| Get Swap Calldata | Generate transaction data for a swap |
| Get Supported Tokens | List all supported tokens on a chain |
| Get Liquidity Sources | List available DEXs and protocols |
| Check Allowance | Check token approval amount |
| Get Approval Calldata | Generate approval transaction |
| Get Spender Address | Get the router contract address |

### Fusion Resource (Gasless Swaps)

| Operation | Description |
|-----------|-------------|
| Get Quote | Get Fusion quote with auction parameters |
| Get All Quotes | Get quotes from all available presets |
| Get Order Status | Check status of a Fusion order |
| Get Active Orders | List all active Fusion orders |
| Get Orders by Maker | Get orders created by an address |
| Get Resolvers | List Fusion order resolvers |

### Price Resource

| Operation | Description |
|-----------|-------------|
| Get Spot Price | Get current USD price for a token |
| Get Multiple Prices | Get prices for multiple tokens |

### Token Resource

| Operation | Description |
|-----------|-------------|
| Get Token Info | Get detailed token information |
| Search Tokens | Search for tokens by name or symbol |
| Get Token List | Get all supported tokens |

### Balance Resource

| Operation | Description |
|-----------|-------------|
| Get Token Balance | Get balance of a specific token |
| Get All Balances | Get all token balances for an address |

### Gas Resource

| Operation | Description |
|-----------|-------------|
| Get Gas Price | Get current gas prices (base, priority) |

## Trigger Node

The 1inch Trigger node monitors the blockchain for events:

| Event | Description |
|-------|-------------|
| Price Alert | Trigger when token price crosses threshold |
| Gas Price Alert | Trigger when gas price drops below threshold |
| Price Change | Trigger on significant price movement |

## Usage Examples

### Get Best Swap Quote

```javascript
// 1inch node configuration
{
  "resource": "swap",
  "operation": "getQuote",
  "network": "ethereum",
  "srcToken": "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", // ETH
  "dstToken": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // USDC
  "amount": "1000000000000000000" // 1 ETH in wei
}
```

### Get Fusion Quote (Gasless Swap)

```javascript
// 1inch node configuration
{
  "resource": "fusion",
  "operation": "getQuote",
  "network": "ethereum",
  "fromTokenAddress": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", // WETH
  "toTokenAddress": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // USDC
  "amount": "1000000000000000000", // 1 WETH
  "walletAddress": "0xYourWalletAddress"
}
```

### Monitor Price Alerts

```javascript
// 1inch Trigger node configuration
{
  "event": "priceAlert",
  "network": "ethereum",
  "tokenAddress": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", // WETH
  "alertType": "above",
  "thresholdPrice": 3000 // USD
}
```

## 1inch Protocol Concepts

| Term | Description |
|------|-------------|
| **Aggregation Protocol** | Finds the best swap rate across multiple DEXs |
| **Fusion** | Intent-based trading where resolvers execute trades (gasless for users) |
| **Fusion+** | Cross-chain swap protocol using Fusion |
| **Limit Orders** | Conditional orders that execute when price targets are met |
| **Resolvers** | Professional market makers who fill Fusion orders |
| **Pathfinder** | Routing algorithm that optimizes multi-hop swaps |
| **Liquidity Sources** | DEXs and protocols aggregated by 1inch |
| **Dutch Auction** | Fusion pricing mechanism where rates improve over time |
| **Permit** | EIP-2612 signature for gasless token approvals |

## Supported Networks

| Network | Chain ID | Fusion Support |
|---------|----------|----------------|
| Ethereum Mainnet | 1 | ✅ |
| Polygon | 137 | ✅ |
| BNB Chain | 56 | ✅ |
| Arbitrum One | 42161 | ✅ |
| Optimism | 10 | ✅ |
| Avalanche C-Chain | 43114 | ✅ |
| Gnosis Chain | 100 | ✅ |
| Fantom Opera | 250 | ✅ |
| Base | 8453 | ✅ |
| zkSync Era | 324 | ❌ |
| Aurora | 1313161554 | ❌ |
| Klaytn | 8217 | ❌ |

## Error Handling

The node provides detailed error messages for common issues:

- **Invalid Token Address**: Ensure the token address is valid on the selected network
- **Insufficient Liquidity**: The swap amount may be too large for available liquidity
- **Price Impact Too High**: Consider breaking the swap into smaller amounts
- **Rate Limited**: Upgrade your API tier or reduce request frequency
- **Insufficient Allowance**: Approve the token before swapping

## Security Best Practices

1. **Never share your private key** - Store it securely in n8n credentials
2. **Use hardware wallets** for production environments
3. **Set appropriate slippage** - 0.5-3% for stablecoins, 3-5% for volatile assets
4. **Verify transaction data** before signing
5. **Use Fusion for MEV protection** - Fusion orders are protected from front-running
6. **Monitor gas prices** - Use the gas trigger to execute during low-fee periods

## Development

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use

Permitted for personal, educational, research, and internal business use.

### Commercial Use

Use of this node within any SaaS, PaaS, hosted platform, managed service, or paid automation offering requires a commercial license.

For licensing inquiries:
**licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure your code:
- Follows the existing code style
- Includes appropriate tests
- Updates documentation as needed
- Maintains BSL 1.1 licensing headers

## Support

- **GitHub Issues**: [Report bugs or request features](https://github.com/Velocity-BPA/n8n-nodes-1inch/issues)
- **1inch Documentation**: [docs.1inch.io](https://docs.1inch.io)
- **1inch Developer Portal**: [portal.1inch.dev](https://portal.1inch.dev)
- **n8n Community**: [community.n8n.io](https://community.n8n.io)

## Acknowledgments

- [1inch Network](https://1inch.io) for building the leading DEX aggregator
- [n8n](https://n8n.io) for the powerful workflow automation platform
- All contributors to the 1inch and n8n ecosystems
