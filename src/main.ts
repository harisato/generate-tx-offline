import * as fs from 'fs';
import { calculateFee, GasPrice, StdFee } from '@cosmjs/stargate';
import config from '../config.json';

const { delegatorAddress, validatorAddresses, defaultGasPrice, denom, delegateAmount, owners } = config;

const amount = {
  denom,
  amount: delegateAmount.toString(),
};

const buildTx = (messages: any[], fee: StdFee) => {
  return JSON.stringify({
    body: {
      messages,
      memo: '',
      timeout_height: '0',
      extension_options: [],
      non_critical_extension_options: [],
    },
    auth_info: {
      signer_infos: [],
      fee: {
        amount: fee.amount,
        gas_limit: fee.gas,
        payer: '',
        granter: '',
      },
    },
    signatures: [],
  });
};

const buildMessages = () => {
  return validatorAddresses.map((validatorAddress) => {
    return {
      '@type': '/cosmos.staking.v1beta1.MsgDelegate',
      delegator_address: delegatorAddress,
      validator_address: validatorAddress,
      amount,
    };
  });
};

const estimateFee = (): StdFee => {
  const gasLimit = 250000 + 250000 * validatorAddresses.length * 0.3 + 250000 * owners * 0.13;
  const gasPrice = GasPrice.fromString(String(defaultGasPrice).concat(denom));
  const sendFee = calculateFee(gasLimit, gasPrice);
  return sendFee;
};

const saveToFile = (jsonString: string) => {
  fs.writeFile('./unsigned.json', jsonString, (err) => {
    if (err) {
      console.log('Error writing file', err);
    } else {
      console.log('Successfully wrote file');
    }
  });
};

const main = () => {
  const messages = buildMessages();

  const fee = estimateFee();

  const unsignedTx = buildTx(messages, fee);
  saveToFile(unsignedTx);
};

main();
