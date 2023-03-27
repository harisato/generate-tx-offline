## Prepare

### Store key of multisig wallet to local keystore

- If pubkeys of owners not in local keystore, import using `aurad keys add`:

```
aurad keys add \
    test1 \
    --pubkey='{"@type":"/cosmos.crypto.secp256k1.PubKey","key":"Asc2LPPqgjWTuKvGZMKrhLXUxFjyLRtxy4mBtxqw3RG2"}'

aurad keys add \
    test2 \
    --pubkey='{"@type":"/cosmos.crypto.secp256k1.PubKey","key":"AmFtbMlegjibAduEBfNyZcVjrIN3W8JzGu/eIGzBUDVI"}'

```

- Create multisig wallet:

```
aurad keys add \
    multi-2 \
    --multisig=test1,test2 \
    --multisig-threshold=2

- name: multi-2
  type: multi
  address: aura19rc6yugpmq5gmzhz09p8w9sfqppu9r5m7u3jhy
  pubkey: '{"@type":"/cosmos.crypto.multisig.LegacyAminoPubKey","threshold":2,"public_keys":[{"@type":"/cosmos.crypto.secp256k1.PubKey","key":"Asc2LPPqgjWTuKvGZMKrhLXUxFjyLRtxy4mBtxqw3RG2"},{"@type":"/cosmos.crypto.secp256k1.PubKey","key":"AmFtbMlegjibAduEBfNyZcVjrIN3W8JzGu/eIGzBUDVI"}]}'
  mnemonic: ""
```

- Deposit some token to multisig wallet

## STEP 1 - Create tx

- Edit config in config.json

- Run app:

```
yarn start
```

- Output: unsigned.json

## STEP 2: Sign

- Owner 1 & 2 sign:

```
aurad tx sign \
    unsigned.json \
    --from test1 \
    --multisig aura19rc6yugpmq5gmzhz09p8w9sfqppu9r5m7u3jhy \
    --sign-mode amino-json \
    --chain-id euphoria-2 \
    --node https://rpc.euphoria.aura.network:443 \
    --output-document=tx-signed-test1.json

aurad tx sign \
    unsigned.json \
    --multisig aura19rc6yugpmq5gmzhz09p8w9sfqppu9r5m7u3jhy \
    --from test2 \
    --sign-mode amino-json \
    --chain-id euphoria-2 \
    --node https://rpc.euphoria.aura.network:443 \
    --output-document=tx-signed-test2.json
```

- Create multi-signature

```
aurad tx multisign \
    unsigned.json \
    multi-2 \
    tx-signed-test1.json tx-signed-test2.json \
    --chain-id euphoria-2 \
    --node https://rpc.euphoria.aura.network:443 > signedTx.json
```

## STEP 3: Broadcast

```
aurad tx broadcast \
    signedTx.json \
    --chain-id euphoria-2 \
    --node https://rpc.euphoria.aura.network:443
```
