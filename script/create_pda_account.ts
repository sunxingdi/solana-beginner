import {
    Connection,
    Keypair,
    PublicKey,
    Transaction,
    TransactionInstruction,
    sendAndConfirmTransaction,
    clusterApiUrl,
    SystemProgram,
  } from '@solana/web3.js';
  
// 私钥应该是一个64字节的Uint8Array
const secretKey = Uint8Array.from([173,123,162,67,172,180,210,162,148,16,54,244,14,86,35,164,115,224,227,145,224,231,222,129,181,210,70,10,199,1,155,168,224,192,3,111,255,115,190,176,179,180,26,18,232,10,218,27,221,220,169,71,21,62,96,176,169,110,191,174,164,223,35,153]);

// 连接到Solana集群
const connection = new Connection(clusterApiUrl('testnet'), 'confirmed');
// const connection = new Connection('https://api.testnet.solana.com', 'confirmed');

// 此函数用来创建PDA账户
async function createPdaAccount(programId: PublicKey, seed: string, initializerAccount: Keypair) {
    // 生成PDA及其bump seed
    const [pda, bumpSeed] = await PublicKey.findProgramAddressSync(
        [Buffer.from(seed)],
        programId
    );
    console.log(`pda: ${pda}`);
    console.log(`bumpSeed: ${bumpSeed}`);

    // 获取PDA账户所需的空间大小
    // 注意：这里假设MyAccountData结构体只包含一个u32类型的数据，因此空间大小为4字节
    // 如果实际数据结构不同，请相应调整
    const accountSpace = 4 + 8; // 4字节数据加上8字节的账户discriminator

    // 创建PDA账户的系统指令
    const createPdaAccountInstruction = SystemProgram.createAccount({
        fromPubkey: initializerAccount.publicKey,
        newAccountPubkey: pda,
        lamports: await connection.getMinimumBalanceForRentExemption(accountSpace),
        space: accountSpace,
        programId,
    });
    console.log(`createPdaAccountInstruction: ${createPdaAccountInstruction}`);

    // 创建交易并添加指令
    const transaction = new Transaction().add(createPdaAccountInstruction);
    console.log(`transaction: ${transaction}`);

    // 签名并发送交易
    const signature = await sendAndConfirmTransaction(
        connection,
        transaction,
        [initializerAccount],
        { commitment: 'confirmed' },
    );

    console.log(`PDA Account created with public key: ${pda.toBase58()}`);
    console.log(`Transaction signature: ${signature}`);
}

async function main() {

    // 程序ID，更换成你的Solana程序的公钥
    const PROGRAM_ID = new PublicKey('ECToMXPsqKV9b6tYiFTwkZcX7y6dwuLXkPyGhbUwH8S');

    // 初始化者账户的秘钥对，更换成你的秘钥对
    const INITIALIZER_ACCOUNT: Keypair = Keypair.fromSecretKey(secretKey);
    console.log("钱包账户: ", INITIALIZER_ACCOUNT.publicKey)

    // 调用函数来创建PDA账户
    createPdaAccount(PROGRAM_ID, 'my_seed', INITIALIZER_ACCOUNT).catch(console.error);
}
  
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});