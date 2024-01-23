import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
  clusterApiUrl,
} from '@solana/web3.js';
  
// 私钥应该是一个64字节的Uint8Array
const secretKey = Uint8Array.from([173,123,162,67,172,180,210,162,148,16,54,244,14,86,35,164,115,224,227,145,224,231,222,129,181,210,70,10,199,1,155,168,224,192,3,111,255,115,190,176,179,180,26,18,232,10,218,27,221,220,169,71,21,62,96,176,169,110,191,174,164,223,35,153]);

async function main() {
  // 连接到Solana集群
  const connection = new Connection(clusterApiUrl('testnet'), 'confirmed');

  // 生成一个新的密钥对用于数据账户
  const newDataAccount = Keypair.generate();
  console.log("数据账户: ", newDataAccount.publicKey)

  // 付款方的Keypair，需要有足够的SOL来支付交易费和租金
  const payer: Keypair = Keypair.fromSecretKey(secretKey);
  console.log("钱包账户: ", payer.publicKey)

  // 你的智能合约程序的公钥
  const programId: PublicKey = new PublicKey('ECToMXPsqKV9b6tYiFTwkZcX7y6dwuLXkPyGhbUwH8S');

  // 获取交易费用
  const rentExemption = await connection.getMinimumBalanceForRentExemption(512); // 假设需要512字节存储空间

  // 创建交易并添加创建账户指令
  const transaction = new Transaction().add(
    SystemProgram.createAccount({
      fromPubkey: payer.publicKey, //付款方账户
      newAccountPubkey: newDataAccount.publicKey, //数据账户
      lamports: rentExemption, //交易费用
      space: 512, //存储空间
      programId,  //程序账户
    }),
  );

  // 签名和发送交易
  const signature = await sendAndConfirmTransaction(connection, transaction, [payer, newDataAccount]);
  console.log(`Transaction successful with signature: ${signature}`);
}
  
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});