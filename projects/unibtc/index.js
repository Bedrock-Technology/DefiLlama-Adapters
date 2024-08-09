const ADDRESSES = require('../helper/coreAssets.json')
const sdk = require('@defillama/sdk')
const NATIVE_TOKEN_INTERNAL_ADDRESS = ADDRESSES.null


// This adapter calculate the total locked value of native/wrapped BTC across multiple blockchains that supported by
// the uniBTC protocol. uniBTC is minted when users deposit native/wrapped BTC through the Vault contract. 1 uniBTC
// always equals 1 native/wrapped BTC. Reference: https://github.com/Bedrock-Technology/uniBTC
//
// NOTE: Update token addresses here as needed when new tokens are added to the vaults.


// -- Contract Addresses in the Bitcoin Ecosystem
const bsquaredUniBTC = "0x93919784C523f39CACaa98Ee0a9d96c3F32b593e" // https://explorer.bsquared.network/address/0x93919784C523f39CACaa98Ee0a9d96c3F32b593e
const bsquaredVault = "0xF9775085d726E782E83585033B58606f7731AB18"  // https://explorer.bsquared.network/address/0xF9775085d726E782E83585033B58606f7731AB18
const bsquaredWBTC = "0x4200000000000000000000000000000000000006" // https://explorer.bsquared.network/address/0x4200000000000000000000000000000000000006

const biitlayerUniBTC = "0x93919784C523f39CACaa98Ee0a9d96c3F32b593e"  // https://www.btrscan.com/address/0x93919784C523f39CACaa98Ee0a9d96c3F32b593e?tab=Transactions
const bitlayerVault = "0xF9775085d726E782E83585033B58606f7731AB18"  // https://www.btrscan.com/address/0xF9775085d726E782E83585033B58606f7731AB18?tab=Transactions
const bitlayerWBTC = "0xfF204e2681A6fA0e2C3FaDe68a1B28fb90E4Fc5F" // https://www.btrscan.com/address/0xfF204e2681A6fA0e2C3FaDe68a1B28fb90E4Fc5F?tab=Transactions

const merlinUniBTC  = "0x93919784C523f39CACaa98Ee0a9d96c3F32b593e" // https://scan.merlinchain.io/address/0x93919784C523f39CACaa98Ee0a9d96c3F32b593e
const merlinVault = "0xF9775085d726E782E83585033B58606f7731AB18"  // https://scan.merlinchain.io/address/0xF9775085d726E782E83585033B58606f7731AB18
const merlinMBTC = "0xB880fd278198bd590252621d4CD071b1842E9Bcd" // https://scan.merlinchain.io/address/0xB880fd278198bd590252621d4CD071b1842E9Bcd
const merlinWBTC = "0xF6D226f9Dc15d9bB51182815b320D3fBE324e1bA" // https://scan.merlinchain.io/address/0xF6D226f9Dc15d9bB51182815b320D3fBE324e1bA

// -- Contract Addresses in the Ethereum Ecosystem
const ethereumUniBTC = "0x004E9C3EF86bc1ca1f0bB5C7662861Ee93350568" // https://etherscan.io/address/0x004E9C3EF86bc1ca1f0bB5C7662861Ee93350568
const ethereumVault = "0x047D41F2544B7F63A8e991aF2068a363d210d6Da"  // https://etherscan.io/address/0x047d41f2544b7f63a8e991af2068a363d210d6da
const ethereumFBTC = "0xC96dE26018A54D51c097160568752c4E3BD6C364" // https://etherscan.io/address/0xc96de26018a54d51c097160568752c4e3bd6c364
const ethereumWBTC = "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599" // https://etherscan.io/address/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599

const mantleUniBTC = "0x93919784C523f39CACaa98Ee0a9d96c3F32b593e" // https://mantlescan.xyz/address/0x93919784C523f39CACaa98Ee0a9d96c3F32b593e
const mantleVault = "0xF9775085d726E782E83585033B58606f7731AB18"  // https://mantlescan.xyz/address/0xF9775085d726E782E83585033B58606f7731AB18
const mantleFBTC = "0xC96dE26018A54D51c097160568752c4E3BD6C364" // https://mantlescan.xyz/address/0xc96de26018a54d51c097160568752c4e3bd6c364

const optimismUniBTC = "0x93919784C523f39CACaa98Ee0a9d96c3F32b593e" // https://optimistic.etherscan.io/address/0x93919784C523f39CACaa98Ee0a9d96c3F32b593e
const optimismVault = "0xF9775085d726E782E83585033B58606f7731AB18"  // https://optimistic.etherscan.io/address/0xF9775085d726E782E83585033B58606f7731AB18
const optimismWBTC = "0x68f180fcCe6836688e9084f035309E29Bf0A2095" // https://optimistic.etherscan.io/address/0x68f180fcCe6836688e9084f035309E29Bf0A2095

function vaultTvl(vault, erc20Tokens, includeNativeBTC) {
  return async (api) => {
    // -- BALANCE OF NATIVE COIN (Only for Bitcoin Ecosystem)
    if (includeNativeBTC) {
      const nativeBalance = await sdk.api.eth.getBalance({
        target: vault,
        chain: api.chain
      })
      api.add(NATIVE_TOKEN_INTERNAL_ADDRESS, nativeBalance.output)
    }

    // -- BALANCE OF ERC20 TOKENS
    const erc20Balances = [];
    for (const erc20Token of erc20Tokens) {
      const balance = await api.call({
        abi: 'erc20:balanceOf',
        target: erc20Token,
        params: [vault],
      });
      erc20Balances.push(balance);
    }
    api.addTokens(erc20Tokens, erc20Balances)
  }
}

module.exports = {
  bsquared: {
    tvl: vaultTvl(bsquaredVault, [bsquaredWBTC], true),
  },
  btr: {
    tvl: vaultTvl(bitlayerVault, [bitlayerWBTC], true),
  },
  merlin: {
    tvl: vaultTvl(merlinVault, [merlinWBTC, merlinMBTC], true),
  },
  ethereum: {
    tvl: vaultTvl(ethereumVault, [ethereumFBTC, ethereumWBTC], false),
  },
  mantle: {
    tvl: vaultTvl(mantleVault, [mantleFBTC], false),
  },
  optimism: {
    tvl: vaultTvl(optimismVault, [optimismWBTC], false),
  }
};